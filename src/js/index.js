import { el } from './utils';
import createStorage from './storage';
import createEditor from './editor';
import createConsolePanel from './console';
import screenSplit from './screenSplit';
import navigation from './navigation';
import executeCode from './execute';
import teardown from './teardown';
import FileModal from './modals/FileModal';
import StorageModal from './modals/StorageModal';
import DependenciesModal from './modals/DependenciesModal';
import dependencies from './dependencies';

window.onload = async function () {

  const storage = await createStorage();
  const { content: initialEditorValue } = storage.getCurrentFile();
  const cleanUp = teardown(createConsolePanel());
  const execute = () => executeCode(storage.getCurrentIndex(), storage.getFiles());
  
  // modals
  const showEditFileModal = FileModal(storage);
  StorageModal(storage);
  DependenciesModal(storage);

  // loading initial resources
  await dependencies(storage);

  // editor
  const editor = await createEditor(
    storage.getEditorSettings(),
    initialEditorValue,
    async function onSave(code) {
      await cleanUp();
      storage.editCurrentFile({ content: code, editing: false  });
      execute();
    },
    function onChange(code) {
      storage.editCurrentFile({ editing: true  });
    }
  );
  const loadFileInEditor = async (file) => {
    await cleanUp();
    editor.setValue(file.content);
    editor.focus();
    // we have to do this because we fire the onChange handler of the editor which sets editing=true;
    storage.editCurrentFile({ editing: false  });
    execute();
  }

  // navigation
  navigation(
    storage,
    function showFile(index) {
      loadFileInEditor(storage.changeActiveFile(index))
    },
    function newFile() {
      loadFileInEditor(storage.addNewFile());
    },
    function editFile(index) {
      showEditFileModal(index, async (action) => {
        if (action === 'delete') {
          loadFileInEditor(storage.getCurrentFile());
        }
        editor.focus();
      });
    }
  );

  el('.container').style.visibility = 'visible';
  el('.container').style.opacity = 1;

  setTimeout(() => screenSplit(), 100);

  execute();
};