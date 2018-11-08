import { addStyleString, getDemoAndSnippetIdx, el, basename } from './utils';
import { CODEMIRROR_SETTINGS } from './config';

export const createEditor = function (settings, onSave) {
  const [ demoIdx, snippetIdx ] = getDemoAndSnippetIdx();
  const currentSnippet = el('.current-snippet');
  const container = el('.js-code-editor');
  const saveButton = el('.pencil-button');
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

      currentSnippet.innerHTML = basename(snippetPath);
      editor.setValue(code);
      save();
    } catch (error) {
      console.log(error);
    }
  }

  const save = function () {
    onSave(editor.getValue());
    saveButton.setAttribute('style', 'opacity:0.2;');
  }

  editor.on('change', () => saveButton.setAttribute('style', 'opacity:0.8;'));
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
  saveButton.addEventListener('click', save);

  addStyleString(`
    .js-code-editor {
      font-size: ${ settings.editor.fontSize };
      line-height: ${ settings.editor.lineHeight };
    }
  `);

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