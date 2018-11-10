import { getResources, getSettings, getCurrentDemo } from './utils';
import { loadEditorTheme, createEditor } from './editor';
import createConsolePanel from './console';
import screenSplit from './screenSplit';
import navigation from './navigation';
import execute from './execute';

window.onload = async function () {
  screenSplit();

  let editor;
  const settings = await getSettings(window.SETTINGS_PATH);
  const initialEditorValue = await getCurrentDemo(settings);
  const { clear: clearConsole } = createConsolePanel(settings);
  const { indicateFileEditing, saveLatestChangeInLocalStorage, onRestoreFromLocalStorage } = navigation(settings);

  await getResources(settings);
  await loadEditorTheme(settings);

  editor = await createEditor(
    settings,
    initialEditorValue,
    function onSave(code) {
      clearConsole();
      execute(code);
      saveLatestChangeInLocalStorage(code);
      indicateFileEditing(false);
    },
    function onChange(code) {
      indicateFileEditing(true);
    }
  );

  onRestoreFromLocalStorage(code => {
    editor.setValue(code);
    editor.focus();
  });

  document.querySelector('.container').style.opacity = 1;

  if (initialEditorValue) {
    clearConsole();
    execute(initialEditorValue);
  }
};