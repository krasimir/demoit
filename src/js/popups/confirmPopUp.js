import { CHECK_ICON, CLOSE_ICON } from '../utils/icons';
import createPopup from './popup';

export default function confirmPopUp(title, message, onChange) {
  createPopup({
    title,
    content: `
      <p class="mb3">${ message }</p>
      <button class="save secondary" data-export="yesButton">${ CHECK_ICON }<span>Yes</span></button>
      <button class="save secondary right" data-export="noButton">${ CLOSE_ICON() }<span>No</span></button>
    `,
    onRender({ yesButton, noButton, closePopup }) {
      const save = (value) => {
        onChange(value);
        closePopup();
      };

      yesButton.onClick(() => save(true));
      noButton.onClick(() => save(false));
    }
  });
};
