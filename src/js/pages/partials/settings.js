import { el } from '../../utils';
import settingsPopUp from '../../popups/settingsPopUp';
import { LAYOUTS } from '../../utils/editorLayout';

const filterDeps = deps => deps.filter(dep => (dep !== '' && dep !== '\n'));

export default function settings(state, changePage) {
  const settingsButton = el('.settings');

  settingsButton.onClick(() => settingsPopUp(
    JSON.stringify(state.dump(), null, 2),
    function restoreFromStorage() {
      state.restoreFromLocalStorage();
      changePage('editor');
    },
    function flushStorage() {
      state.clear();
      window.location = window.location.href.split("?")[0];
      window.location.reload(false);
    },
    filterDeps(state.getDependencies()).join('\n'),
    function onDepsUpdated(newDeps) {
      if (newDeps) {
        state.setDependencies(newDeps);
        changePage('dependencies');
      }
    },
    function onLayoutUpdate(newLayout) {
      state.updateLayout(LAYOUTS[newLayout]);
      changePage('editor');
    }
  ));
}