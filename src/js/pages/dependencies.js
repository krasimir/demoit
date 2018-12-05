import { el } from '../utils';

const LOADED_FILES_CACHE = {};

const addJSFile = function (path, done) {
  if (LOADED_FILES_CACHE[path]) return done();

  const node = document.createElement('script');

  node.src = path;
  node.addEventListener('load', () => {
    LOADED_FILES_CACHE[path] = true;
    done();
  });
  document.body.appendChild(node);
}
const addCSSFile = function (path, done) {
  if (LOADED_FILES_CACHE[path]) return done();

  const node = document.createElement('link');

  node.setAttribute('rel', 'stylesheet');
  node.setAttribute('type', 'text/css');
  node.setAttribute('href', path);
  node.addEventListener('load', () => {
    LOADED_FILES_CACHE[path] = true;
    done();
  });
  document.body.appendChild(node);
}
const load = async function (dependencies, status = () => {}) {
  return new Promise(done => {
    (function load(index) {
      status(index);
      if (index === dependencies.length) {
        done();
        return;
      }

      const resource = dependencies[index];
      const extension = resource.split('.').pop().toLowerCase();
  
      if (extension === 'js') {
        addJSFile(resource, () => load(index + 1))
      } else if (extension === 'css') {
        addCSSFile(resource, () => load(index + 1));
      } else {
        load(index + 1)
      }
    })(0);
  });
}

export default function dependencies({ state, changePage }) {
  return {
    name: 'dependencies',
    async didMount({ el }) {
      const progress = el('.value');
      const currentFile = el('.file');
      const dependencies = [
        './resources/babel-6.26.0.min.js',
        './resources/babel-polyfill@6.26.0.js',
        // `./vendor/codemirror/theme/${ state.getEditorSettings().theme }.css`,
        ...state.getDependencies()
      ];

      await load(dependencies, index => {
        progress.css('width', (100 * (index / dependencies.length)) + '%');
        if (index < dependencies.length) {
          currentFile.content(dependencies[index].split(/\//).pop());
        } else {
          currentFile.css('opacity', 0);
          changePage('editor');
        }
      });
    }
  }
}