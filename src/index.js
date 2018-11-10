import { loadResources, getSettings } from './utils';
import { getCurrentSnippet, getSnippet, newSnippet, updateSnippetCache } from './storage';
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
  const cleanUp = teardown(createConsolePanel(settings));
  const {
    indicateFileEditing,
    saveLatestChangeInLocalStorage,
    onRestoreFromLocalStorage,
    onShowSnippet,
    onNewSnippet,
    initNavigation
  } = navigation(settings);

  await loadResources(settings);
  await loadEditorTheme(settings);

  const editor = await createEditor(
    settings,
    initialEditorValue,
    async function onSave(code) {
      await cleanUp();
      saveLatestChangeInLocalStorage(code);
      indicateFileEditing(false);
      execute(code);
      updateSnippetCache(code);
    },
    function onChange(code) {
      indicateFileEditing(true);
    }
  );

  onRestoreFromLocalStorage(code => {
    editor.setValue(code);
    editor.focus();
  });
  onShowSnippet(async () => {
    const code = await getSnippet(settings);

    await cleanUp();
    editor.setValue(code);
    editor.focus();
    initNavigation();
    execute(code);
  });
  onNewSnippet(async () => {
    const [ demoIdx, snippetIdx ] = newSnippet(settings);

    await cleanUp();
    editor.setValue('');
    editor.focus();
    initNavigation();
    execute('');
  });

  if (initialEditorValue) {
    execute(initialEditorValue);
  }

  document.querySelector('.container').style.opacity = 1;
};