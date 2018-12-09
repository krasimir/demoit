import layout from './layout';
import editor from './editor';
import createState from './state';
import newFilePopUp from './popups/newFilePopUp';
import editFilePopUp from './popups/editFilePopUp';
import settings from './settings';
import statusBar from './statusBar';
import preview from './preview';
import { isPreviewMode, isEditorMode } from './mode';
import el from './utils/element';

createState().then(state => {
  async function render() {
    let loadFile;
    
    layout(state);
  
    if (isPreviewMode()) {
      loadFile = preview(state);
    } else if (isEditorMode()) {
      loadFile = await editor(state);
    }
    loadFile(state.getCurrentFile());
  
    const showSettings = settings(state, render, () => loadFile(state.getCurrentFile()));
  
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
      showSettings
    );
  };

  render();
});