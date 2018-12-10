import { isLocalStorageAvailable, getParam, readFromJSONFile } from './utils';
import { cleanUpExecutedCSS } from './utils/executeCSS';
import { LAYOUTS } from './layout';

const EMPTY_FILE = {
  content: '',
  filename: 'untitled.js',
  editing: false
};
const LS_KEY = 'DEMOIT_v2';
const DEFAULT_STATE = {
  editor: {
    theme: 'light',
    statusBar: false,
    layout: LAYOUTS.default
  },
  dependencies: [],
  files: [ EMPTY_FILE ],
  code: ''
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

const readFromLocalStorage = function () {
  if (isLocalStorageAvailable()) {
    const state = localStorage.getItem(LS_KEY);

    try {
      if (state) return JSON.parse(state);
    } catch(error) {
      console.error(`There is some data in the local storage under the ${ LS_KEY } key. However, it is not a valid JSON.`);
    }
  }
  return null;
}

export default async function createState() {
  const localStorageAvailable = isLocalStorageAvailable();
  const onChangeListeners = [];

  const predefinedState = window.state || getParam('state');
  var state;

  if (predefinedState) {
    try {
      state = await readFromJSONFile(predefinedState);
    } catch(error) {
      console.error(`Error reading ${ predefinedState }`);
    }
  } else {
    state = DEFAULT_STATE;
  }

  var activeFileIndex = resolveActiveFileIndex(state.files);

  const syncState = () => {
    onChangeListeners.forEach(c => c());
    if (localStorageAvailable) {
      localStorage.setItem(LS_KEY, JSON.stringify(state));
    }
  }
  
  const api = {
    setState(newState) {
      state = newState;
      activeFileIndex = resolveActiveFileIndex(state.files);
      syncState();
    },
    getCurrentIndex() {
      return activeFileIndex;
    },
    setCurrentIndex(idx) {
      activeFileIndex = idx;
      location.hash = state.files[idx].filename;
      syncState();
    },
    isCurrentIndex(idx) {
      return activeFileIndex === idx;
    },
    getCurrentFile() {
      return this.getFiles()[activeFileIndex];
    },
    getFiles() {
      return state.files;
    },
    dump() {
      return state;
    },
    getDependencies() {
      return state.dependencies;
    },
    setDependencies(dependencies) {
      state.dependencies = dependencies;
      syncState();
    },
    getEditorSettings() {
      return state.editor;
    },
    getFileAt(index) {
      return this.getFiles()[index];
    },
    makeSureOneFileAtLeast() {
      if (this.getFiles().length === 0) {
        state.files.push(EMPTY_FILE);
        this.setCurrentIndex(0);
        syncState();
      }
    },
    editFile(index, updates) {
      state.files[index] = {
        ...state.files[index],
        ...updates
      };
      syncState();
      this.setCurrentIndex(activeFileIndex);
    },
    editCurrentFile(updates) {
      this.editFile(activeFileIndex, updates);
    },
    changeActiveFile(index) {
      this.setCurrentIndex(index);
      return this.getCurrentFile();
    },
    addNewFile(filename = 'untitled.js') {
      state.files.push({ ...EMPTY_FILE, filename });
      syncState();
      return this.changeActiveFile(state.files.length - 1);
    },
    deleteFile(index) {
      cleanUpExecutedCSS(this.getFileAt(index).filename);
      if (index === activeFileIndex) {
        state.files.splice(index, 1);
        syncState();
        this.setCurrentIndex(0);
      } else {
        const currentFile = this.getCurrentFile();
        state.files.splice(index, 1);
        syncState();
        this.setCurrentIndex(this.getFiles().findIndex(file => file === currentFile) || 0);
      }
    },
    clear() {
      if (isLocalStorageAvailable) {
        localStorage.clear();
      }
      syncState();
    },
    listen(callback) {
      onChangeListeners.push(callback);
    },
    updateLayout(newLayout) {
      state.editor.layout = newLayout;
      syncState();
    },
    updateTheme(newTheme) {
      state.editor.theme = newTheme;
      syncState();
    },
    updateCode(code) {
      state.code = code;
      syncState();
    },
    getCode() {
      return state.code;
    },
    updateStatusBarVisibility(value) {
      state.editor.statusBar = value;
    },
    restoreFromLocalStorage() {
      this.setState(readFromLocalStorage());
    }
  }

  api.makeSureOneFileAtLeast();

  return api;
}