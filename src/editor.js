import { addStyleString, el, getDistFolderURL } from './utils';

export const createEditor = async function (settings, value, onSave, onChange) {
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
    ...settings.editor
  });
  const save = () => onSave(editor.getValue());
  const change = () => onChange(editor.getValue());

  editor.on('change', change);
  editor.setOption("extraKeys", { 'Ctrl-S': save, 'Cmd-S': save });
  CodeMirror.normalizeKeyMap();
  container.addEventListener('click', () => editor.focus());
  editor.focus();

  return editor;
};
export const loadEditorTheme = async function(settings) {
  try {
    const res = await fetch(`${ getDistFolderURL() }vendor/codemirror/theme/${ settings.editor.theme }.css`);
    const css = await res.text();

    addStyleString(css);
  } catch (error) {
    console.log(error);
  }
}