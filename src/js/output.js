import { el } from './utils/element';

export default function output() {
  const output = el.withFallback('.output');

  return async function clearOutput(hintValue = `<div class="centered">&lt;div id="output" /&gt;</div>`) {
    if (typeof ReactDOM !== 'undefined') {
      ReactDOM.unmountComponentAtNode(output.e);
    }

    output.content(hintValue);
  }
}