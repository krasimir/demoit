import { getResources, getSettings, getCurrentSnippet, getSnippet } from './utils';
import { loadEditorTheme, createEditor } from './editor';
import createConsolePanel from './console';
import screenSplit from './screenSplit';
import navigation from './navigation';
import execute from './execute';
import teardown from './teardown';

window.onload = async function () {
  screenSplit();

  const settings = await getSettings(window.SETTINGS_PATH);
  const initialEditorValue = await getCurrentSnippet(settings);
  const console = createConsolePanel(settings);
  const cleanUp = teardown(console);
  const {
    indicateFileEditing,
    saveLatestChangeInLocalStorage,
    onRestoreFromLocalStorage,
    onShowSnippet,
    initNavigation
  } = navigation(settings);

  await getResources(settings);
  await loadEditorTheme(settings);

  const editor = await createEditor(
    settings,
    initialEditorValue,
    async function onSave(code) {
      await cleanUp();
      saveLatestChangeInLocalStorage(code);
      indicateFileEditing(false);
      execute(code);
    },
    function onChange(code) {
      indicateFileEditing(true);
    }
  );

  onRestoreFromLocalStorage(code => {
    editor.setValue(code);
    editor.focus();
  });
  onShowSnippet(async (demoIdx, snippetIdx) => {
    const code = await getSnippet(settings, demoIdx, snippetIdx);
    
    await cleanUp();
    editor.setValue(code);
    editor.focus();
    initNavigation();
    execute(code);
  });

  if (initialEditorValue) {
    execute(initialEditorValue);
  }

  document.querySelector('.container').style.opacity = 1;
};