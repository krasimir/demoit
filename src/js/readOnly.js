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

  return async (file) => {
    container.empty().content(file.preview);
    
    const fileIndex = state.getFiles().findIndex(({ filename }) => filename === file.filename);

    if (fileIndex >= 0 && state.getCode()) {
      await loadDependencies();
      clearConsole();
      clearOutput();
      (new Function('index', state.getCode()))(fileIndex);
    }
  }
}