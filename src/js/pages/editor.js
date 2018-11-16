import {
  teardown,
  screenSplit,
  execute as executeCode,
  editor as createEditor
} from '../utils';
import createConsolePanel from './partials/console';
import navigation from './partials/navigation';

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
          loadFileInEditor(storage.changeActiveFile(index))
        },
        function newFile() {
          loadFileInEditor(storage.addNewFile());
        },
        function editFile(index) {
          changePage('fileEdit', index);
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
