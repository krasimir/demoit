import createPopup from './popup';
import { CHECK_ICON } from '../utils/icons';

const ENTER_KEY = 13;

export default function newFilePopUp() {
  return new Promise(done => createPopup({
    title: 'New file',
    content: `
      <input name="filename" data-export="filenameInput" placeholder="untitled.js"/>
      <button class="save secondary" data-export="saveButton">${ CHECK_ICON() }<span>Create</span></button>
    `,
    cleanUp() {
      done();
    },
    onRender({ filenameInput, saveButton, closePopup }) {
      const save = () => {
        filenameInput.e.value !== '' && done(filenameInput.e.value);
        closePopup();
      };

      filenameInput.e.focus();
      filenameInput.onKeyUp(e => {
        if (e.keyCode === ENTER_KEY) {
          save();
        }
      });
      saveButton.onClick(save);
    }
  }));
};
