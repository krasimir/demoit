import { el } from '../utils';

const ESC_KEY = 27;

export function modal(trigger, container, onShow) {
  let removeKeyUpListener;
  const body = el('body');
  const closeButton = container.find('.cancel');
  const escHandler = e => {
    if (e.keyCode === ESC_KEY) {
      removeKeyUpListener();
      api.close();
    }
  }
  const api = {
    show() {
      container.show();
      removeKeyUpListener = body.onKeyUp(escHandler);
      onShow && onShow();
    },
    close() {
      container.hide();
      removeKeyUpListener();
    }
  }

  trigger && trigger.onClick(() => api.show());
  closeButton && closeButton.onClick(() => api.close());
  
  return api;
}