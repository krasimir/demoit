/* eslint-disable no-use-before-define, no-undef */
import gitfred from 'gitfred';
import {
  getParam,
  readFromJSONFile,
  ensureDemoIdInPageURL,
  ensureUniqueFileName,
  jsEncode,
  clone
} from './utils';
import { IS_PROD, DEBUG } from './constants';
import { DEFAULT_LAYOUT } from './layout';
import API from './providers/api';
import LS from './utils/localStorage';

const git = gitfred();
const LS_PROFILE_KEY = 'DEMOIT_PROFILE';
const DEFAULT_STATE = {
  'editor': {
    'theme': 'light',
    'statusBar': true,
    'layout': DEFAULT_LAYOUT
  },
  'dependencies': [],
  'files': {
    'working': [
      [
        'code.js',
        {
          'c': `document.querySelector('#output').innerHTML = 'Hello world';

console.log('Hello world');`
        }
      ]
    ],
    'head': null,
    'i': 0,
    'stage': [],
    'commits': {}
  }
};

const getFirstFile = function () {
  const allFiles = git.getAll();

  if (allFiles.length === 0) {
    return 'untitled.js';
  }
  return git.getAll()[0][0];
};
const resolveActiveFile = function () {
  const hash = location.hash.replace(/^#/, '');

  if (hash !== '' && git.get(hash)) return hash;
  return getFirstFile();
};

export const FILE_CHANGED = 'FILE_CHANGED';

export default async function createState(version) {
  let onChangeListeners = [];
  const onChange = event => {
    DEBUG && console.log('state:onChange event=' + event);
    onChangeListeners.forEach(c => c(event));
  };
  let profile = LS(LS_PROFILE_KEY);

  var state = window.state;
  var initialState;

  if (!state) {
    const stateFromURL = getParam('state');

    if (stateFromURL) {
      try {
        state = await readFromJSONFile(stateFromURL);
      } catch (error) {
        console.error(`Error reading ${ stateFromURL }`);
      }
    } else {
      state = DEFAULT_STATE;
    }
  }

  state.v = version;
  initialState = clone(state);

  git.import(state.files);
  git.listen(event => {
    if (event === git.ON_COMMIT) {
      DEBUG && console.log('state:git:commit event=' + event);
      persist('git.listen');
      DEBUG && console.log('state:git:checkout event=' + event);
    } else if (event === git.ON_CHECKOUT) {
      api.setActiveFileByIndex(0);
      persist('git.listen');
    }
    onChange(event);
  });

  let activeFile = resolveActiveFile();

  const persist = (reason, fork = false, done = () => {}) => {
    DEBUG && console.log('state:persist reason=' + reason);
    if (api.isForkable()) {
      if (!fork && !api.isDemoOwner()) { return; }

      let diff = DeepDiff.diff(initialState, state);
      let stateData;

      initialState = clone(state);
      if (fork) {
        diff = '';
        delete state.owner;
        stateData = state;
      } else if (typeof diff === 'undefined' || !diff) {
        // no diff and no forking so doesn't make sense to call the API
        return;
      } else {
        diff = jsEncode(JSON.stringify(diff));
        stateData = { demoId: state.demoId, owner: state.owner };
      }
      API.saveDemo(stateData, profile.token, diff).then(demoId => {
        if (demoId && demoId !== state.demoId) {
          state.demoId = demoId;
          state.owner = profile.id;
          ensureDemoIdInPageURL(demoId);
        }
        done();
      });
    }
  };

  const api = {
    getDemoId() {
      return state.demoId;
    },
    getActiveFile() {
      return activeFile;
    },
    getActiveFileContent() {
      return git.get(activeFile).c;
    },
    setActiveFile(filename) {
      activeFile = filename;
      location.hash = filename;
      onChange('setActiveFile');
      return filename;
    },
    setActiveFileByIndex(index) {
      const filename = git.getAll()[index][0];

      if (filename) {
        this.setActiveFile(filename);
        onChange(FILE_CHANGED);
      }
    },
    isCurrentFile(filename) {
      return activeFile === filename;
    },
    isDemoOwner() {
      return state.owner && profile && state.owner === profile.id;
    },
    getFiles() {
      return git.getAll();
    },
    getNumOfFiles() {
      return git.getAll().length;
    },
    meta(meta) {
      if (meta) {
        const { name, description, published, storyWithCode } = meta;

        state.name = name;
        state.desc = description;
        state.published = !!published;
        state.storyWithCode = !!storyWithCode;
        onChange('meta');
        persist('meta');
        return null;
      }

      const m = {
        name: state.name,
        description: state.desc,
        published: !!state.published,
        storyWithCode: !!state.storyWithCode
      };

      if (state.demoId) m.id = state.demoId;

      return m;
    },
    getDependencies() {
      return state.dependencies;
    },
    setDependencies(dependencies) {
      state.dependencies = dependencies;
      persist('setDependencies');
    },
    getEditorSettings() {
      return state.editor;
    },
    editFile(filename, updates) {
      git.save(filename, updates);
      persist('editFile');
    },
    renameFile(filename, newName) {
      if (activeFile === filename) {
        this.setActiveFile(newName);
      }
      git.rename(filename, newName);
      persist('renameFile');
    },
    addNewFile(filename = 'untitled.js') {
      filename = git.get(filename) ? ensureUniqueFileName(filename) : filename;
      git.save(filename, { c: '' });
      this.setActiveFile(filename);
      persist('addNewFile');
    },
    deleteFile(filename) {
      git.del(filename);
      if (filename === activeFile) {
        this.setActiveFile(getFirstFile());
      }
      persist('deleteFile');
    },
    listen(callback) {
      onChangeListeners.push(callback);
    },
    removeListeners() {
      onChangeListeners = [];
    },
    updateThemeAndLayout(newLayout, newTheme) {
      if (newLayout) {
        state.editor.layout = newLayout;
      }
      if (newTheme) {
        state.editor.theme = newTheme;
      };
      persist('updateThemeAndLayout');
    },
    updateStatusBarVisibility(value) {
      if (state.editor.statusBar !== value) {
        state.editor.statusBar = value;
        persist('updateStatusBarVisibility');
      }
    },
    setEntryPoint(filename) {
      const newValue = !git.get(filename).en;

      git.saveAll({ en: false });
      git.save(filename, { en: newValue });
      persist();
    },
    dump() {
      return state;
    },
    // forking
    isForkable() {
      return IS_PROD && api.loggedIn();
    },
    fork() {
      persist('fork', true, () => onChange('fork'));
    },
    // profile methods
    loggedIn() {
      return profile !== null;
    },
    getProfile() {
      return profile;
    },
    getDemos() {
      return API.getDemos(profile.id, profile.token);
    },
    // misc
    version() {
      return state.v;
    },
    git() {
      return git;
    },
    export() {
      return state;
    },
    getStoryURL() {
      const meta = this.meta();
      let slug = 'story';

      if (meta && meta.name) {
        slug = meta.name.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');
      }
      return `/s/${ this.getDemoId() }/${ slug }`;
    }
  };

  window.__state = api;

  return api;
}
