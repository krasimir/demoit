export function el(selector, parent = document) {
  var e = parent.querySelector(selector);

  if (!e) {
    throw new Error(`Ops! There is no DOM element matching "${ selector }" selector.`);
  }

  return {
    e,
    content(str) {
      e.innerHTML = str;
      return this;
    },
    appendChild(child) {
      e.appendChild(child);
      return this;
    },
    css(prop, value) {
      if (typeof value !== 'undefined') {
        e.style[prop] = value;
        return this;
      } else {
        return e.style[prop];
      }
    },
    prop(name, value) {
      if (typeof value !== 'undefined') {
        e[name] = value;
        return this;
      } else {
        return e[name];
      }
    },
    onClick(callback) {
      e.addEventListener('click', callback);
      return () => e.removeEventListener('click', callback);
    },
    onKeyUp(callback) {
      e.addEventListener('keyup', callback);
      return () => e.removeEventListener('keyup', callback);
    },
    find(selector) {
      return el(selector, e);
    },
    clone() {
      const newNode = e.cloneNode(true);

      e.parentNode.replaceChild(newNode, e);
      e = newNode;
    }
  }
}