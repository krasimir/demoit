import el from './element';

window.executeHTML = function (filename, content) {
  const node = document.createElement('div');

  node.innerHTML = content;
  el('.output').empty().appendChild(node.firstChild);
}

