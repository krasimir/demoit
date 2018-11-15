import { modal } from '../utils';

export default function manageStorage({ storage, changePage }) {
  return {
    name: 'manageStorage',
    didMount({ el, pageDOMElement }) {
      const settingsJSON = el('.settings-json');
      const clearStorageButton = el('.clear-storage');

      settingsJSON.prop('value', JSON.stringify(storage.dump(), null, 2));
      
      clearStorageButton.onClick(() => {
        storage.clear();
        window.location.reload();
      });

      modal(pageDOMElement, () => changePage('editor'));
    }
  }
}