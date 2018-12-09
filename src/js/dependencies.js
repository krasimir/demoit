import { isEditorMode } from './mode';

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
const load = async function (dependencies, onProgress) {
  return new Promise(done => {
    (function load(index) {
      if (index === dependencies.length) {
        done();
        return;
      }
      onProgress(
        Math.ceil(100 * (index / dependencies.length)),
        dependencies[index].split(/\//).pop()
      );

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

export default async function dependencies(state, onProgress) {
  var dependencies = [];

  isEditorMode() && dependencies.push('./resources/editor.js');
  dependencies = dependencies.concat(state.getDependencies());

  await load(dependencies, onProgress);
}