export function el(selector, parent = document) {
  var e = typeof selector === 'string' ? parent.querySelector(selector) : selector;
  
  if (!e) {
    throw new Error(`Ops! There is no DOM element matching "${ selector }" selector.`);
  }
  
  var initialNode = e.cloneNode(true);

  return {
    e,
    content(str) {
      e.innerHTML = str;
      return Array.prototype.slice.call(e.querySelectorAll('[data-export]')).map(element => el(element, e));
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
    attr(attr, value) {
      if (typeof value !== 'undefined') {
        e.setAttribute(attr, value);
        return this;
      } else {
        return e.getAttribute(attr);
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
    restoreToInitialDOM() {
      const clone = initialNode.cloneNode(true);
      e.parentNode.replaceChild(clone, e);
      e = clone;
    }
  }
}