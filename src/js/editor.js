import el from './utils/element';
import executeCode from './execute';
import createConsole from './console';
import output from './output';
import dependencies from './dependencies';

function codeMirror(container, editorSettings, value, onSave, onChange, showFile) {
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
  editor.setOption("extraKeys", {
    'Ctrl-S': save,
    'Cmd-S': save,
    'Cmd-1': () => showFile(0),
    'Cmd-2': () => showFile(1),
    'Cmd-3': () => showFile(2),
    'Cmd-4': () => showFile(3),
    'Cmd-5': () => showFile(4),
    'Cmd-6': () => showFile(5),
    'Cmd-7': () => showFile(6),
    'Cmd-8': () => showFile(7),
    'Cmd-9': () => showFile(8),
    'Ctrl-1': () => showFile(0),
    'Ctrl-2': () => showFile(1),
    'Ctrl-3': () => showFile(2),
    'Ctrl-4': () => showFile(3),
    'Ctrl-5': () => showFile(4),
    'Ctrl-6': () => showFile(5),
    'Ctrl-7': () => showFile(6),
    'Ctrl-8': () => showFile(7),
    'Ctrl-9': () => showFile(8)
  });
  CodeMirror.normalizeKeyMap();
  editor.focus();

  return editor;
};

export default async function editor(state) {
  const clearConsole = createConsole();
  const clearOutput = output();
  const loadDependencies = async () => {
    await dependencies(state, (percents, file) => {
      const content = `<div class="centered"><div class="spinner"></div></div>`;

      clearConsole(content);
      clearOutput(content);
    });
  }
  const execute = async () => {
    await loadDependencies();
    clearConsole();
    clearOutput();
    state.updateCode(
      executeCode(
        state.getCurrentIndex(),
        state.getFiles()
      )
    );
  }
  const container = el.withFallback('.js-code-editor');

  await loadDependencies();

  const codeMirrorEditor = codeMirror(
    container.empty(),
    state.getEditorSettings(),
    state.getCurrentFile().content,
    async function onSave(code) {
      await clearOutput();
      clearConsole();
      state.editCurrentFile({
        content: code,
        preview: container.content()
      });
      state.pendingChanges(false);
      execute();
    },
    function onChange() {
      state.pendingChanges(true);
    },
    function showFile(index) {
      loadFileInEditor(state.setCurrentIndex(index));
    }
  );

  async function loadFileInEditor() {
    await clearOutput();
    clearConsole();
    codeMirrorEditor.setValue(state.getCurrentFile().content);
    codeMirrorEditor.focus();
    // we have to do this because we fire the onChange handler of the editor which sets editing=true;
    state.pendingChanges(false);
    execute();
  }

  return loadFileInEditor;
}
