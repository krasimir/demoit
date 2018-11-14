import { isLocalStorageAvailable } from './utils';

export const LS_KEY = 'DEMOIT_v1';
const EMPTY_FILE = {
  content: '',
  filename: 'untitled.js',
  editing: false
};

const resolveActiveFileIndex = function (files) {
  const hash = location.hash.replace(/^#/, '');

  if (hash !== '') {
    const found = files.findIndex(({ filename }) => filename === hash);

    if (found >= 0) {
      return found;
    }
  }
  return 0;
}

export default function createStorage(settings) {
  const localStorageAvailable = isLocalStorageAvailable();
  const onChangeListeners = [];
  var activeFileIndex = resolveActiveFileIndex(settings.files);

  const notify = () => onChangeListeners.forEach(c => c());
  const syncSettings = () => {
    if (localStorageAvailable) {
      localStorage.setItem(LS_KEY, JSON.stringify(settings));
    }
  }
  
  const api = {
    getCurrentIndex() {
      return activeFileIndex;
    },
    setCurrentIndex(idx) {
      activeFileIndex = idx;
      location.hash = settings.files[idx].filename;
      notify();
    },
    isCurrentIndex(idx) {
      return activeFileIndex === idx;
    },
    getCurrentFile() {
      return this.getFiles()[activeFileIndex];
    },
    getFiles() {
      return settings.files;
    },
    dump() {
      return settings;
    },
    getDependencies() {
      return settings.dependencies;
    },
    setDependencies(dependencies) {
      settings.dependencies = dependencies;
      syncSettings();
      notify();
    },
    getEditorSettings() {
      return settings.editor;
    },
    getFileAt(index) {
      return this.getFiles()[index];
    },
    makeSureOneFileAtLeast() {
      if (this.getFiles().length === 0) {
        settings.files.push(EMPTY_FILE);
        this.setCurrentIndex(0);
        syncSettings();
      }
    },
    editFile(index, updates) {
      settings.files[index] = {
        ...settings.files[index],
        ...updates
      };
      syncSettings();
      notify();
      this.setCurrentIndex(activeFileIndex);
    },
    editCurrentFile(updates) {
      this.editFile(activeFileIndex, updates);
    },
    changeActiveFile(index) {
      this.setCurrentIndex(index);
      return this.getCurrentFile();
    },
    addNewFile() {
      settings.files.push(EMPTY_FILE);
      syncSettings();
      return this.changeActiveFile(settings.files.length - 1);
    },
    deleteFile(index) {
      if (index === activeFileIndex) {
        settings.files.splice(index, 1);
        syncSettings();
        this.setCurrentIndex(0);
      } else {
        const currentFile = this.getCurrentFile();
        settings.files.splice(index, 1);
        syncSettings();
        this.setCurrentIndex(this.getFiles().findIndex(file => file === currentFile) || 0);
      }
    },
    clear() {
      if (isLocalStorageAvailable) {
        localStorage.clear();
      }
      notify();
    },
    listen(callback) {
      onChangeListeners.push(callback);
    }
  }

  api.makeSureOneFileAtLeast();

  return api;
}