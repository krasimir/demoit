import {
  teardown,
  editorLayout,
  execute as executeCode
} from '../utils';
import createConsolePanel from './partials/console';
import statusBar from './partials/statusBar';
import createEditor from './partials/codeMirror';
import newFilePopUp from '../popups//newFilePopUp';
import editFilePopUp from '../popups/editFilePopUp';
import settings from './partials/settings';

let codeMirrorEditor;

export default function editor({ state, changePage }) {
  return {
    name: 'editor',
    async didMount() {
      editorLayout(state.getEditorSettings().layout, state.updateLayout);
      
      const showSettings = settings(state, changePage);
      const { content: initialEditorValue } = state.getCurrentFile();
      const cleanUp = teardown(createConsolePanel());
      const execute = () => executeCode(state.getCurrentIndex(), state.getFiles());

      codeMirrorEditor = await createEditor(
        state.getEditorSettings(),
        initialEditorValue,
        async function onSave(code) {
          await cleanUp();
          state.editCurrentFile({ content: code, editing: false  });
          execute();
        },
        function onChange(code) {
          state.editCurrentFile({ editing: true  });
        }
      );

      const loadFileInEditor = async (file) => {
        await cleanUp();
        codeMirrorEditor.setValue(file.content);
        codeMirrorEditor.focus();
        // we have to do this because we fire the onChange handler of the editor which sets editing=true;
        state.editCurrentFile({ editing: false  });
        execute();
      }

      statusBar(
        state,
        function showFile(index) {
          loadFileInEditor(state.changeActiveFile(index));
        },
        async function newFile() {
          const newFilename = await newFilePopUp();

          if (newFilename) {
            loadFileInEditor(state.addNewFile(newFilename));
          }
        },
        async function editFile(index) {
          const result = await editFilePopUp(
            state.getFileAt(index).filename,
            state.getFiles().length
          );

          if (result === 'delete') {
            state.deleteFile(index);
            loadFileInEditor(state.getCurrentFile());
          } else if (result) {
            state.editFile(index, { filename: result });
          }
        },
        showSettings
      );

      execute();
    },
    didShow() {
      codeMirrorEditor && codeMirrorEditor.focus();
    }
  }
}
