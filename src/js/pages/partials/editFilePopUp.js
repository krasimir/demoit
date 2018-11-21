import createPopup from './popup';
import { TRASH_ICON, CHECK_ICON } from '../../utils/icons';

const ENTER_KEY = 13;

export default function editFilePopUp(filename, totalNumOfFiles) {
  return new Promise(done => createPopup({
    title: 'Edit',
    content: `
      <input name="filename" data-export="filenameInput" value="${ filename }"/>
      <button class="save secondary" data-export="saveButton">${ CHECK_ICON }<span>Update</span></button>
      <button class="delete secondary right" data-export="deleteButton">${ TRASH_ICON }<span>Delete</span></button>
    `,
    cleanUp() {
      done(null);
    },
    onRender({ filenameInput, saveButton, closePopup, deleteButton }) {
      const save = () => {
        filenameInput.e.value !== '' && done(filenameInput.e.value);
        closePopup();
      }
      
      filenameInput.e.focus();
      filenameInput.e.setSelectionRange(0, filename.lastIndexOf('.'))
      filenameInput.onKeyUp(e => {
        if (e.keyCode === ENTER_KEY) {
          save();
        }
      });
      saveButton.onClick(save);
  
      totalNumOfFiles > 1 ? deleteButton.css('display', 'block') : deleteButton.css('display', 'none');
      deleteButton.onClick(() => (done('delete'), closePopup()));
    }
  }));
}