import { addStyleString, getDemoAndSnippetIdx, el, basename } from './utils';
import { CODEMIRROR_SETTINGS } from './config';

export const createEditor = async function (settings, onSave, onChange) {
  const [ demoIdx, snippetIdx ] = getDemoAndSnippetIdx();
  const container = el('.js-code-editor');
  const editor = CodeMirror(container, Object.assign({}, CODEMIRROR_SETTINGS, settings.editor));
  const save = () => onSave(editor.getValue());

  editor.on('change', () => onChange(editor.getValue()));
  editor.setOption("extraKeys", { 'Ctrl-S': save, 'Cmd-S': save });
  CodeMirror.normalizeKeyMap();
  container.addEventListener('click', () => editor.focus());
  
  if (settings.demos && settings.demos[demoIdx] && settings.demos[demoIdx].snippets && settings.demos[demoIdx].snippets[snippetIdx]) {
    const res = await fetch(settings.demos[demoIdx].snippets[snippetIdx]);

    editor.setValue(await res.text());
    save();
  }

  editor.focus()
};
export const loadEditorTheme = async function(settings) {
  try {
    const res = await fetch(`./vendor/codemirror/theme/${ settings.editor.theme }.css`);
    const css = await res.text();

    addStyleString(css);
  } catch (error) {
    console.log(error);
  }
}