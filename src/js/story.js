/* eslint-disable max-len, no-use-before-define, no-sequences */
import el from './utils/element';
import defineCodeMirrorCommands from './utils/codeMirrorCommands';
import commitDiff from './utils/commitDiff';
import { connectCommits, empty as emptySVGGraph } from './utils/svg';
import confirmPopUp from './popups/confirmPopUp';
import { CHECK_ICON, CLOSE_ICON } from './utils/icons';
import { truncate } from './utils';
import cleanUpMarkdown from './utils/cleanUpMarkdown';

const SVG_X = 4;
const SVG_INITIAL_Y = 25;

export default function story(state, onChange) {
  const container = el.withFallback('.story');
  const git = state.git();
  let editor = null, editMode = false, currentlyEditingHash;
  const onSave = message => git.amend(currentlyEditingHash, { message });
  const onCancel = message => {
    editMode = false;
    editor = null;
    if (message === '') {
      git.amend(currentlyEditingHash, {
        message: formatDate()
      });
    }
    render();
  };

  if (!container.found()) return () => {};

  const render = () => {
    const numOfCommits = Object.keys(git.log()).length;
    const areThereAnyCommits = numOfCommits > 0;
    const diffs = commitDiff(areThereAnyCommits ? git.show().files : [], git.getAll());
    const renderedCommits = renderCommits(git, editMode, diffs.length > 0, currentlyEditingHash);

    container.attr('class', numOfCommits <= 1 ? 'editor-section story no-graph' : 'editor-section story');
    container.content(`
      <div>
        ${ renderedCommits ? '<div data-export="list">' + renderedCommits + '</div>' : '' }
        ${ diffs.length > 0 ?
          `<div class="working-directory">
            <div class="diffs">
              ${ diffs.map(renderDiff).join('') }
            </div>
            <div class="clear commit-buttons-nav">
              <a href="javascript:void(0)" data-export="editButton" class="commit-button left">
                &#10004; Save
              </a>
              <a href="javascript:void(0)" data-export="addButton" class="commit-button left">
                &#10004; New commit
              </a>
              ${ git.getAll().length > 0 ?
                `<a href="javascript:void(0)" data-export="discardButton" class="commit-button right">
                  &#10006; Discard changes
                </a>` : ''
              }
            </div>
          </div>
          ` : '' }
      </div>
      <div class="story-arrows"><svg id="svg-canvas" width="32px" height="98%"></svg></div>
    `).forEach(el => {
      if (el.attr('data-export') === 'checkoutLink') {
        el.onClick(() => {
          git.checkout(el.attr('data-commit-hash'));
          onChange();
        });
      }
      if (el.attr('data-export') === 'editMessage') {
        el.onClick(() => {
          editMode = true;
          currentlyEditingHash = el.attr('data-commit-hash');
          render();
        });
      }
      if (el.attr('data-export') === 'deleteCommit') {
        el.onClick(() => {
          confirmPopUp('Deleting a commit', `Deleting "${ el.attr('data-commit-message') }" commit. Are you sure?`, decision => {
            if (decision) {
              git.adios(el.attr('data-commit-hash'));
            }
          });
        });
      }
    });

    const {
      editButton,
      addButton,
      discardButton,
      messageArea,
      confirmButton,
      closeButton,
      publishStatus,
      injectFile
    } = container.namedExports();

    editButton && editButton.onClick(() => {
      git.amend();
      render();
    });

    addButton && addButton.onClick(() => {
      editMode = true;
      git.add();
      currentlyEditingHash = git.commit('');
      render();
    });

    discardButton && discardButton.onClick(() => {
      confirmPopUp('Discard changes', 'You are about to discard your current changes. Are you sure?', decision => {
        if (decision) {
          git.discard();
          onChange();
        }
      });
    });

    if (messageArea) {
      editor = codeMirror(
        messageArea,
        state.getEditorSettings(),
        git.show(currentlyEditingHash).message,
        message => {
          confirmButton.css('opacity', '0.3');
          onSave(message);
        },
        function onChange() {
          confirmButton.css('opacity', '1');
          numOfCommits > 1 && renderGraph(git.logAsTree());
        },
        onCancel
      );
      confirmButton.onClick(() => {
        onSave(editor.getValue());
        editMode = false;
        editor = null;
        render();
      });
      closeButton.onClick(() => {
        editMode = false;
        editor = null;
        render();
      });
      publishStatus.onChange(position => {
        git.amend(currentlyEditingHash, {
          message: git.show(currentlyEditingHash).message,
          meta: { position }
        });
        editMode = false;
        editor = null;
        render();
      });
      injectFile.onChange(str => {
        setTimeout(() => {
          editor.focus();
          editor.refresh();
          editor.replaceSelection(str);
          injectFile.e.value = '';
        }, 1);
      });
    }

    numOfCommits > 1 && renderGraph(git.logAsTree());
  };

  // state.listen(event => {
  //   if (!editMode) render();
  // });

  render();

  return function addToStory(code, otherEditor) {
    if (editMode && editor) {
      otherEditor.setCursor({ line: 0, ch: 0 });
      setTimeout(() => {
        editor.focus();
        editor.refresh();
        editor.replaceSelection(code);
      }, 1);
    }
  };
}
function renderCommits(git, editMode, unstaged, currentlyEditingHash) {
  const root = git.logAsTree();

  function process(commit) {
    const { hash, message, derivatives, meta } = commit;

    const currentPosition = meta && parseInt(meta.position, 10) > 0 ? `#${ parseInt(meta.position, 10) }` : '';
    const messageFirstLine = getTitleFromCommitMessage(message);
    const linkLabel = (git.head() === hash ? '<span class="commit-head">&#8594;</span>' : '') + messageFirstLine;
    const link = !unstaged && !editMode ?
      `<a href="javascript:void(0);" data-export="checkoutLink" data-commit-hash="${ hash }">${ linkLabel }</a>` :
      `<span style="opacity:0.4;">${ linkLabel }</span>`;

    return `
      <div class="commit${ currentlyEditingHash === hash && editMode ? ' commit-edit' : ''}" id="c${ hash }">
        ${
          currentlyEditingHash === hash && editMode ?
            `
              <div class="story-form">
                <div class="story-form-bar">
                  <a href="javascript:void(0);" data-export="confirmButton">${ CHECK_ICON(12) } save</a>
                  <a href="javascript:void(0);" data-export="closeButton">${ CLOSE_ICON(12) } cancel</a>
                  <select data-export="publishStatus">
                    ${ getPublishOptions(git, hash) }
                  </select>
                  <select data-export="injectFile">
                    <option value="">inject a file</option>
                    ${ getFileInjectionOptions(git, hash) }
                  </select>
                </div>
                <div data-export="messageArea" class="message-area"></div>
              </div>
            ` :
            `
              <div class="commit-nav">
                <span class="current-position">${ currentPosition }</span>
                <a href="javascript:void(0);" data-export="editMessage" data-commit-hash="${ hash }">&#9998; story</a>
                ${ !unstaged ? `<a href="javascript:void(0);" data-export="deleteCommit" data-commit-hash="${ hash }" data-commit-message="${ messageFirstLine }">&#10006; delete</a>` : '' }
              </div>
              ${ link }
            `
        }
      </div>
    ` + derivatives.map(process).join('');
  }

  return root !== null ? process(root, 0) : '';
}
function codeMirror(container, editorSettings, value, onSave, onChange, onCancel) {
  defineCodeMirrorCommands(CodeMirror);

  const editor = CodeMirror(container.e, {
    value: value || '',
    mode: 'markdown',
    tabSize: 2,
    lineNumbers: false,
    autofocus: true,
    foldGutter: false,
    gutters: [],
    styleSelectedText: true,
    lineWrapping: true,
    highlightFormatting: true,
    ...editorSettings
  });
  const save = () => onSave(editor.getValue());
  const change = () => onChange(editor.getValue());

  editor.on('change', change);
  editor.setOption('extraKeys', {
    'Ctrl-S': save,
    'Cmd-S': save,
    'Esc': () => onCancel(editor.getValue()),
    'Ctrl-Enter': () => (save(), onCancel(editor.getValue())),
    'Cmd-Enter': () => (save(), onCancel(editor.getValue()))
  });
  CodeMirror.normalizeKeyMap();
  setTimeout(() => editor.focus(), 50);

  return editor;
};
function renderDiff(diff) {
  let diffChangeLabel = '';
  let diffAdditionalInfo = '';

  switch (diff[0]) {
    case 'E':
      diffChangeLabel = 'edit';
      diffAdditionalInfo = diff[2].html;
    break;
    case 'N':
      diffChangeLabel = 'new';
    break;
    case 'D':
      diffChangeLabel = 'deleted';
    break;
    case 'R':
      diffChangeLabel = 'renamed';
      diffAdditionalInfo = diff[2];
    break;
  }

  return `
    <div class="diff">
      <div><span class="label label-${ diff[0] }">${ diffChangeLabel }</span></div>
      <div class="diffA">${ diff[1] }</div>
      <div class="diffB">${ diffAdditionalInfo.replace(/%0A/g, '<br />') }</div>
    </div>
  `;
}
function formatDate(date = new Date()) {
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const day = date.getDate(), monthIndex = date.getMonth(), year = date.getFullYear().toString().substr(-2);

  return day + ' ' + monthNames[monthIndex] + ' ' + year + ' ' + date.getHours() + ':' + date.getMinutes();
}
function renderGraph(tree) {
  setTimeout(() => {
    emptySVGGraph();

    const { connections, yValues } = renderCommitGraphs(tree);

    connections.forEach(([top, down]) => connectCommits(SVG_X, yValues[top], yValues[down]));
  }, 30);
}
function renderCommitGraphs({ parent, hash, derivatives }, result = { y: SVG_INITIAL_Y, connections: [], yValues: {} }) {
  result.yValues[hash] = result.y;
  if (el.exists('#c' + hash)) {
    result.y += el('#c' + hash).e.offsetHeight + 0.3;
  }
  if (parent !== null) {
    result.connections.push([parent, hash]);
  }
  if (derivatives.length > 0) {
    derivatives.forEach(commit => renderCommitGraphs(commit, result));
  }
  return result;
}
function getPublishOptions(git, currentHash) {
  const allCommits = git.log();
  const { meta } = allCommits[currentHash];
  const currentPosition = meta ? parseInt(meta.position, 10) : null;
  let options = [];

  options.push(`<option value="0"${ currentPosition === 0 ? 'selected="selected"' : '' }>not in story</option>`);
  for (let i = 1; i < Object.keys(allCommits).length + 1; i++) {
    options.push(`<option value="${ i }" ${ currentPosition === i ? 'selected="selected"' : '' }>position #${ i }</option>`);
  }

  return options.join('');
}
function getFileInjectionOptions(git, currentHash) {
  const files = git.show(currentHash).files;

  return files.map(file => `<option value="{file:${ file[0] }}">${ file[0] }</option>`);
}
function getTitleFromCommitMessage(text) {
  return cleanUpMarkdown(truncate(text.split('\n').shift(), 36));
}
