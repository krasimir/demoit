import { el } from './utils';

export default function editFile(storage) {
  const panel = el('.edit-file');
  const filenameInput = el('.edit-file input[name="filename"]');
  const saveButton = el('.edit-file .save');
  const cancelButton = el('.edit-file .cancel');
  const deleteButton = el('.edit-file .delete');
  var currentEditedFileIndex;
  var callback;

  saveButton.addEventListener('click', () => {
    storage.editFile(currentEditedFileIndex, {
      filename: filenameInput.value
    });
    filenameInput.value = '';
    panel.style.display = 'none';
    callback('rename');
  });
  cancelButton.addEventListener('click', () => {
    filenameInput.value = '';
    panel.style.display = 'none';
  });
  deleteButton.addEventListener('click', () => {
    storage.deleteFile(currentEditedFileIndex);
    filenameInput.value = '';
    panel.style.display = 'none';
    callback('delete');
  });
  return (index, cb) => {
    const currentFile = storage.getFileAt(index);

    deleteButton.style.display = storage.getFiles().length > 1 ? 'block' : 'none';

    currentEditedFileIndex = index;
    callback = cb;
    filenameInput.value = currentFile.filename;
    panel.style.display = 'block';
    filenameInput.focus();
  }
}