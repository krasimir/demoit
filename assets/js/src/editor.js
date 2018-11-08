import { addStyleString, readDefaultDemoAndSnippet, el, basename } from './utils';
import { CODEMIRROR_SETTINGS } from './config';

export const createEditor = function (settings, outputElement) {
  const defaults = readDefaultDemoAndSnippet();
  const currentSnippet = el('.current-snippet');
  const api = {
    saved: true,
    demo: defaults[0],
    snippet: defaults[1],
    async showFrame(demo, snippet) {
      if (typeof demo !== 'undefined') this.demo = demo;
      if (typeof snippet !== 'undefined') this.snippet = snippet;

      window.location.hash = this.demo + ',' + this.snippet;

      try {
        const snippetPath = settings.demos[this.demo].snippets[this.snippet];
        const res = await fetch(snippetPath);
        const code = await res.text();

        outputElement.innerHTML = '';
        currentSnippet.innerHTML = basename(snippetPath);
        editor.setValue(code);
        this.save();
      } catch (error) {
        console.error(error);
      }
    },
    save() {
      const renderFunc = window[settings.demos[api.demo].render];

      if (!renderFunc) {
        throw new Error(`There is no global function ${ settings.demos[api.demo].render } available. There should be window.${ settings.demos[api.demo].render } but it is missing.`);
      }
      renderFunc(editor.getValue(), outputElement);
      this.saved = true;
      saveButton.setAttribute('style', 'opacity:0.2;');
    }
  }
  const container = el('.js-code-editor');
  const saveButton = el('.pencil-button');
  const editor = CodeMirror(
    container,
    Object.assign({}, CODEMIRROR_SETTINGS, settings.editor)
  );

  editor.on('change', function () {
    api.saved = false;
    saveButton.setAttribute('style', 'opacity:0.8;');
  });
  editor.setValue('');
  editor.setOption("extraKeys", {
    'Ctrl-S': function() {
      api.save();
    },
    'Cmd-S': function() {
      api.save();
    }
  });
  CodeMirror.normalizeKeyMap();

  container.addEventListener('click', () => editor.focus());
  saveButton.addEventListener('click', () => api.save());

  addStyleString(`
    .js-code-editor {
      font-size: ${ settings.editor.fontSize };
      line-height: ${ settings.editor.lineHeight };
    }
  `);

  return api;
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