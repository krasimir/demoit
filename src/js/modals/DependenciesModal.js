import { el, modal } from '../utils';
import { load } from '../dependencies';

export default function DependenciesModal(storage) {
  const saveButton = el('.manage-dependencies .save');
  const list = el('.dependencies-list');

  const { close } = modal(
    el('.dependencies'),
    el('.manage-dependencies'),
    () => list.prop('value', storage.getDependencies().join('\n'))
  );

  saveButton.onClick(async () => {
    storage.setDependencies(list.prop('value').split(/\r?\n/).filter(dep => (dep !== '' || dep !== '\n')));
    saveButton.content('loading dependencies ...').prop('disabled', true);
    await load(storage.getDependencies());
    close();
    saveButton.content('Save').prop('disabled', false);
  });
}