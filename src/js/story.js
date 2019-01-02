import el from './utils/element';
import { PLUS_ICON, TRASH_ICON } from './utils/icons';
import defineCodeMirrorCommands from './utils/codeMirrorCommands';

function form () {
  return `
    <div class="story-form">
      <div data-export="messageArea" class="message-area"></div>
    </div>
  `;
}
function codeMirror(container, editorSettings, value, onSave, onChange, onCancel) {
  defineCodeMirrorCommands(CodeMirror);

  const editor = CodeMirror(container.e, {
    value: value || '',
    mode:  'jsx',
    tabSize: 2,
    lineNumbers: false,
    autofocus: true,
    foldGutter: false,
    gutters: [],
    styleSelectedText: true,
    ...editorSettings
  });
  const save = () => onSave(editor.getValue());
  const change = () => onChange(editor.getValue());

  editor.on('change', change);
  editor.on('blur', onCancel)
  editor.setOption("extraKeys", {
    'Ctrl-S': save,
    'Cmd-S': save,
    'Esc': onCancel
  });
  CodeMirror.normalizeKeyMap();
  setTimeout(() => editor.focus(), 50);

  return editor;
};

function renderCommits(git, editMode) {
  const commits = Object.keys(git.log()).map(hash => ({ hash, ...git.log()[hash]}));
  const r = ({ hash, message }, indent = 0) => {
    let html = '';
    const cssClasses = ['commit-dot'];

    if (git.head() === hash) cssClasses.push('commit-dot-head');
    if (git.head() === hash && editMode) cssClasses.push('commit-dot-edit');

    html += `
    <div class="commit">
      <div class="${ cssClasses.join(' ') }"><span></span></div>
    `;
    if (git.head() === hash && editMode) {
      html += form();
    } else {
      html += `
        <div class="commit-content">
          <div class="commit-nav">
            <a href="javascript:void(0);" data-export="editMessage" data-commit-hash="${ hash }">story</a>
          </div>
          <a href="javascript:void(0);" data-export="checkoutLink" data-commit-hash="${ hash }">${ message.split('\n').shift() }</a>
        </div>
      `;
    }
    html += '</div>';
    html += commits
      .filter(({ parent }) => parent === hash)
      .map(commit => r(commit, indent + 1))
      .join('')
    return html;
  }
  const firstCommit = commits.find(({ parent }) => parent === null);

  if (firstCommit) {
    return r(firstCommit);
  }
  return '';
}

export default function story(state, onChange) {
  const container = el.withFallback('.story');
  const git = state.git();
  let editMode = false;

  if (!container.found()) return;

  const render = () => {
    container.content(`
      <div data-export="list">` + renderCommits(git, editMode) + `</div>
      <div class="${ Object.keys(git.log()).length === 0 ? 'centered' : '' }">
        <a href="javascript:void(0)" data-export="addButton" class="add-button">${ PLUS_ICON() }</a>
      </div>
    `).forEach(el => {
      if (el.attr('data-export') === 'checkoutLink') {
        el.onClick(() => {
          if (el.attr('data-commit-hash')) {
            git.checkout(el.attr('data-commit-hash'));
            render();
            onChange();
          }
        });
      }
      if (el.attr('data-export') === 'editMessage') {
        el.onClick(() => {
          if (el.attr('data-commit-hash')) {
            editMode = true;
            render();
          }
        });
      }
    });

    const { addButton, messageArea } = container.namedExports();

    addButton.onClick(() => {
      // editMode = true;
      // git.add();
      // git.commit('');
      // render();
    });

    messageArea && codeMirror(
      messageArea,
      state.getEditorSettings(),
      git.show(git.head()).message,
      function onSave(message) {
        git.amend(git.head(), message);
      },
      function onChange(message) {
        
      },
      function onCancel() {
        editMode = false;
        render();
      }
    )
  }

  render();
}