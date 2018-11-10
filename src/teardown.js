import { el } from './utils';

export default ({ clear: clearConsole }) => async function teardown() {
  clearConsole();
  
  const output = el('.output');

  if (typeof ReactDOM !== 'undefined') {
    ReactDOM.unmountComponentAtNode(output);
  }

  output.innerHTML = '<div class="hint">&lt;div id="output" /&gt;</div>';
}