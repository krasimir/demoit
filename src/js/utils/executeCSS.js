const STYLES_CACHE = {};
const guaranteeValidIdName = filename => filename.replace(/\./g, '_');

export const cleanUpExecutedCSS = function (filename) {
  const node = document.querySelector('#' + guaranteeValidIdName(filename));

  if (node) {
    node.parentNode.removeChild(node);
    delete STYLES_CACHE[filename];
  }
}

export const injectCSS = function (css, id) {
  const node = document.querySelector('#' + id);

  if (node) {
    node.innerHTML = css;
  } else {
    const node = document.createElement('style');

    id && node.setAttribute('id', id);
    node.innerHTML = css;
    document.body.appendChild(node);
  }
}

export const executeCSS = function (filename, content) {
  if (!STYLES_CACHE[filename]) {
    const node = document.createElement('style');

    node.setAttribute('id', guaranteeValidIdName(filename));
    node.innerHTML = content;
    document.body.appendChild(node);
    STYLES_CACHE[filename] = node;
  } else {
    STYLES_CACHE[filename].innerHTML = content;
  }
}

window.cleanUpExecutedCSS = cleanUpExecutedCSS;
window.executeCSS = executeCSS;

