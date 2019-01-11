const LOADED_FILES_CACHE = {};

const addJSFile = function (path, done) {
  if (LOADED_FILES_CACHE[path]) return done();
  LOADED_FILES_CACHE[path] = false;

  const node = document.createElement('script');

  node.src = path;
  node.addEventListener('load', () => {
    LOADED_FILES_CACHE[path] = true;
    done();
  });
  document.body.appendChild(node);
  return true;
};
const addCSSFile = function (path, done) {
  if (LOADED_FILES_CACHE[path]) return done();
  LOADED_FILES_CACHE[path] = false;

  const node = document.createElement('link');

  node.setAttribute('rel', 'stylesheet');
  node.setAttribute('type', 'text/css');
  node.setAttribute('href', path);
  node.addEventListener('load', () => {
    LOADED_FILES_CACHE[path] = true;
    done();
  });
  document.body.appendChild(node);
  return true;
};

export const load = async function (dependencies, onProgress = () => {}) {
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
        addJSFile(resource, () => load(index + 1));
      } else if (extension === 'css') {
        addCSSFile(resource, () => load(index + 1));
      } else {
        load(index + 1);
      }
    })(0);
  });
};
export const cache = function () {
  return LOADED_FILES_CACHE;
};
export default async function dependencies(onProgress) {
  var dependencies = ['./resources/editor.js'];

  await load(dependencies, onProgress);
}
