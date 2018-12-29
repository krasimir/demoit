import {
  getParam,
  readFromJSONFile,
  ensureDemoIdInPageURL
} from './utils';
import { IS_PROD } from './constants';
import { cleanUpExecutedCSS } from './utils/executeCSS';
import { DEFAULT_LAYOUT } from './layout';
import API from './providers/api';
import LS from './utils/localStorage';

const EMPTY_FILE = {
  content: '',
  filename: 'untitled.js',
  editing: false
};
const LS_PROFILE_KEY = 'DEMOIT_PROFILE';
const DEFAULT_STATE = {
  name: '',
  editor: {
    theme: 'light',
    statusBar: false,
    layout: DEFAULT_LAYOUT
  },
  dependencies: [],
  files: [ EMPTY_FILE ],
  story: []
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

export default async function createState() {
  const onChangeListeners = [];
  let profile = LS(LS_PROFILE_KEY);
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

  const onChange = () => onChangeListeners.forEach(c => c());
  const persist = (fork = false, done = () => {}) => {
    if (IS_PROD && api.loggedIn()) {
      if (fork) { delete state.owner; }
      if (state.owner && state.owner !== profile.id) { return; }
      API.saveDemo(state, profile.token).then(demoId => {
        if (demoId && demoId !== state.demoId) {
          state.demoId = demoId;
          state.owner = profile.id;
          ensureDemoIdInPageURL(demoId);
        }
        done();
      });
    }
  }
  
  const api = {
    getDemoId() {
      if (!state.demoId) {
        throw new Error('There is no demoId!');
      }
      return state.demoId;
    },
    getCurrentIndex() {
      return activeFileIndex;
    },
    setCurrentIndex(idx) {
      activeFileIndex = idx;
      location.hash = state.files[idx].filename;
      onChange();
      return state.files[idx];
    },
    isCurrentIndex(idx) {
      return activeFileIndex === idx;
    },
    getCurrentFile() {
      if (this.getFiles()[activeFileIndex]) {
        return this.getFiles()[activeFileIndex];
      } else {
        return this.setCurrentIndex(0);
      }
    },
    getFiles() {
      return state.files;
    },
    setFiles(files) {
      state.files = files;
      onChange();
    },
    name(value) {
      if (typeof value !== 'undefined') {
        state.name = value;
        onChange();
        persist();
        return;
      }
      return state.name || '';
    },
    getDependencies() {
      return state.dependencies;
    },
    setDependencies(dependencies) {
      state.dependencies = dependencies;
      onChange();
      persist();
    },
    getEditorSettings() {
      return state.editor;
    },
    getFileAt(index) {
      return this.getFiles()[index];
    },
    editFile(index, updates) {
      state.files[index] = {
        ...state.files[index],
        ...updates
      };
      onChange();
      persist();
      this.setCurrentIndex(activeFileIndex);
    },
    editCurrentFile(updates) {
      this.editFile(activeFileIndex, updates);
    },
    addNewFile(filename = 'untitled.js') {
      state.files.push({ ...EMPTY_FILE, filename });
      this.setCurrentIndex(state.files.length - 1);
      onChange();
      persist();
    },
    deleteFile(index) {
      cleanUpExecutedCSS(this.getFileAt(index).filename);
      if (index === activeFileIndex) {
        state.files.splice(index, 1);
        onChange();
        persist();
        this.setCurrentIndex(0);
      } else {
        const currentFile = this.getCurrentFile();
        state.files.splice(index, 1);
        onChange();
        persist();
        this.setCurrentIndex(this.getFiles().findIndex(file => file === currentFile) || 0);
      }
    },
    listen(callback) {
      onChangeListeners.push(callback);
    },
    updateLayout(newLayout) {
      state.editor.layout = newLayout;
      onChange();
    },
    updateTheme(newTheme) {
      state.editor.theme = newTheme;
      onChange();
      persist();
    },
    updateStatusBarVisibility(value) {
      state.editor.statusBar = value;
    },
    setEntryPoint(index) {
      state.files = state.files.map((file, i) => {
        if (i === index) {
          file.entryPoint = !file.entryPoint;
        } else {
          delete file.entryPoint;
        }
        return file;
      });
    },
    pendingChanges(status) {
      if (typeof status !== 'undefined') {
        pendingChanges = status;
        onChange();
      }
      return pendingChanges;
    },
    dump() {
      return state;
    },
    // forking
    isForkable() {
      return this.loggedIn() && !!state.owner;
    },
    fork() {
      persist(true, onChange);
    },
    // profile methods
    loggedIn() {
      return profile !== null;
    },
    getProfile() {
      return profile;
    },
    getDemos() {
      return API.getDemos(profile.id);
    },
    // story
    story(history) {
      if (typeof history !== 'undefined') {
        state.story = history;
        onChange();
        persist();
        return;
      }
      return state.story;
    }
  }

  return api;
}