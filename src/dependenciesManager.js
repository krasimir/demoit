import { el } from './utils';

export default function dependenciesManager(storage, callback) {
  const toggleButton = el('.dependencies');
  const panel = el('.manage-dependencies');
  const closeButton = el('.manage-dependencies .cancel');
  const saveButton = el('.manage-dependencies .save');
  const list = el('.dependencies-list');
  
  toggleButton.addEventListener('click', () => {
    panel.style.display = 'block';
    list.value = storage.getDependencies().join('\n');
  });
  closeButton.addEventListener('click', () => {
    panel.style.display = 'none';
  });
  saveButton.addEventListener('click', async () => {
    storage.setDependencies(list.value.split(/\r?\n/).filter(dep => (dep !== '' || dep !== '\n')));
    saveButton.innerHTML = 'loading dependencies ...'
    saveButton.disabled = true;
    await callback();
    panel.style.display = 'none';
    saveButton.innerHTML = 'Save'
    saveButton.disabled = false;
  });
}