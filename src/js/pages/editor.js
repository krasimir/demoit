import {
  teardown,
  screenSplit,
  execute as executeCode
} from '../utils';
import createConsolePanel from './partials/console';
import navigation from './partials/navigation';
import createEditor from './partials/codeMirror';
import newFilePopUp from './partials/newFilePopUp';
import editFilePopUp from './partials/editFilePopUp';

let codeMirrorEditor;

export default function editor({ storage, changePage }) {
  return {
    editor: null,
    name: 'editor',
    permanentInDOM: true,
    async didMount({ el }) {
      screenSplit();

      const { content: initialEditorValue } = storage.getCurrentFile();
      const cleanUp = teardown(createConsolePanel());
      const execute = () => executeCode(storage.getCurrentIndex(), storage.getFiles());

      codeMirrorEditor = await createEditor(
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
        codeMirrorEditor.setValue(file.content);
        codeMirrorEditor.focus();
        // we have to do this because we fire the onChange handler of the editor which sets editing=true;
        storage.editCurrentFile({ editing: false  });
        execute();
      }

      navigation(
        storage,
        function showFile(index) {
          loadFileInEditor(storage.changeActiveFile(index));
        },
        async function newFile() {
          loadFileInEditor(storage.addNewFile(await newFilePopUp()));
        },
        async function editFile(index) {
          const result = await editFilePopUp(
            storage.getFileAt(index).filename,
            storage.getFiles().length
          );

          if (result === null) {
            storage.deleteFile(index);
            loadFileInEditor(storage.getCurrentFile());
          } else {
            storage.editFile(index, { filename: result });
          }
        },
        function manageStorage() {
          changePage('manageStorage');
        },
        function manageDependencies() {
          changePage('manageDependencies');
        }
      );

      execute();
    },
    didShow() {
      codeMirrorEditor && codeMirrorEditor.focus();
    }
  }
}
