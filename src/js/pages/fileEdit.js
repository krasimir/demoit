import { modal } from '../utils';

export default function fileEdit({ storage, changePage }) {
  return {
    name: 'fileEdit',
    didMount({ el, pageDOMElement }, index) {
      const currentFile = storage.getFileAt(index);
      const filenameInput = el('input[name="filename"]');
      const saveButton = el('.save');
      const deleteButton = el('.delete');

      filenameInput.prop('value', currentFile.filename);
      filenameInput.e.focus();
      storage.getFiles().length > 1 ? deleteButton.css('display', 'block') : deleteButton.css('display', 'none');

      saveButton.onClick(() => {
        storage.editFile(index, {
          filename: filenameInput.prop('value')
        });
        filenameInput.prop('value', '');
        changePage('editor');
      });
      deleteButton.onClick(() => {
        storage.deleteFile(index);
        filenameInput.prop('value', '');
        changePage('editor');
      });

      modal(pageDOMElement, () => changePage('editor'));
    }
  }
}