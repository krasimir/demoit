/* eslint-disable no-use-before-define, no-sequences */
import pkg from '../../package.json';
import el from './utils/element';
import layout from './layout';
import editor, { ON_SELECT } from './editor';
import createState from './state';
import newFilePopUp from './popups/newFilePopUp';
import editFilePopUp from './popups/editFilePopUp';
import editNamePopUp from './popups/editNamePopUp';
import settings from './settings';
import statusBar from './statusBar';
import story from './story';

createState(pkg.version).then(state => {
  async function render() {
    layout(state);

    const addToStory = story(state, () => executeCurrentFile());
    const { loadFileInEditor: executeCurrentFile, save: saveCurrentFile } = await editor(state, [
      (event, data, editor) => (event === ON_SELECT && addToStory(data, editor))
    ]);

    executeCurrentFile();

    const showSettings = settings(
      state,
      () => (el.destroy(), render()),
      () => executeCurrentFile()
    );

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
            state.setEntryPoint(filename);
            executeCurrentFile();
          }
        );
      },
      showSettings,
      saveCurrentFile,
      function editName() {
        editNamePopUp(state.meta(), meta => state.meta(meta));
      }
    );
  };
  render();
});
