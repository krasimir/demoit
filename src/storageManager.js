import { el } from './utils';

export default function storageManager(storage) {
  const manageStorageButton = el('.storage');
  const manageStoragePanel = el('.manage-storage');
  const closeManageStoragePanel = el('.manage-storage .cancel');
  const clearStorageButton = el('.clear-storage');
  const settingsJSON = el('.settings-json');

  manageStorageButton.addEventListener('click', () => {
    manageStoragePanel.style.display = 'block';
    settingsJSON.value = JSON.stringify(storage.dump(), null, 2)
  });
  closeManageStoragePanel.addEventListener('click', () => {
    manageStoragePanel.style.display = 'none';
  });
  clearStorageButton.addEventListener('click', () => {
    storage.clear();
    window.location.reload();
  });
}