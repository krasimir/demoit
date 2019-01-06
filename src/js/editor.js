/* eslint-disable no-use-before-define */
import el from './utils/element';
import executeCode from './execute';
import createConsole from './console';
import output from './output';
import dependencies from './dependencies';
import defineCodeMirrorCommands from './utils/codeMirrorCommands';

export const ON_SELECT = 'e_s';

export default async function editor(state, listeners) {
  const clearConsole = createConsole();
  const clearOutput = output();
  const loadDependencies = async () => {
    await dependencies(state, (percents, file) => {
      const content = '<div class="centered"><div class="spinner"></div></div>';

      clearConsole(content);
      clearOutput(content);
    });
  };
  const execute = async () => {
    await loadDependencies();
    clearConsole();
    clearOutput();
    executeCode(state.getActiveFile(), state.getFiles());
  };
  const onSave = async (code) => {
    await clearOutput();
    clearConsole();
    state.editFile(state.getActiveFile(), { c: code });
    state.pendingChanges(false);
    execute();
  };
  const container = el.withFallback('.js-code-editor');

  await loadDependencies();

  // Initializing CodeMirror
  const codeMirrorEditor = codeMirror(
    container.empty(),
    state.getEditorSettings(),
    state.getActiveFileContent(),
    onSave,
    function onChange() {
      state.pendingChanges(true);
    },
    function showFile(index) {
      state.setActiveFileByIndex(index);
      loadFileInEditor();
    },
    function onSelection(code) {
      listeners.forEach(c => c(ON_SELECT, code, codeMirrorEditor));
    }
  );

  // The function that we call to execute a file
  async function loadFileInEditor() {
    await clearOutput();
    clearConsole();
    codeMirrorEditor.setValue(state.getActiveFileContent());
    codeMirrorEditor.focus();
    switch (state.getActiveFile().split('.').pop().toLowerCase()) {
      case 'css': codeMirrorEditor.setOption('mode', 'css'); break;
      case 'html': codeMirrorEditor.setOption('mode', 'htmlmixed'); break;
      default: codeMirrorEditor.setOption('mode', 'jsx'); break;
    }
    // we have to do this because we fire the onChange handler of the editor which sets editing=true;
    state.pendingChanges(false);
    execute();
  }

  return { loadFileInEditor, save: () => onSave(codeMirrorEditor.getValue()) };
}

function codeMirror(container, editorSettings, value, onSave, onChange, showFile, onSelection) {
  defineCodeMirrorCommands(CodeMirror);

  const editor = CodeMirror(container.e, {
    value: value || '',
    mode: 'jsx',
    tabSize: 2,
    lineNumbers: false,
    autofocus: true,
    foldGutter: false,
    gutters: [],
    styleSelectedText: true,
    theme: editorSettings.theme
  });
  const save = () => onSave(editor.getValue());
  const change = () => onChange(editor.getValue());

  editor.on('change', change);
  editor.setOption('extraKeys', {
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
    'Ctrl-9': () => showFile(8),
    'Cmd-D': 'selectNextOccurrence',
    'Ctrl-D': 'selectNextOccurrence',
    'Cmd-/': 'toggleCommentIndented',
    'Ctrl-/': 'toggleCommentIndented'
  });
  CodeMirror.normalizeKeyMap();
  editor.focus();

  container.onMouseUp(() => {
    const selection = editor.getSelection();

    selection !== '' && onSelection(selection);
  });

  return editor;
};
