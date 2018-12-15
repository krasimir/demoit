import { getParam, removeParam } from './utils';
import el from './utils/element';
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
import profile from './profile';

if (getParam('code')) {
  // in a process of logging in
  createState().then(state => {
    profile(state).authorize(getParam('code')).catch(error => {
      const fallback = el('.layout');
      
      fallback.content(`
        <div class="authentication-failed">
          <h1>Authentication failed</h1>
          <p>Reason: ${ error && error.message ? error.message : 'Unknown' }</p>
          <p>
            <a href="javascript:void(0);" data-export="goBack">Go back</a><br />
            <a href="https://github.com/krasimir/demoit/issues">Report an issue</a><br />
          </p>
        </div>
      `);
      fallback.namedExports().goBack.onClick(() => window.location.href = removeParam('code', window.location.href));
    });
  });
} else {
  // proceed with the app ui
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
        showProfile
      );
    };

    render();
  });
}