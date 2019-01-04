import pkg from '../../package.json';
import el from './utils/element';
import { IS_PROD } from './constants';
import layout from './layout';
import editor, { ON_SELECT } from './editor';
import createState from './state';
import newFilePopUp from './popups/newFilePopUp';
import editFilePopUp from './popups/editFilePopUp';
import editNamePopUp from './popups/editNamePopUp';
import settings from './settings';
import statusBar from './statusBar';
import profile from './profile';
import story from './story';

createState(pkg.version).then(state => {
  async function render() {
    layout(state);
    
    const addToStory = story(state, () => executeCurrentFile());
    const { loadFileInEditor: executeCurrentFile } = await editor(state, [
      (event, data, editor) => (event === ON_SELECT && addToStory(data, editor))
    ]);
  
    executeCurrentFile();
  
    const showSettings = settings(
      state,
      () => (el.destroy(), render()), 
      () => executeCurrentFile()
    );
    const showProfile = profile(state).showProfile;
  
    statusBar(
      state,
      function showFile(filename) {
        state.setActiveFile(filename);
        executeCurrentFile();
      },
      async function newFile() {
        const newFilename = await newFilePopUp();
  
        if (newFilename) {
          state.addNewFile(newFilename);
          executeCurrentFile();
        }
      },
      async function editFile(filename) {
        editFilePopUp(
          filename,
          state.getNumOfFiles(),
          function onDelete() {
            state.deleteFile(filename);
            executeCurrentFile();
          },
          function onRename(newName) {
            state.renameFile(filename, newName);
            executeCurrentFile();
          },
          function onSetAsEntryPoint() {
            state.setEntryPoint(filename)
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
  };
  render();
});

window.addEventListener('load', () => {
  if (!('serviceWorker' in navigator) || !IS_PROD) {
    return;
  }

  navigator.serviceWorker.register('/sw.js?id=' + pkg.version).then(
    () => {},
    err => console.error('SW registration failed!')
  )
});
