/* eslint-disable max-len */
import createPopup from './popup';
import { CHECK_ICON } from '../utils/icons';

const ENTER_KEY = 13;

export default function editNamePopUp({ name, id, description, published, storyWithCode, comments }, onChange) {
  name = name || '';

  createPopup({
    title: 'Edit story name',
    content: `
      <input data-export="nameInput" value="${ name }" placeholder="Name"/>
      <textarea placeholder="Description" data-export="descriptionInput">${ description || '' }</textarea>
      <label>
        <input type="checkbox" data-export="publishCheckbox" ${ published ? 'checked="checked"' : ''}/> Publish as a story at <a href="/e/${ id }/story" target="_blank">/e/${ id }/story</a>
      </label>
      <label>
        <input type="checkbox" data-export="withCode" ${ storyWithCode ? 'checked="checked"' : ''}/> Add the editor at the end of the story
      </label>
      <label>
        <input type="checkbox" data-export="withComments" ${ comments ? 'checked="checked"' : ''}/> Add a comments section at the end of the story
      </label>
      <button class="save secondary" data-export="saveButton">${ CHECK_ICON() }<span>Update</span></button>
    `,
    onRender({ nameInput, descriptionInput, publishCheckbox, saveButton, closePopup, withCode, withComments }) {
      const save = () => {
        if (nameInput.e.value !== '') {
          onChange({
            name: nameInput.e.value,
            description: descriptionInput.e.value,
            published: publishCheckbox.e.checked,
            storyWithCode: withCode.e.checked,
            comments: withComments.e.checked
          });
        }
        closePopup();
      };

      nameInput.e.focus();
      nameInput.e.setSelectionRange(0, name.lastIndexOf('.'));
      nameInput.onKeyUp(e => {
        if (e.keyCode === ENTER_KEY) {
          save();
        }
      });
      saveButton.onClick(save);
    }
  });
};
