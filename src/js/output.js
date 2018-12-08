import { el } from './utils/element';

export default function output() {
  const output = el.withFallback('.output');

  return async function clearOutput(hintValue = '&lt;div id="output" /&gt;') {
    if (typeof ReactDOM !== 'undefined') {
      ReactDOM.unmountComponentAtNode(output.e);
    }

    output.content(`<div class="hint">${ hintValue }</div>`);
  }
}