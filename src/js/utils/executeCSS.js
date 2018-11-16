const STYLES_CACHE = {};

window.executeCSS = function (filename, content) {
  if (!STYLES_CACHE[filename]) {
    const node = document.createElement('style');

    node.setAttribute('id', filename);
    node.innerHTML = content;
    document.body.appendChild(node);
    STYLES_CACHE[filename] = node;
  } else {
    STYLES_CACHE[filename].innerHTML = content;
  }
}

