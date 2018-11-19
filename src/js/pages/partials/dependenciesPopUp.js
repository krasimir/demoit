import createPopup from './popup';

const ENTER_KEY = 13;

export default function dependenciesPopUp(dependenciesList) {
  return new Promise(done => {
    const { textarea, saveButton, closePopup } = createPopup({
      title: 'Dependencies',
      content: `
        <textarea class="dependencies-list" data-export="textarea"></textarea>
        <p><small>(Separate your dependencies by a new line)</small></p>
        <button class="save" data-export="saveButton">Save</button>
      `,
      cleanUp() {
        done(null);
      }
    });
    const save = () => {
      done(textarea.prop('value').split(/\r?\n/));
      closePopup();
    }
    
    textarea.prop('value', dependenciesList);
    textarea.onKeyUp(e => {
      if (e.keyCode === ENTER_KEY) {
        save();
      }
    });
    saveButton.onClick(save);
  });
}