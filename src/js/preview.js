import { el } from './utils/element';

export default function preview(state) {
  const container = el.withFallback('.js-code-editor');

  return ({ content }) => {
    container.empty();
    CodeMirror(container.e, {
      value: content,
      mode:  'jsx',
      tabSize: 2,
      lineNumbers: false,
      foldGutter: false,
      readOnly: true,
      gutters: [],
      styleSelectedText: true,
      ...state.getEditorSettings()
    });
  }
}