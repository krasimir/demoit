import { modal } from '../utils';

const ENTER_KEY = 13;

export default function fileEdit({ storage, changePage }) {
  return {
    name: 'fileEdit',
    didMount({ el, pageDOMElement }, index) {
      const currentFile = storage.getFileAt(index);
      const filenameInput = el('input[name="filename"]');
      const saveButton = el('.save');
      const deleteButton = el('.delete');
      const save = () => {
        storage.editFile(index, {
          filename: filenameInput.prop('value')
        });
        filenameInput.prop('value', '');
        changePage('editor');
      }

      filenameInput.prop('value', currentFile.filename);
      filenameInput.e.focus();
      filenameInput.onKeyUp(e => {
        if (e.keyCode === ENTER_KEY) {
          save();
        }
      });
      filenameInput.e.setSelectionRange(0, currentFile.filename.lastIndexOf('.'))
      storage.getFiles().length > 1 ? deleteButton.css('display', 'block') : deleteButton.css('display', 'none');

      saveButton.onClick(save);
      deleteButton.onClick(() => {
        storage.deleteFile(index);
        filenameInput.prop('value', '');
        changePage('editor');
      });

      modal(pageDOMElement, () => changePage('editor'));
    }
  }
}