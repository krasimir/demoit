import initialize from './initialize';
import layout from './layout';
import editor from './editor';
import createState from './state';
import newFilePopUp from './popups/newFilePopUp';
import editFilePopUp from './popups/editFilePopUp';
import settings from './settings';
import statusBar from './statusBar';

window.onload = async function () {
  const state = await createState();
  
  layout(state.getEditorSettings().layout, state.updateLayout);

  const loadFileInEditor = editor(state);

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
    settings(state)
  );
};