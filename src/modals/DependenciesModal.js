import { el, modal, loadDependencies } from '../utils';

export default function DependenciesModal(storage) {
  const saveButton = el('.manage-dependencies .save');
  const list = el('.dependencies-list');

  const { close } = modal(
    el('.dependencies'),
    el('.manage-dependencies'),
    () => {
      list.value = storage.getDependencies().join('\n');
    }
  );

  saveButton.addEventListener('click', async () => {
    storage.setDependencies(list.value.split(/\r?\n/).filter(dep => (dep !== '' || dep !== '\n')));
    saveButton.innerHTML = 'loading dependencies ...'
    saveButton.disabled = true;
    await loadDependencies(storage.getDependencies());
    close();
    saveButton.innerHTML = 'Save'
    saveButton.disabled = false;
  });
}