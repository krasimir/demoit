import { isLocalStorageAvailable, getParam, readFromJSONFile, isProd, ensureDemoIdInPageURL } from './utils';
import { cleanUpExecutedCSS } from './utils/executeCSS';
import { LAYOUTS } from './layout';
import API from './providers/api';

const EMPTY_FILE = {
  content: '',
  filename: 'untitled.js',
  editing: false
};
const LS_PROFILE_KEY = 'DEMOIT_PROFILE_v3';
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

const readFromLocalStorage = function (key) {
  if (isLocalStorageAvailable()) {
    const data = localStorage.getItem(key);

    try {
      if (data) return JSON.parse(data);
    } catch(error) {
      console.error(`There is some data in the local storage under the ${ key } key. However, it is not a valid JSON.`);
    }
  }
  return null;
}

export default async function createState() {
  const localStorageAvailable = isLocalStorageAvailable();
  const onChangeListeners = [];
  let profile = readFromLocalStorage(LS_PROFILE_KEY);
  let pendingChanges = false;

  var state = window.state;
  
  if (!state) {
    const stateFromURL = getParam('state');
    
    if (stateFromURL) {
      try {
        state = await readFromJSONFile(stateFromURL);
      } catch(error) {
        console.error(`Error reading ${ stateFromURL }`);
      }
    } else {
      state = DEFAULT_STATE;
    }
  }

  var activeFileIndex = resolveActiveFileIndex(state.files);

  const notify = () => onChangeListeners.forEach(c => c());
  const syncState = async () => {
    notify();
    if (localStorageAvailable) {
      localStorage.setItem(LS_PROFILE_KEY, JSON.stringify(profile));
    }
    if (isProd() && api.loggedIn()) {
      const demoId = await API.saveDemo(state, profile.token);

      if (demoId) {
        state.id = demoId;
        ensureDemoIdInPageURL(demoId);
      }
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
      return state.files[idx];
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
    addNewFile(filename = 'untitled.js') {
      state.files.push({ ...EMPTY_FILE, filename });
      this.setCurrentIndex(state.files.length - 1);
      syncState();
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
    setEntryPoint(index) {
      state.files = state.files.map((file, i) => {
        if (i === index) {
          file.entryPoint = true;
        } else {
          delete file.entryPoint;
        }
        return file;
      });
    },
    pendingChanges(status) {
      if (typeof status !== 'undefined') {
        pendingChanges = status;
        notify();
      }
      return pendingChanges;
    },
    // profile methods
    loggedIn() {
      return profile !== null;
    },
    login(userProfile) {
      profile = userProfile;
      syncState();
    },
    getProfile() {
      return profile;
    }
  }

  api.makeSureOneFileAtLeast();

  return api;
}