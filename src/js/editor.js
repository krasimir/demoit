import { el } from './utils';

export default async function editor(editorSettings, value, onSave, onChange) {
  const container = el('.js-code-editor');
  const editor = CodeMirror(container, {
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