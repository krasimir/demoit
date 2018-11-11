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
import storageManager from './storageManager';

window.onload = async function () {
  screenSplit();

  const storage = await createStorage();
  const { content: initialEditorValue } = storage.getCurrentFile();
  const cleanUp = teardown(createConsolePanel());
  const editFilePanel = createEditFilePanel(storage);

  storageManager(storage);
  await loadResources(storage.getResources());
  await loadEditorTheme(storage.getEditorSettings());

  const editor = await createEditor(
    storage.getEditorSettings(),
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
  const loadFileInEditor = async (file) => {
    await cleanUp();
    editor.setValue(file.content);
    editor.focus();
    // we have to do this because we fire the onChange handler of the editor which sets editing=true;
    storage.editCurrentFile({ editing: false  });
    execute(file.content);
    renderNavigation();
  }
  const renderNavigation = navigation(
    storage,
    async function showFile(index) {
      loadFileInEditor(storage.changeActiveFile(index))
    },
    async function newFile() {
      loadFileInEditor(storage.addNewFile());
    },
    function editFile(index) {
      editFilePanel(index, async (action) => {
        renderNavigation();
        if (action === 'delete') {
          loadFileInEditor(storage.getCurrentFile());
        }
        editor.focus();
      });
    }
  );

  if (initialEditorValue) {
    execute(initialEditorValue);
  }

  document.querySelector('.container').style.opacity = 1;
};