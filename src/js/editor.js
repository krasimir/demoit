import teardown from './utils/teardown';
import { el } from './utils/element';
import executeCode from './execute';
import createConsolePanel from './console';

function codeMirror(editorSettings, value, onSave, onChange) {
  const editor = CodeMirror(el.withFallback('.js-code-editor').e, {
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

export default function editor(state) {
  const { content: initialEditorValue } = state.getCurrentFile();
  const cleanUp = teardown(createConsolePanel());
  const execute = () => executeCode(state.getCurrentIndex(), state.getFiles());
  const codeMirrorEditor = codeMirror(
    state.getEditorSettings(),
    initialEditorValue,
    async function onSave(code) {
      await cleanUp();
      state.editCurrentFile({ content: code, editing: false  });
      execute();
    },
    function onChange(code) {
      state.editCurrentFile({ editing: true });
    }
  );

  return async function loadFileInEditor(file) {
    await cleanUp();
    codeMirrorEditor.setValue(file.content);
    codeMirrorEditor.focus();
    // we have to do this because we fire the onChange handler of the editor which sets editing=true;
    state.editCurrentFile({ editing: false  });
    execute();
  }  
}
