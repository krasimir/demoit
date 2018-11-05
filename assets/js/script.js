const CODEMIRROR_SETTINGS = {
  value: '',
  mode:  'jsx',
  tabSize: 2,
  lineNumbers: false,
  autofocus: true,
  foldGutter: false,
  gutters: []
};
const SETTINGS_FILE = 'settings.json';
const LOCAL_STORAGE_SPLIT_SIZES_KEY = 'demoit-split-sizes';

// ********************************************************************************* EDITOR
const createEditor = function (settings, outputElement) {
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
    'Ctrl-S': function(cm) {
      api.save();
    },
    'Cmd-S': function(cm) {
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
const loadEditorTheme = async function(settings) {
  try {
    const res = await fetch(`./vendor/codemirror/theme/${ settings.editor.theme }.css`);
    const css = await res.text();

    addStyleString(css);
  } catch (error) {
    console.log(error);
  }
}

// ********************************************************************************* OUTPUT
const createOutput = function(settings) {
  addStyleString(`
    .output {
      background-color: ${ settings.output.backgroundColor };
      font-size: ${ settings.output.fontSize };
      line-height: ${ settings.output.lineHeight };
    }
  `);

  return el('.output');
}
// ********************************************************************************* SETTINGS
const createSettingsPanel = function(settings, editor) {
  const toggler = el('.settings-button');
  const panel = el('.settings');
  const openNewSnippet = hash => {
    return `javascript:window.location.hash='${ hash }';window.location.reload();`;
  }
  const renderSettings = function () {
    panel.innerHTML = settings.demos.map((demo, demoIdx) => {
      const idx = demoIdx + 1;

      return `
        <div class="demo">
          ${
            demo.snippets.map(
              (snippet, snippetIdx) => {
                const active = editor.demo === demoIdx && editor.snippet === snippetIdx ? ' active' : '';
                const fileName = basename(snippet);

                return `
                  <a class="${ active }" href="${ openNewSnippet(`#${ demoIdx },${ snippetIdx }`) }">
                    ${ fileName }
                  </a>
                `;
              }
            ).join('')
          }
        </div>
      `
    }).join('');
  }
  const toggle = () => {
    visible = !visible;
    panel.style.display = visible ? 'block' : 'none';
    if (visible) {
      renderSettings();
      toggler.setAttribute('src', './assets/img/close.svg');
    } else {
      toggler.setAttribute('src', './assets/img/laptop.svg');
    }
  }
  let visible = false;

  toggler.addEventListener('click', toggle);
}


// ********************************************************************************* OTHER
const readDefaultDemoAndSnippet = function () {
  const hash = window.location.hash;

  if (hash && hash.split(',').length === 2) {
    return hash.split(',')
      .map(value => value.replace('#', ''))
      .map(Number);
  }
  return [0, 0];
}
const setSplitting = function () {
  const isLocalStorageAvailable = typeof window.localStorage !== 'undefined';
  const getSizes = () => {
    if (isLocalStorageAvailable) {
      let valueInStorage = localStorage.getItem(LOCAL_STORAGE_SPLIT_SIZES_KEY);

      if (valueInStorage) {
        valueInStorage = valueInStorage.split(',');
        if (valueInStorage.length === 2) {
          return valueInStorage.map(Number);
        }
      }
    }
    return [25, 75];
  }
  const split = Split(['.left', '.right'], {
      sizes: getSizes(),
      gutterSize: 4
  });
  isLocalStorageAvailable && setInterval(() => {
    localStorage.setItem(LOCAL_STORAGE_SPLIT_SIZES_KEY, split.getSizes().join(','))
  }, 1000);
}
const getSettings = async function () {
  const res = await fetch(SETTINGS_FILE);
  return await res.json();
}
const getResources = async function (settings) {
  return Promise.all(
    settings.resources.map(resource => {
      return new Promise(done => {
        const extension = resource.split('.').pop().toLowerCase();

        if (extension === 'js') {
          addJSFile(resource, done)
        } else if (extension === 'css') {
          addCSSFile(resource);
          done();
        } else {
          done();
        }
      });
    })
  );
}
function basename(path) {
  return path.split('/').reverse()[0];
}

// ********************************************************************************* INIT
window.onload = async function () {
  setSplitting();

  const settings = await getSettings();

  await getResources(settings);
  await loadEditorTheme(settings);

  const outputElement = createOutput(settings);
  const editor = createEditor(settings, outputElement);
  const settingsPanel = createSettingsPanel(settings, editor);

  await editor.showFrame();
};