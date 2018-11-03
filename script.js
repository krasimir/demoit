const SETTINGS_PATH = './settings.json';
const CODEMIRROR_SETTINGS = {
  value: '',
  mode:  'jsx',
  tabSize: 2,
  lineNumbers: false,
  autofocus: true,
  foldGutter: false,
  gutters: []
};

const el = function (sel) { return document.querySelector(sel); };
const addStyleString = function (str) {
  const node = document.createElement('style');

  node.innerHTML = str;
  document.body.appendChild(node);
}
const createEditor = function (settings, onChange) {
  const container = el('.js-code-editor');
  const editor = CodeMirror(
    container,
    Object.assign({}, CODEMIRROR_SETTINGS, settings.editor)
  );

  editor.on('change', function () {
    onChange(editor.getValue());
  });
  editor.setValue('');
  container.addEventListener('click', function () {
    editor.focus();
  });

  addStyleString(`
    .js-code-editor {
      font-size: ${ settings.editor.fontSize };
      line-height: ${ settings.editor.lineHeight };
    }
  `);

  return {
    demo: 0,
    frame: 0,
    async showFrame() {
      try {
        const res = await fetch(settings.demos[this.demo].frames[this.frame].path);
        const code = await res.text();

        editor.setValue(code);
      } catch (error) {
        console.error(error);
      }
    },
    async loadTheme() {
      try {
        const res = await fetch(`./vendor/codemirror/theme/${ settings.editor.theme }.css`);
        const css = await res.text();

        addStyleString(css);
      } catch (error) {
        console.log(error);
      }
    }
  };
};
const createOutput = function(settings) {
  const element = el('.output');

  addStyleString(`.output { background-color: ${ settings.output.backgroundColor }}`)
}

const getSettings = async function (path) {
  const res = await fetch(path);
  return await res.json();
}
const initColumnResizer = function () {
  let resizable = ColumnResizer.default;
        
  new resizable(
    document.querySelector(".container"),
    {
      resizeMode: 'fit',
      liveDrag: true,
      draggingClass: 'rangeDrag',
      minWidth: 8
    }
  );
}

var init = async function () {

  initColumnResizer();

  const settings = await getSettings(SETTINGS_PATH);
  const output = createOutput(settings);
  const editor = createEditor(settings, text => {
    // console.log(text);
  });

  await editor.loadTheme();
  await editor.showFrame();

};

window.onload = init;