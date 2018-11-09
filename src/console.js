import { el, addStyleString } from './utils';

function htmlEncode(str) {
  return str.replace(/[&<>"']/g, function($0) {
      return "&" + {"&":"amp", "<":"lt", ">":"gt", '"':"quot", "'":"#39"}[$0] + ";";
  });
}

export default function logger(settings) {
  const element = el('.console');
  const add = something => {
    const node = document.createElement('div');
    const text = htmlEncode(something.toString());

    node.innerHTML = '<p>' + text + '</p>';
    element.appendChild(node);
  }

  (function(){
      const originalError = console.error;
      const originalLog = console.log;
      const originalWarning = console.warn;
      const originalInfo = console.info;
      const originalClear = console.clear;

      console.error = function (error) {
        add(error.toString() + error.stack);
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
        element.innerHTML = '';
        originalClear.apply(console, args);
      };
  })();

  return {
    clear: () => (element.innerHTML = '')
  }
}