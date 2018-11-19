import createPopup from './popup';

const ENTER_KEY = 13;

export default function newFilePopUp() {
  return new Promise(done => {
    const { filenameInput, saveButton, closePopup } = createPopup({
      title: 'New file',
      content: `
        <input name="filename" data-export="filenameInput" placeholder="untitled.js"/>
        <button class="save" data-export="saveButton">Save</button>
      `,
      cleanUp() {
        done();
      }
    });
    const save = () => {
      filenameInput.e.value !== '' && done(filenameInput.e.value);
      closePopup();
    }
    
    filenameInput.e.focus();
    filenameInput.onKeyUp(e => {
      if (e.keyCode === ENTER_KEY) {
        save();
      }
    });
    saveButton.onClick(save);
  });
}