import layout from './layout';
import editor from './editor';
import createState from './state';
import newFilePopUp from './popups/newFilePopUp';
import editFilePopUp from './popups/editFilePopUp';
import settings from './settings';
import statusBar from './statusBar';
import preview from './preview';
import { mode, PREVIEW, EDITOR } from './mode';

window.onload = async function () {
  const state = await createState();
  let loadFile;

  layout(state);
  if (mode === PREVIEW) {
    loadFile = preview(state);
  } else if (mode === EDITOR) {
    loadFile = await editor(state);
  }
  loadFile(state.getCurrentFile());

  statusBar(
    state,
    function showFile(index) {
      loadFile(state.changeActiveFile(index));
    },
    async function newFile() {
      const newFilename = await newFilePopUp();

      if (newFilename) {
        loadFile(state.addNewFile(newFilename));
      }
    },
    async function editFile(index) {
      const result = await editFilePopUp(
        state.getFileAt(index).filename,
        state.getFiles().length
      );

      if (result === 'delete') {
        state.deleteFile(index);
        loadFile(state.getCurrentFile());
      } else if (result) {
        state.editFile(index, { filename: result });
      }
    },
    settings(state)
  );
};