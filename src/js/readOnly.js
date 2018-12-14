import el from './utils/element';
import { injectCSS } from './utils/executeCSS';
import createConsole from './console';
import output from './output';
import dependencies from './dependencies';

export default function preview(state) {
  const container = el.withFallback('.js-code-editor');
  const clearConsole = createConsole();
  const clearOutput = output();
  const loadDependencies = async () => {
    await dependencies(state, (percents, file) => {
      const content = `<div class="centered"><div class="spinner"></div></div>`;

      clearConsole(content);
      clearOutput(content);
    });
  }

  injectCSS(`.CodeMirror-cursor { height: 0 !important; }`, 'hide-editor-cursor');

  return async () => {
    const file = state.getCurrentFile();
    container.empty().content(file.preview);
    
    const index = state.getCurrentIndex();
    const entryPoint = state.getFiles().findIndex(({ entryPoint }) => entryPoint === true);
    const fileToExecuteIndex = entryPoint >= 0 ? entryPoint : index;

    if (fileToExecuteIndex >= 0 && state.getCode()) {
      await loadDependencies();
      clearConsole();
      clearOutput();
      (new Function('index', state.getCode()))(fileToExecuteIndex);
    }
  }
}