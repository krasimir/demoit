import { el } from './utils/element';
import executeCode from './execute';
import createConsole from './console';
import output from './output';
import dependencies from './dependencies';

function codeMirror(container, editorSettings, value, onSave, onChange) {
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
  editor.setOption("extraKeys", { 'Ctrl-S': save, 'Cmd-S': save });
  CodeMirror.normalizeKeyMap();
  editor.focus();

  return editor;
};

export default async function editor(state) {
  const clearConsole = createConsole();
  const clearOutput = output();
  const loadDependencies = async () => {
    await dependencies(state, (percents, file) => {
      const content = `${ percents }%<br /><small>${ file }</small>`;

      clearConsole(content);
      clearOutput(content);
    });
  }
  const execute = async () => {
    await loadDependencies();
    clearConsole();
    clearOutput();
    executeCode(state.getCurrentIndex(), state.getFiles());
  }
  const container = el.withFallback('.js-code-editor');

  await loadDependencies();

  const codeMirrorEditor = codeMirror(
    container,
    state.getEditorSettings(),
    state.getCurrentFile().content,
    async function onSave(code) {
      await clearOutput();
      clearConsole();
      state.editCurrentFile({
        content: code,
        editing: false,
        preview: container.content()
      });
      execute();
    },
    function onChange() {
      state.editCurrentFile({ editing: true });
    }
  );

  return async function loadFileInEditor(file) {
    await clearOutput();
    clearConsole();
    codeMirrorEditor.setValue(file.content);
    codeMirrorEditor.focus();
    // we have to do this because we fire the onChange handler of the editor which sets editing=true;
    state.editCurrentFile({ editing: false  });
    execute();
  }  
}
