window.executeHTML = function (filename, content) {
  const node = document.createElement('div');

  node.innerHTML = content;
  document.querySelector('.output').appendChild(node.firstChild);
}

