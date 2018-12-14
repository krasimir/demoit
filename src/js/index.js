import layout from './layout';
import editor from './editor';
import createState from './state';
import newFilePopUp from './popups/newFilePopUp';
import editFilePopUp from './popups/editFilePopUp';
import settings from './settings';
import statusBar from './statusBar';
import preview from './preview';
import readOnly from './readOnly';
import { isPreviewMode, isEditorMode, isReadOnlyMode } from './mode';
import el from './utils/element';

createState().then(state => {
  async function render() {
    let executeCurrentFile;
    
    layout(state);
  
    if (isPreviewMode()) {
      executeCurrentFile = preview(state);
    } else if (isEditorMode()) {
      executeCurrentFile = await editor(state);
    } else if (isReadOnlyMode()) {
      executeCurrentFile = readOnly(state);
    }
    executeCurrentFile();
  
    const showSettings = settings(
      state,
      () => (el.destroy(), render()), 
      () => executeCurrentFile()
    );
  
    statusBar(
      state,
      function showFile(index) {
        state.setCurrentIndex(index);
        executeCurrentFile();
      },
      async function newFile() {
        const newFilename = await newFilePopUp();
  
        if (newFilename) {
          state.addNewFile(newFilename);
          executeCurrentFile();
        }
      },
      async function editFile(index) {
        editFilePopUp(
          state.getFileAt(index).filename,
          state.getFiles().length,
          function onDelete() {
            state.deleteFile(index);
            executeCurrentFile();
          },
          function onRename(newName) {
            state.editFile(index, { filename: newName });
            executeCurrentFile();
          },
          function onSetAsEntryPoint() {
            state.setEntryPoint(index)
            executeCurrentFile();
          }
        );
      },
      showSettings
    );
  };

  render();
});