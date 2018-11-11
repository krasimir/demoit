import createStorage from './storage';
import { loadResources } from './utils';
import { getCurrentFileContent, getSnippet, newSnippet, updateSnippetCache } from './storage';
import { loadEditorTheme, createEditor } from './editor';
import createConsolePanel from './console';
import screenSplit from './screenSplit';
import navigation from './navigation';
import execute from './execute';
import teardown from './teardown';
import createEditFilePanel from './editFile';

window.onload = async function () {
  screenSplit();

  const storage = await createStorage();
  const settings = storage.settings;
  const { content: initialEditorValue } = storage.getCurrentFile();
  const cleanUp = teardown(createConsolePanel());
  const editFilePanel = createEditFilePanel(storage);

  await loadResources(settings);
  await loadEditorTheme(settings);

  const editor = await createEditor(
    settings,
    initialEditorValue,
    async function onSave(code) {
      await cleanUp();
      storage.editCurrentFile({ content: code, editing: false  });
      renderNavigation();
      execute(code);
      updateSnippetCache(code);
    },
    function onChange(code) {
      storage.editCurrentFile({ editing: true  });
      renderNavigation();
    }
  );
  const renderNavigation = navigation(
    storage,
    async function showFile(index) {
      const file = storage.changeActiveFile(index);

      await cleanUp();
      editor.setValue(file.content);
      editor.focus();
       // we have to do this because we fire the onChange handler of the editor which sets editing=true;
      storage.editCurrentFile({ editing: false  });
      renderNavigation();
      execute(file.content);
    },
    async function newFile() {
      const file = storage.addNewFile();

      await cleanUp();
      editor.setValue(file.content);
      editor.focus();
      renderNavigation();
      execute(file.content);
    },
    function editFile(index) {
      editFilePanel(index, () => {
        renderNavigation();
        editor.focus();
      });
    }
  );

  if (initialEditorValue) {
    execute(initialEditorValue);
  }

  document.querySelector('.container').style.opacity = 1;
};