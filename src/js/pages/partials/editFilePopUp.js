import createPopup from './popup';
import { TRASH_ICON } from '../../utils';

const ENTER_KEY = 13;

export default function editFilePopUp(filename, totalNumOfFiles) {
  return new Promise(done => {
    const { filenameInput, saveButton, closePopup, deleteButton } = createPopup({
      title: 'Edit',
      content: `
        <input name="filename" data-export="filenameInput" value="${ filename }"/>
        <button class="save" data-export="saveButton">Save</button>
        <hr />
        <button class="delete secondary" data-export="deleteButton">${ TRASH_ICON }</button>
      `,
      cleanUp() {
        done(null);
      }
    });
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
  });
}