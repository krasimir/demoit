import {
  teardown,
  editorLayout,
  execute as executeCode
} from '../utils';
import createConsolePanel from './partials/console';
import navigation from './partials/navigation';
import createEditor from './partials/codeMirror';
import newFilePopUp from './partials/newFilePopUp';
import editFilePopUp from './partials/editFilePopUp';
import dependenciesPopUp from './partials/dependenciesPopUp';
import storagePopUp from './partials/storagePopUp';

let codeMirrorEditor;

export default function editor({ storage, changePage }) {
  return {
    editor: null,
    name: 'editor',
    permanentInDOM: true,
    async didMount() {
      editorLayout(storage.getEditorSettings().layout, storage.updateLayout);

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
          const newFilename = await newFilePopUp();

          if (newFilename) {
            loadFileInEditor(storage.addNewFile(newFilename));
          }
        },
        async function editFile(index) {
          const result = await editFilePopUp(
            storage.getFileAt(index).filename,
            storage.getFiles().length
          );

          if (result === 'delete') {
            storage.deleteFile(index);
            loadFileInEditor(storage.getCurrentFile());
          } else if (result) {
            storage.editFile(index, { filename: result });
          }
        },
        function manageStorage() {
          storagePopUp(
            JSON.stringify(storage.dump(), null, 2),
            () => {
              storage.clear();
              window.location = window.location.href.split("?")[0];
              window.location.reload(false);
            }
          );
        },
        async function manageDependencies() {
          const filterDeps = deps => deps.filter(dep => (dep !== '' && dep !== '\n'));
          const newDeps = await dependenciesPopUp(filterDeps(storage.getDependencies()).join('\n'));

          if (newDeps) {
            storage.setDependencies(newDeps);
            changePage('dependencies');
          }
        }
      );

      execute();
    },
    didShow() {
      codeMirrorEditor && codeMirrorEditor.focus();
    },
    didUnmount() {

    }
  }
}
