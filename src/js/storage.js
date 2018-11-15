import { isLocalStorageAvailable } from './utils';

const EMPTY_FILE = {
  content: '',
  filename: 'untitled.js',
  editing: false
};

export const LS_KEY = 'DEMOIT_v2';
export const DEFAULT_SETTINGS = {
  editor: { theme: 'material' },
  dependencies: [],
  files: [ EMPTY_FILE ]
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

export default function createStorage() {
  const localStorageAvailable = isLocalStorageAvailable();
  const onChangeListeners = [];
  var settings = DEFAULT_SETTINGS;
  var activeFileIndex = resolveActiveFileIndex(settings.files);

  const notify = () => onChangeListeners.forEach(c => c());
  const syncSettings = () => {
    if (localStorageAvailable) {
      localStorage.setItem(LS_KEY, JSON.stringify(settings));
    }
  }
  
  const api = {
    updateSettings(newSettings) {
      settings = newSettings;
      activeFileIndex = resolveActiveFileIndex(settings.files);
      syncSettings();
    },
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