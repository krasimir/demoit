import el from './utils/element';
import { isProd } from './utils';
import layout from './layout';
import editor from './editor';
import createState from './state';
import newFilePopUp from './popups/newFilePopUp';
import editFilePopUp from './popups/editFilePopUp';
import editNamePopUp from './popups/editNamePopUp';
import settings from './settings';
import statusBar from './statusBar';
import profile from './profile';

createState().then(state => {
  async function render() {      
    layout(state);
    
    const executeCurrentFile = await editor(state);
  
    executeCurrentFile();
  
    const showSettings = settings(
      state,
      () => (el.destroy(), render()), 
      () => executeCurrentFile()
    );

    const showProfile = profile(state).showProfile;
  
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
      showSettings,
      showProfile,
      function editName() {
        editNamePopUp(state.name(), newName => state.name(newName));
      }
    );

    setTimeout(showSettings, 400);
  };
  render();
});

window.addEventListener('load', () => {
  if (!('serviceWorker' in navigator) || !isProd()) {
    return;
  }

  navigator.serviceWorker.register('/sw.js').then(
    () => {},
    err => console.error('SW registration failed!')
  )
})