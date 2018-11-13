import { isLocalStorageAvailable } from './utils';

const LS_KEY = 'DEMOIT_v1';
const EMPTY_FILE = {
  content: '',
  filename: 'untitled.js',
  editing: false
};
const DEFAULT_SETTINGS = {
  editor: { theme: 'material' },
  dependencies: [],
  files: []
};

const resolveSettings = async function () {
  // reading from local storage
  if (isLocalStorageAvailable()) {
    const settings = localStorage.getItem(LS_KEY);
    try {
      if (settings) return JSON.parse(settings);
    } catch(error) {
      console.error(`There is some data in the local storage under the ${ LS_KEY } key. However, it is not a valid JSON.`);
      return DEFAULT_SETTINGS;
    }
  }

  // loading `settings.json`
  try {
    const res = await fetch('./settings.json');
    return await res.json();
  } catch(error) {}

  // fallback to default settings
  return DEFAULT_SETTINGS;
}

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

export default async function createStorage() {
  const localStorageAvailable = isLocalStorageAvailable();
  const settings = await resolveSettings();
  const onChangeListeners = [];
  const notify = () => onChangeListeners.forEach(c => c());
  var activeFileIndex = resolveActiveFileIndex(settings.files);
  
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
      }
    },
    editFile(index, updates) {
      settings.files[index] = {
        ...settings.files[index],
        ...updates
      };
      if (localStorageAvailable) {
        localStorage.setItem(LS_KEY, JSON.stringify(settings));
      }
      notify();
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
      return this.changeActiveFile(settings.files.length - 1);
    },
    deleteFile(index) {
      if (index === activeFileIndex) {
        settings.files.splice(index, 1);
        this.setCurrentIndex(0);
      } else {
        const currentFile = this.getCurrentFile();
        settings.files.splice(index, 1);
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