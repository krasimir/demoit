import { el, modal } from '../utils';

export default function FileModal(storage) {
  const { show, close } = modal(null, el('.edit-file'));

  const filenameInput = el('.edit-file input[name="filename"]');
  const saveButton = el('.edit-file .save');
  const deleteButton = el('.edit-file .delete');
  let currentEditedFileIndex;
  let callback;

  saveButton.onClick(() => {
    storage.editFile(currentEditedFileIndex, {
      filename: filenameInput.prop('value')
    });
    filenameInput.prop('value', '');
    close();
    callback('rename');
  });
  deleteButton.onClick(() => {
    storage.deleteFile(currentEditedFileIndex);
    filenameInput.prop('value', '');
    close();
    callback('delete');
  });

  return (index, cb) => {
    const currentFile = storage.getFileAt(index);

    show();
    storage.getFiles().length > 1 ? deleteButton.show() : deleteButton.hide();
    currentEditedFileIndex = index;
    callback = cb;
    filenameInput.prop('value', currentFile.filename);
    filenameInput.e.focus();
  }
}
