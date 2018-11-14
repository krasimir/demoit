import { el, modal } from '../utils';

export default function FileModal(storage) {
  const { show, close } = modal(null, el('.edit-file'));

  const filenameInput = el('.edit-file input[name="filename"]');
  const saveButton = el('.edit-file .save');
  const deleteButton = el('.edit-file .delete');
  let currentEditedFileIndex;
  let callback;

  saveButton.addEventListener('click', () => {
    storage.editFile(currentEditedFileIndex, {
      filename: filenameInput.value
    });
    filenameInput.value = '';
    close();
    callback('rename');
  });
  deleteButton.addEventListener('click', () => {
    storage.deleteFile(currentEditedFileIndex);
    filenameInput.value = '';
    close();
    callback('delete');
  });

  return (index, cb) => {
    const currentFile = storage.getFileAt(index);

    show();
    deleteButton.style.display = storage.getFiles().length > 1 ? 'block' : 'none';
    currentEditedFileIndex = index;
    callback = cb;
    filenameInput.value = currentFile.filename;
    filenameInput.focus();
  }
}
