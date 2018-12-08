import { el } from './utils/element';

export default function preview(state) {
  const container = el.withFallback('.js-code-editor');

  return ({ preview }) => container.empty().content(preview);
}