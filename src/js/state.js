import gitfred from 'gitfred';
import {
  getParam,
  readFromJSONFile,
  ensureDemoIdInPageURL,
  ensureUniqueFileName
} from './utils';
import { IS_PROD } from './constants';
import { cleanUpExecutedCSS } from './utils/executeCSS';
import { DEFAULT_LAYOUT } from './layout';
import API from './providers/api';
import LS from './utils/localStorage';

const git = gitfred();
const LS_PROFILE_KEY = 'DEMOIT_PROFILE';
const DEFAULT_STATE = {
  name: '',
  editor: {
    theme: 'light',
    statusBar: false,
    layout: DEFAULT_LAYOUT
  },
  dependencies: [],
  files: {},
  story: []
};

const getFirstFile = function () {
  const working = git.working();

  for (let filepath in working) {
    return { filepath, file: working[filepath] };
  }
}
const resolveActiveFile = function () {
  const hash = location.hash.replace(/^#/, '');
  const working = git.working();

  if (hash !== '' && working[hash]) return working[hash];
  return getFirstFile().file;
}
const exists = function (filename) {
  return Object.keys(git.working()).indexOf(filename) >= 0;
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

  git.import(state.files);
  git.listen(() => onChangeListeners.forEach(c => c()));

  var activeFile = resolveActiveFile(state.files);

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
    getCurrentFile() {
      return activeFile;
    },
    setCurrentFile(filename) {
      activeFile = git.working()[filename];
      if (!activeFile) {
        const { file, filepath } = getFirstFile();
        activeFile = file;
        filename = filepath;
      }
      location.hash = filename;
      return activeFile;
    },
    isCurrentFile(file) {
      return activeFile === file;
    },
    getFiles() {
      return git.working();
    },
    getNumOfFiles() {
      return Object.keys(this.getFiles()).length;
    },
    name(value) {
      if (typeof value !== 'undefined') {
        state.name = value;
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
      persist();
    },
    getEditorSettings() {
      return state.editor;
    },
    getFileAt(index) {
      return this.getFiles()[index];
    },
    editFile(filename, updates) {
      git.save({ filepath: filename, ...updates });
      persist();
    },
    renameFile(oldName, newName) {
      git.rename(oldName, newName);
      persist();
    },
    addNewFile(filename = 'untitled.js') {
      filename = exists(filename) ? ensureUniqueFileName(filename) : filename;
      git.save({ filepath: filename, c: '' });
      this.setCurrentFile(filename);
      persist();
    },
    deleteFile(filename) {
      cleanUpExecutedCSS(this.getFileAt(index).filename);
      if (filename === activeFile) {
        this.setCurrentFile(getFirstFile().filepath);
      }
      git.del({ filepath: filename });
      persist();
    },
    listen(callback) {
      onChangeListeners.push(callback);
    },
    updateLayout(newLayout) {
      state.editor.layout = newLayout;
    },
    updateTheme(newTheme) {
      state.editor.theme = newTheme;
      persist();
    },
    updateStatusBarVisibility(value) {
      state.editor.statusBar = value;
    },
    setEntryPoint(filename) {
      Object.keys(git.working()).forEach(f => git.save({ filepath: f, ed: f === filename }));
    },
    pendingChanges(status) {
      if (typeof status !== 'undefined') {
        pendingChanges = status;
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
    }
  }

  return api;
}