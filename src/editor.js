import { addStyleString, getDemoAndSnippetIdx, el, basename } from './utils';
import { CODEMIRROR_SETTINGS } from './config';

export const createEditor = function (settings, onSave) {
  const [ demoIdx, snippetIdx ] = getDemoAndSnippetIdx();
  const container = el('.js-code-editor');
  const editor = CodeMirror(
    container,
    Object.assign({}, CODEMIRROR_SETTINGS, settings.editor)
  );

  const showFrame = async function () {
    window.location.hash = demoIdx + ',' + snippetIdx;

    try {
      const snippetPath = settings.demos[demoIdx].snippets[snippetIdx];
      const res = await fetch(snippetPath);
      const code = await res.text();

      editor.setValue(code);
      save();
    } catch (error) {
      console.log(error);
    }
  }

  const save = function () {
    onSave(editor.getValue());
  }

  editor.on('change', () => {});
  editor.setValue('');
  editor.setOption("extraKeys", {
    'Ctrl-S': () => {
      save();
    },
    'Cmd-S': () => {
      save();
    }
  });
  CodeMirror.normalizeKeyMap();
  container.addEventListener('click', () => editor.focus());
  showFrame();
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