
import settingsPopUp from './popups/settingsPopUp';

const filterDeps = deps => deps.filter(dep => (dep !== '' && dep !== '\n'));

export default function settings(state, render, executeCurrentFile) {
  const showSettingsPopUp = () => settingsPopUp(
    JSON.stringify(state.dump(), null, 2),
    state.getEditorSettings(),
    filterDeps(state.getDependencies()).join('\n'),
    function onDepsUpdated(newDeps) {
      if (newDeps) {
        state.setDependencies(newDeps);
        executeCurrentFile();
      }
    },
    function onGeneralUpdate(newTheme, newLayout) {
      state.updateTheme(newTheme);
      state.updateLayout(newLayout);
      render();
    }
  );

  return showSettingsPopUp;
}