import { el } from '../../utils';

export default async function codeMirror(editorSettings, value, onSave, onChange) {
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