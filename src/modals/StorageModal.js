import { el, modal } from '../utils';

export default function StoragePanel(storage) {
  const settingsJSON = el('.settings-json');
  const clearStorageButton = el('.clear-storage');

  modal(el('.storage'), el('.manage-storage'), () => {
    settingsJSON.value = JSON.stringify(storage.dump(), null, 2);
  });
  
  clearStorageButton.addEventListener('click', () => {
    storage.clear();
    window.location.reload();
  });
}