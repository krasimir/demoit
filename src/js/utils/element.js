var createdElements = [];

export default function el(selector, parent = document, fallbackToEmpty = false, relaxedCleanup = false) {
  const removeListenersCallbacks = [];
  var e = typeof selector === 'string' ? parent.querySelector(selector) : selector;
  
  if (!e) {
    if (!fallbackToEmpty) {
      throw new Error(`Ops! There is no DOM element matching "${ selector }" selector.`);
    } else {
      e = document.createElement('div');
    }
  }

  const api = {
    e,
    content(str) {
      if (!str) {
        return e.innerHTML;
      }
      e.innerHTML = str;
      return this.exports();
    },
    appendChild(child) {
      e.appendChild(child);
      return this;
    },
    appendChildren(children) {
      children.forEach(c => e.appendChild(c.e));
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
      
      const removeListener = () => e.removeEventListener('click', callback);

      removeListenersCallbacks.push(removeListener);
      return removeListener;
    },
    onKeyUp(callback) {
      e.addEventListener('keyup', callback);
      
      const removeListener = () => e.removeEventListener('keyup', callback);

      removeListenersCallbacks.push(removeListener);
      return removeListener;
    },
    onRightClick(callback) {
      const handler = event => {
        event.preventDefault();
        callback();
      };
      e.addEventListener('contextmenu', handler);
      
      const removeListener = () => e.removeEventListener('oncontextmenu', handler);

      removeListenersCallbacks.push(removeListener);
      return removeListener;
    },
    onChange(callback) {
      e.addEventListener('change', () => callback(e.value));
      
      const removeListener = () => e.removeEventListener('change', callback);

      removeListenersCallbacks.push(removeListener);
      return removeListener;
    },
    find(selector) {
      return el(selector, e);
    },
    appendTo(parent) {
      parent.e.appendChild(e);
    },
    exports() {
      return Array
        .prototype.slice.call(e.querySelectorAll('[data-export]'))
        .map(element => el(element, e));
    },
    namedExports() {
      return this.exports().reduce((result, exportedElement) => {
        result[exportedElement.attr('data-export')] = exportedElement;
        return result;
      }, {});
    },
    detach() {
      if (e.parentNode && e.parentNode.contains(e)) {
        e.parentNode.removeChild(e);
      }
    },
    empty() {
      while (e.firstChild) {
        e.removeChild(e.firstChild);
      }
      return this;
    },
    destroy() {
      removeListenersCallbacks.forEach(c => c());
      if (!relaxedCleanup) {
        this.empty();
        this.detach();
      }
    }
  }

  createdElements.push(api);

  return api;
}

el.fromString = str => {
  const node = document.createElement('div');

  node.innerHTML = str;

  const filteredNodes = Array.prototype.slice.call(node.childNodes).filter(node => node.nodeType === 1);

  if (filteredNodes.length > 0) {
    return el(filteredNodes[0]);
  }
  throw new Error('fromString accepts HTMl with a single parent.');
}
el.wrap = elements => el(document.createElement('div')).appendChildren(elements);
el.fromTemplate = selector => el.fromString(document.querySelector(selector).innerHTML);
el.withFallback = selector => el(selector, document, true);
el.withRelaxedCleanup = selector => el(selector, document, false, true);
el.destroy = () => {
  createdElements.forEach(elInstance => elInstance.destroy());
  createdElements = [];
}
