import createStorage from './storage';
import { loadDependencies } from './utils';
import { loadEditorTheme, createEditor } from './editor';
import createConsolePanel from './console';
import screenSplit from './screenSplit';
import navigation from './navigation';
import executeCode from './execute';
import teardown from './teardown';
import createEditFilePanel from './editFile';
import storageManager from './storageManager';
import dependenciesManager from './dependenciesManager';

window.onload = async function () {
  screenSplit();

  const storage = await createStorage();
  const { content: initialEditorValue } = storage.getCurrentFile();
  const cleanUp = teardown(createConsolePanel());
  const editFilePanel = createEditFilePanel(storage);
  const execute = () => executeCode(storage.getCurrentIndex(), storage.getFiles());

  storageManager(storage);
  await loadDependencies(storage.getDependencies());
  await loadEditorTheme(storage.getEditorSettings());

  const editor = await createEditor(
    storage.getEditorSettings(),
    initialEditorValue,
    async function onSave(code) {
      await cleanUp();
      storage.editCurrentFile({ content: code, editing: false  });
      renderNavigation();
      execute();
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
    execute();
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

  dependenciesManager(storage, async () => {
    await loadDependencies(storage.getDependencies());
  });

  execute();

  document.querySelector('.container').style.opacity = 1;
};