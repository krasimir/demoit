/* eslint-disable no-use-before-define */
import el from './utils/element';
import executeCode from './execute';
import createConsole from './console';
import output from './output';
import loadAppDeps from './dependencies';
import defineCodeMirrorCommands from './utils/codeMirrorCommands';
import { isEmbedded } from './utils';

export const ON_SELECT = 'e_ON_SELECT';
export const ON_FILE_CHANGE = 'e_ON_FILE_CHANGE';
export const ON_FILE_SAVE = 'e_ON_FILE_SAVE';

export default async function editor(state, listener) {
  const { clearConsole, addToConsole } = createConsole();
  const { resetOutput, loadDependenciesInOutput, executeInOut } = await output(state, addToConsole);
  const execute = async () => {
    await resetOutput();
    await loadDependenciesInOutput();
    clearConsole();
    await executeInOut(executeCode(state.getActiveFile(), state.getFiles()));
  };
  const onSave = async (code) => {
    clearConsole();
    state.editFile(state.getActiveFile(), { c: code });
    listener(ON_FILE_SAVE, code, codeMirrorEditor);
    execute();
  };
  const container = el.withFallback('.js-code-editor');

  clearConsole('<div class="centered"><div class="spinner"></div></div>');
  await loadAppDeps();

  // Initializing CodeMirror
  const codeMirrorEditor = codeMirror(
    container.empty(),
    state.getEditorSettings(),
    state.getActiveFileContent(),
    onSave,
    function onChange() {
      listener(ON_FILE_CHANGE);
    },
    function showFile(index) {
      state.setActiveFileByIndex(index);
      loadFileInEditor();
    },
    function onSelection(code) {
      listener(ON_SELECT, code, codeMirrorEditor);
    }
  );

  // The function that we call to execute a file
  async function loadFileInEditor() {
    clearConsole();
    codeMirrorEditor.setValue(state.getActiveFileContent());
    if (!isEmbedded()) { codeMirrorEditor.focus(); }
    switch (state.getActiveFile().split('.').pop().toLowerCase()) {
      case 'css': codeMirrorEditor.setOption('mode', 'css'); break;
      case 'scss': codeMirrorEditor.setOption('mode', 'css'); break;
      case 'html': codeMirrorEditor.setOption('mode', 'htmlmixed'); break;
      case 'md':
        codeMirrorEditor.setOption('mode', {
          name: 'gfm',
          highlightFormatting: true,
          emoji: true,
          xml: true
        });
        break;
      default: codeMirrorEditor.setOption('mode', 'jsx'); break;
    }
    execute();
  }

  return { loadFileInEditor, save: () => {
    onSave(codeMirrorEditor.getValue());
    codeMirrorEditor.focus();
   }};
}

function codeMirror(container, editorSettings, value, onSave, onChange, showFile, onSelection) {
  defineCodeMirrorCommands(CodeMirror);

  const editor = CodeMirror(container.e, {
    value: value || '',
    mode: 'jsx',
    tabSize: 2,
    lineNumbers: false,
    autofocus: false,
    foldGutter: false,
    gutters: [],
    styleSelectedText: true,
    matchBrackets: true,
    autoCloseBrackets: true,
    lineWrapping: true,
    theme: editorSettings.theme,
    highlightSelectionMatches: { showToken: /\w/, annotateScrollbar: true }
  });
  const save = () => onSave(editor.getValue());
  const change = (instance, { origin }) => {
    if (origin !== 'setValue') {
      onChange(editor.getValue());
    }
  };

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

  container.onMouseUp(() => {
    const selection = editor.getSelection();

    selection !== '' && onSelection(selection);
  });

  return editor;
};
