import settingsPopUp from './popups/settingsPopUp';
import download from './download';

const filterDeps = deps => deps.filter(dep => (dep !== '' && dep !== '\n'));

export default function settings(state, render, executeCurrentFile) {
  const showSettingsPopUp = tab => settingsPopUp(
    download(state),
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
    },
    tab
  );

  return showSettingsPopUp;
}