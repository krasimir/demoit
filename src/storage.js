import { isLocalStorageAvailable } from './utils';
import storageManager from './storageManager';

const LS_KEY = 'DEMOIT_v1';
const EMPTY_FILE = {
  content: '',
  filename: 'untitled.js',
  editing: false
};
const DEFAULT_SETTINGS = {
  editor: { theme: 'material' },
  resources: [],
  files: []
};

const resolveSettings = async function () {

  // loading `settings.json`
  try {
    const res = await fetch('./settings.json');
    return await res.json();
  } catch(error) {}

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

  // fallback to default settings
  return DEFAULT_SETTINGS;
}

export default async function createStorage() {
  const localStorageAvailable = isLocalStorageAvailable();
  const settings = await resolveSettings();
  
  const api = {
    activeFileIndex: 0,
    dump() {
      return settings;
    },
    getResources() {
      return settings.resources;
    },
    getEditorSettings() {
      return settings.editor;
    },
    getFiles() {
      return settings.files;
    },
    getCurrentFile() {
      return this.getFiles()[this.activeFileIndex];
    },
    getFileAt(index) {
      return this.getFiles()[index];
    },
    makeSureOneFileAtLeast() {
      if (this.getFiles().length === 0) {
        settings.files.push(EMPTY_FILE);
        this.activeFileIndex = 0;
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
    },
    editCurrentFile(updates) {
      this.editFile(this.activeFileIndex, updates);
    },
    changeActiveFile(index) {
      this.activeFileIndex = index;
      return this.getCurrentFile();
    },
    addNewFile() {
      settings.files.push(EMPTY_FILE);
      return this.changeActiveFile(settings.files.length - 1);
    },
    deleteFile(index) {
      if (index === this.activeFileIndex) {
        this.activeFileIndex = 0;
        settings.files.splice(index, 1);
      } else {
        const currentFile = this.getCurrentFile();
        settings.files.splice(index, 1);
        this.activeFileIndex = this.getFiles().findIndex(file => file === currentFile) || 0;
      }
    }
  }

  api.makeSureOneFileAtLeast();

  return api;
}