const ESC_KEY = 27;

export function enableEscapeClosing(hideModal) {
  const body = document.querySelector('body');
  const close = e => {
    if (e.keyCode === ESC_KEY) {
      body.removeEventListener('keyup', close);
      hideModal();
    }
  };

  body.addEventListener('keyup', close);

  return () => close({ keyCode: ESC_KEY });
}

export function modal(trigger, container, onShow) {
  const body = document.querySelector('body');
  const closeButton = container.querySelector('.cancel');
  const escHandler = e => {
    if (e.keyCode === ESC_KEY) {
      body.removeEventListener('keyup', close);
      api.close();
    }
  }
  const api = {
    show() {
      container.style.display = 'block';
      body.addEventListener('keyup', escHandler);
      onShow && onShow();
    },
    close() {
      container.style.display = 'none';
      body.removeEventListener('keyup', escHandler);
    }
  }

  trigger && trigger.addEventListener('click', () => api.show());
  closeButton && closeButton.addEventListener('click', () => api.close());
  
  return api;
}