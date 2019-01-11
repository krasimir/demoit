/* eslint-disable quotes */
import el from './utils/element';

function htmlEncode(str) {
  return str.replace(/[&<>"']/g, function ($0) {
      return "&" + {"&": "amp", "<": "lt", ">": "gt", '"': "quot", "'": "#39"}[$0] + ";";
  });
}

export default function logger() {
  const element = el.withFallback('.console');
  let empty = true;
  const add = something => {
    const node = document.createElement('div');
    const text = something ? htmlEncode(something.toString()) : something;

    node.innerHTML = '<p>' + text + '</p>';
    if (empty) {
      element.empty();
      empty = false;
    }
    element.appendChild(node);
    element.scrollToBottom();
  };

  (function () {
    const originalError = console.error;
    const originalLog = console.log;
    const originalWarning = console.warn;
    const originalInfo = console.info;
    const originalClear = console.clear;

    console.error = function (error) {
      add(error.stack);
      originalError.apply(console, arguments);
    };
    console.log = function (...args) {
      args.forEach(add);
      originalLog.apply(console, args);
    };
    console.warn = function (...args) {
      args.forEach(add);
      originalWarning.apply(console, args);
    };
    console.info = function (...args) {
      args.forEach(add);
      originalInfo.apply(console, args);
    };
    console.clear = function (...args) {
      element.content('');
      originalClear.apply(console, args);
    };
  })();

  return {
    clearConsole: function clearConsole(hintValue = '<div class="centered"><div>console.log(...)</div></div>') {
      empty = true;
      element.empty().content(hintValue);
    },
    addToConsole: add
  };
}
