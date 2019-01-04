import el from './utils/element';
import defineCodeMirrorCommands from './utils/codeMirrorCommands';
import commitDiff from './utils/commitDiff';
import connectCommits from './utils/svg';

const SVG_X = 34;
const SVG_INITIAL_Y = 25;
const SVG_Y = 48.5;

export default function story(state, onChange) {
  const container = el.withFallback('.story');
  const git = state.git();
  let editor = null;
  let editorCursorPosition = null;
  let editMode = false, currentlyEditingHash;
  
  if (!container.found()) return;
  
  const render = () => {
    const showGraph = !editMode && Object.keys(git.log()).length > 1;
    const areThereAnyCommits = git.head() !== null;
    const diffs = commitDiff(areThereAnyCommits ? git.show().files : [], git.getAll());
    const renderedCommits = renderCommits(git, editMode, diffs.length === 0, currentlyEditingHash);

    container.css('display', !showGraph ? 'block' : 'grid');
    container.content(`
      ${ showGraph ? '<div class="story-arrows"><svg id="svg-canvas" width="40px" height="98%"></svg></div>' : '' }
      <div>
        ${ renderedCommits ? `<div data-export="list">` + renderedCommits + `</div>` : '' }
        ${ diffs.length > 0 ? 
          `<div class="working-directory">
            <div class="diffs">
              ${ diffs.map(renderDiff).join('') }
            </div>
            <div class="centered">
              <a href="javascript:void(0)" data-export="addButton" class="add-button">
                ${ areThereAnyCommits ? '&#10010; You have unstaged changes. Commit them by clicking here.' : '&#10010; Click here to make your first commit.' }
              </a>
            </div>
          </div>
          ` : '' }
      </div>
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
        el.onClick(() => git.adios(el.attr('data-commit-hash')));
      }
    });

    const { addButton, messageArea, workingIndicator } = container.namedExports();

    addButton && addButton.onClick(() => {
      editMode = true;
      git.add();
      currentlyEditingHash = git.commit('');
      render();
    });

    workingIndicator && workingIndicator.css('display', 'none');
    messageArea && (editor = codeMirror(
      messageArea,
      state.getEditorSettings(),
      git.show(currentlyEditingHash).message,
      function onSave(message) {
        workingIndicator.css('display', 'none');
        git.amend(currentlyEditingHash, message);
      },
      function onChange() {
        workingIndicator.css('display', 'block');
      },
      function onCancel(message) {
        editMode = false;
        editor = null;
        editorCursorPosition = null;
        if (message === '') {
          git.amend(currentlyEditingHash, formatDate());
        }
        render();
      },
      function onBlur() {
        editorCursorPosition = editor ? editor.getCursor() : null;
      }
    ));

    if (showGraph) {
      const { connections, yValues } = renderCommitGraphs(git.logAsTree());

      connections.forEach(([top, down]) => connectCommits(SVG_X, yValues[top], yValues[down]));
    }
  }

  git.listen(event => {
    if (!editMode) render();
  });

  render();

  return function addToStory(code, otherEditor) {
    if (editMode && editor) {
      otherEditor.setCursor({ line: 0, ch: 0 });
      setTimeout(() => {
        editor.focus();
        editor.refresh();
        editor.replaceSelection(code);
      }, 50);
    }
  }
}
function renderCommits(git, editMode, allowCheckout, currentlyEditingHash) {
  const root = git.logAsTree();

  function process(commit) {
    const { hash, message, derivatives } = commit;
    const linkLabel = (git.head() === hash ? '<span class="commit-head">&#8594;</span>' : '') + message.split('\n').shift();
    const link = allowCheckout && !editMode ?
      `<a href="javascript:void(0);" data-export="checkoutLink" data-commit-hash="${ hash }">${ linkLabel }</a>` :
      `<span style="opacity:0.4;">${ linkLabel }</span>`

    return `
      <div class="commit${ currentlyEditingHash === hash && editMode ? ' commit-edit' : ''}" id="c${ hash }">
        ${
          currentlyEditingHash === hash && editMode ? form() : `
            <div class="commit-nav">
              <a href="javascript:void(0);" data-export="editMessage" data-commit-hash="${ hash }">&#9998; story</a>
              <a href="javascript:void(0);" data-export="deleteCommit" data-commit-hash="${ hash }">&#10006; delete</a>
            </div>
            ${ link }
          `
        }
      </div>
    ` + derivatives.map(process).join('');
  }

  return root !== null ? process(root, 0) : '';
}
function form () {
  return `
    <div class="story-form">
      <div data-export="workingIndicator" class="working-indicator">&#10035;</div>
      <div data-export="messageArea" class="message-area"></div>
    </div>
  `;
}
function codeMirror(container, editorSettings, value, onSave, onChange, onCancel, onBlur) {
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
  editor.on('blur', onBlur);
  editor.setOption("extraKeys", {
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

  switch(diff[0]) {
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
      <div class="diffB">${ diffAdditionalInfo }</div>
    </div>
  `;
}
function formatDate(date = new Date()) {
  var monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  var day = date.getDate(), monthIndex = date.getMonth(), year = date.getFullYear().toString().substr(-2);
  return day + ' ' + monthNames[monthIndex] + ' ' + year + ' ' + date.getHours() + ':' + date.getMinutes();
}
function renderCommitGraphs(
  { parent, hash, derivatives },
  result = { y: SVG_INITIAL_Y, connections: [], yValues: {} }
) {
  result.yValues[hash] = result.y;
  result.y += SVG_Y;
  if (parent !== null) {
    result.connections.push([parent, hash]);
  }
  if (derivatives.length > 0) {
    derivatives.forEach(commit => renderCommitGraphs(commit, result));
  }
  return result;
}

