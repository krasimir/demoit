import { el } from '../utils';

const ESC_KEY = 27;

export function modal(container, onClose) {
  const body = el('body');
  const escHandler = e => {
    if (e.keyCode === ESC_KEY) {
      removeKeyUpListener();
      onClose();
    }
  }
  const removeKeyUpListener = body.onKeyUp(escHandler);

  container.find('.cancel').onClick(() => {
    removeKeyUpListener();
    onClose();
  });
}