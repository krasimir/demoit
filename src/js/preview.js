import el from './utils/element';
import { injectCSS } from './utils/executeCSS';

export default function preview(state) {
  const container = el.withFallback('.js-code-editor');

  injectCSS(`.CodeMirror-cursor { height: 0 !important; }`, 'hide-editor-cursor');

  return () => {
    const { preview } = state.getCurrentFile();
    container.empty().content(preview);
  }
}