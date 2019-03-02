/* eslint-disable no-use-before-define, no-sequences */
import pkg from '../../package.json';
import el from './utils/element';
import layout from './layout';
import editor, { ON_SELECT, ON_FILE_CHANGE, ON_FILE_SAVE } from './editor';
import createState from './state';
import newFilePopUp from './popups/newFilePopUp';
import editFilePopUp from './popups/editFilePopUp';
import editNamePopUp from './popups/editNamePopUp';
import settings from './settings';
import statusBar from './statusBar';
import story from './story';
import storyReadOnly from './storyReadOnly';
import storyPreview from './storyPreview';
import annotate from './annotate';
import { DEBUG } from './constants';

createState(pkg.version).then(state => {
  async function render() {
    layout(state);

    let setFilePendingStatus = () => {};
    const addToStory = story(state, () => executeCurrentFile());
    const { loadFileInEditor: executeCurrentFile, save: saveCurrentFile } = await editor(
      state,
      (event, data, editor) => {
        DEBUG && console.log('editor event=' + event);
        switch (event) {
          case ON_SELECT:
          addToStory(data, editor);
          break;
          case ON_FILE_CHANGE:
          setFilePendingStatus(true);
          break;
          case ON_FILE_SAVE:
          setFilePendingStatus(false);
          break;
        }
      }
    );

    storyReadOnly(state, () => executeCurrentFile());
    storyPreview(state);
    annotate(state);
    executeCurrentFile();

    const showSettings = settings(
      state,
      () => {
        state.removeListeners(),
        el.destroy();
        render();
      },
      () => executeCurrentFile()
    );

    setFilePendingStatus = statusBar(
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
