const STYLES_CACHE = {};
const guaranteeValidIdName = filename => filename.replace(/\./g, '_');

export const cleanUpExecutedCSS = function (filename) {
  const node = document.querySelector('#' + guaranteeValidIdName(filename));

  if (node) {
    node.parentNode.removeChild(node);
  }
}

window.executeCSS = function (filename, content) {
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

