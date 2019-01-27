/* eslint-disable max-len, no-use-before-define, no-sequences, no-undef */
import el from './utils/element';
import defineCodeMirrorCommands from './utils/codeMirrorCommands';
import commitDiff from './utils/commitDiff';
import { connectCommits, empty as emptySVGGraph } from './utils/svg';
import confirmPopUp from './popups/confirmPopUp';
import { CHECK_ICON, CLOSE_ICON, TRASH_ICON, DOT_CIRCLE, BOOK } from './utils/icons';
import { truncate } from './utils';
import cleanUpMarkdown from './utils/cleanUpMarkdown';
import { DEBUG } from './constants';

const SVG_X = 4;
const SVG_INITIAL_Y = 25;

export default function story(state, onChange) {
  const container = el.withFallback('.story');
  const git = state.git();
  let editor = null,
    editMode = false,
    currentlyEditingHash;
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
    DEBUG && console.log('story:render');
    const allCommits = git.log();
    const commits = Object.keys(allCommits).map(hash => ({
      hash,
      message: allCommits[hash].message,
      position: allCommits[hash].meta ? parseInt(allCommits[hash].meta.position, 10) || null : null
    })).sort((a, b) => {
      if (a.position !== null && b.position !== null) {
        return a.position - b.position;
      } else if (a.position !== null && b.position === null) {
        return -1;
      } else if (a.position === null && b.position !== null) {
        return 1;
      }
      return a.hash - b.hash;
    });
    const numOfCommits = commits.length;
    const diffs = commitDiff(numOfCommits > 0 ? git.show().files : [], git.getAll());
    const renderedCommits = renderCommits(git, commits, editMode, currentlyEditingHash);

    container.attr('class', numOfCommits <= 1 ? 'editor-section story no-graph' : 'editor-section story');
    container.content(`
      ${ renderedCommits !== '' ? '<div data-export="list">' + renderedCommits + '</div>' : '' }
      ${ renderDiffs(git, diffs) }
      <div class="story-arrows"><svg id="svg-canvas" width="32px" height="98%"></svg></div>
    `).forEach(el => {
        if (el.attr('data-export') === 'checkoutLink') {
          el.onClick(() => {
            const hashToCheckout = el.attr('data-commit-hash');

            if (diffs.length > 0) {
              confirmPopUp(
                'Checkout',
                'You are about to checkout another commit. You have an unstaged changes. Are you sure?',
                decision => {
                  if (decision && allCommits[hashToCheckout]) {
                    git.checkout(hashToCheckout, true);
                    onChange();
                    render();
                  }
                }
              );
            } else {
              if (allCommits[hashToCheckout]) {
                git.checkout(hashToCheckout);
                onChange();
                render();
              }
            }
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
            confirmPopUp(
              'Deleting a commit',
              `Deleting "${el.attr('data-commit-message')}" commit. Are you sure?`,
              decision => {
                if (decision) {
                  editMode = false;
                  git.adios(el.attr('data-commit-hash'));
                }
              }
            );
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
      injector
    } = container.namedExports();

    editButton &&
      editButton.onClick(() => {
        git.amend();
        render();
      });

    addButton &&
      addButton.onClick(() => {
        editMode = true;
        git.add();
        currentlyEditingHash = git.commit('');
        render();
      });

    discardButton &&
      discardButton.onClick(() => {
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
        function onSaveInEditor(message) {
          confirmButton.css('opacity', '0.3');
          onSave(message);
          el.withFallback(`[data-commit-hash="${ currentlyEditingHash }"] > .commit-message-text`)
            .text(getTitleFromCommitMessage(message));
        },
        function onChange() {
          confirmButton.css('opacity', '1');
          numOfCommits > 1 && renderGraph(commits, git.logAsTree());
        },
        onCancel
      );
      confirmButton.css('opacity', '0.3');
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
        render();
      });
      injector.onChange(str => {
        setTimeout(() => {
          editor.focus();
          editor.refresh();
          editor.replaceSelection(str);
          injector.e.value = '';
        }, 1);
      });
    }

    numOfCommits > 1 && renderGraph(commits, git.logAsTree());
  };

  state.listen(event => {
    if (!editMode) render();
  });

  render();

  return function addToStory({ code, list }, otherEditor) {
    if (editMode && editor) {
      otherEditor.setCursor({ line: 0, ch: 0 });
      setTimeout(() => {
        editor.focus();
        editor.refresh();

        let thingToInsert = code;

        // Set annotation link instead
        try {
          let { line, ch } = editor.getCursor();
          const currentLine = editor.getValue().split('\n')[line];

          if (
            currentLine.charAt(ch) === ')' &&
            currentLine.charAt(ch - 1) === '(' &&
            currentLine.charAt(ch - 2) === ']'
          ) {
            let { anchor, head } = list.shift();

            thingToInsert = ['a', state.getActiveFile(), anchor.line, head.line ].join(':');
          }
        } catch (error) {
          console.log('Error while setting annotation.');
        }

        editor.replaceSelection(thingToInsert);
      }, 1);
    }
  };
}
function renderCommits(git, commits, editMode, currentlyEditingHash) {
  function process(commit) {
    const { hash, message, position } = commit;

    const currentPosition = position && position > 0 ? `<span class="current-position">${position}</span>` : '';
    const messageFirstLine = getTitleFromCommitMessage(message);
    const isCurrent = git.head() === hash;
    let html = '';

    html += `
      <div class="commit ${ isCurrent ? 'commit-head' : ''}" id="c${hash}">
        <a href="javascript:void(0);" data-export="checkoutLink" data-commit-hash="${hash}" class="checkout">
          ${currentPosition}<span class="commit-message-text">${ messageFirstLine ? messageFirstLine : '...' }</span>
        </a>
        <a href="javascript:void(0);" data-export="editMessage" data-commit-hash="${hash}" class="edit">${ BOOK(12) } edit</a>
      </div>
    `;

    if (currentlyEditingHash === hash && editMode) {
      html += `
        <div class="commit commit-edit" id="c${hash}">
          <div class="story-form">
            <div class="story-form-bar">
              <a href="javascript:void(0);" data-export="confirmButton">${CHECK_ICON(12)} save</a>
              <a href="javascript:void(0);" data-export="closeButton">${CLOSE_ICON(12)} cancel</a>
              ${ git.head() !== hash ? `<a href="javascript:void(0);" data-export="checkoutLink" data-commit-hash="${hash}">${ DOT_CIRCLE(12) } checkout</a>` : '' }
              <a href="javascript:void(0);" data-export="deleteCommit" data-commit-hash="${hash}" data-commit-message="${messageFirstLine}">${ TRASH_ICON(12) } delete</a>
              <select data-export="publishStatus">
                ${getPublishOptions(git, hash)}
              </select>
              <select data-export="injector">
                <option value="">inject</option>
                <option value="{inject:all}">All files</option>
                ${getFileInjectionOptions(git, hash)}
              </select>
            </div>
            <div data-export="messageArea" class="message-area" spellcheck="true"></div>
          </div>
        </div>
      `;
    }
    return html;
  }

  if (commits.length === 0) {
    return '';
  }
  return commits.map(process).join('');
}
function renderDiffs(git, diffs) {
  if (diffs.length === 0) {
    return `
      <div class="working-directory">
        <div class="clear commit-buttons-nav">
          <a href="javascript:void(0)" data-export="addButton" class="commit-button left">
            &#10004; New commit
          </a>
        </div>
      </div>
    `;
  }
  return `
    <div class="working-directory">
      <div class="diffs">
        ${diffs.map(renderDiff).join('')}
      </div>
      <div class="clear commit-buttons-nav">
        ${ git.head() !== null ? `<a href="javascript:void(0)" data-export="editButton" class="commit-button left">
          &#10004; Save
        </a>` : '' }
        <a href="javascript:void(0)" data-export="addButton" class="commit-button left">
          &#10004; New commit
        </a>
        ${
          git.getAll().length > 0 && git.head() !== null ?
            `<a href="javascript:void(0)" data-export="discardButton" class="commit-button right">
            &#10006; Discard changes
          </a>` :
            ''
        }
      </div>
    </div>
  `;
}
function codeMirror(container, editorSettings, value, onSave, onChange, onCancel) {
  defineCodeMirrorCommands(CodeMirror);

  const editor = CodeMirror(container.e, {
    value: value || '',
    mode: 'gfm',
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
    Esc: () => onCancel(editor.getValue()),
    'Ctrl-Enter': () => (save(), onCancel(editor.getValue())),
    'Cmd-Enter': () => (save(), onCancel(editor.getValue()))
  });
  CodeMirror.normalizeKeyMap();
  setTimeout(() => editor.focus(), 50);

  return editor;
}
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
      <div><span class="label label-${diff[0]}">${diffChangeLabel}</span></div>
      <div class="diffA">${diff[1]}</div>
      <div class="diffB">${diffAdditionalInfo}</div>
    </div>
  `;
}
function formatDate(date = new Date()) {
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const day = date.getDate(),
    monthIndex = date.getMonth(),
    year = date
      .getFullYear()
      .toString()
      .substr(-2);

  return day + ' ' + monthNames[monthIndex] + ' ' + year + ' ' + date.getHours() + ':' + date.getMinutes();
}
function renderGraph(sortedCommits, tree) {
  setTimeout(() => {
    emptySVGGraph();

    DEBUG && console.log(JSON.stringify(sortedCommits.map(({ hash, position }) => ({ hash, position })), null, 2));

    const { connections, commitsYs } = renderCommitGraphs(getYValueOfCommitElement(sortedCommits[0].hash), tree);

    connections.forEach(([ hashA, hashB ]) => connectCommits(SVG_X, SVG_INITIAL_Y + commitsYs[hashA], SVG_INITIAL_Y + commitsYs[hashB]));
  }, 30);
}
function renderCommitGraphs(rootY, { parent, hash, derivatives }, result = { commitsYs: {}, connections: [] }) {
  result.commitsYs[hash] = getYValueOfCommitElement(hash) - rootY;
  if (parent !== null) {
    result.connections.push([ parent, hash ]);
  }
  if (derivatives.length > 0) {
    derivatives.forEach(commit => renderCommitGraphs(rootY, commit, result));
  }
  return result;
}
function getYValueOfCommitElement(hash) {
  if (el.exists('#c' + hash)) {
    return el('#c' + hash).e.getBoundingClientRect().top + 0.3;
  }
  return 0;
}
function getPublishOptions(git, currentHash) {
  const allCommits = git.log();
  const { meta } = allCommits[currentHash];
  const currentPosition = meta ? parseInt(meta.position, 10) : 0;
  let options = [];

  options.push(`<option value="0"${currentPosition === 0 ? 'selected="selected"' : ''}>not in story</option>`);
  for (let i = 1; i < Object.keys(allCommits).length + 1; i++) {
    options.push(`<option value="${i}" ${currentPosition === i ? 'selected="selected"' : ''}>position #${i}</option>`);
  }

  return options.join('');
}
function getFileInjectionOptions(git, currentHash) {
  const files = git.show(currentHash).files;

  return files.map(file => `<option value="{inject:${file[0]}}">${file[0]}</option>`);
}
function getTitleFromCommitMessage(text) {
  return cleanUpMarkdown(truncate(text.split('\n').shift(), 36));
}
