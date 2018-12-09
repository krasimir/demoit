
import settingsPopUp from './popups/settingsPopUp';
import { LAYOUTS } from './layout';

const filterDeps = deps => deps.filter(dep => (dep !== '' && dep !== '\n'));

export default function settings(state, render, executeCurrentFile) {
  return () => settingsPopUp(
    JSON.stringify(state.dump(), null, 2),
    filterDeps(state.getDependencies()).join('\n'),
    function onDepsUpdated(newDeps) {
      if (newDeps) {
        state.setDependencies(newDeps);
        executeCurrentFile();
      }
    },
    function onLayoutUpdate(newLayout) {
      state.updateLayout(LAYOUTS[newLayout]);
      render();
    }
  );
}