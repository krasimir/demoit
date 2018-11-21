import { el } from '../../utils';
import settingsPopUp from './settingsPopUp';

const filterDeps = deps => deps.filter(dep => (dep !== '' && dep !== '\n'));

export default function settings(storage, changePage) {
  const settingsButton = el('.settings');

  settingsButton.onClick(() => settingsPopUp(
    JSON.stringify(storage.dump(), null, 2),
    function flushStorage() {
      storage.clear();
      window.location = window.location.href.split("?")[0];
      window.location.reload(false);
    },
    filterDeps(storage.getDependencies()).join('\n'),
    function onDepsUpdated(newDeps) {
      if (newDeps) {
        storage.setDependencies(newDeps);
        changePage('dependencies');
      }
    }
  ));
}