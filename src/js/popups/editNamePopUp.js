import createPopup from './popup';
import { CHECK_ICON } from '../utils/icons';

const ENTER_KEY = 13;

export default function editNamePopUp(currentName, onChange) {
  createPopup({
    title: 'Edit demo name',
    content: `
      <input data-export="nameInput" value="${ currentName }"/>
      <button class="save secondary" data-export="saveButton">${ CHECK_ICON }<span>Update</span></button>
    `,
    onRender({ nameInput, saveButton, closePopup }) {
      const save = () => {
        nameInput.e.value !== '' && onChange(nameInput.e.value);
        closePopup();
      }
      
      nameInput.e.focus();
      nameInput.e.setSelectionRange(0, currentName.lastIndexOf('.'))
      nameInput.onKeyUp(e => {
        if (e.keyCode === ENTER_KEY) {
          save();
        }
      });
      saveButton.onClick(save);
    }
  });
}