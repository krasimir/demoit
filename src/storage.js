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

export default async function createStorage() {
  const api = {
    activeFileIndex: 0,
    settings: DEFAULT_SETTINGS,
    getFiles() {
      return this.settings.files;
    },
    getCurrentFile() {
      return this.getFiles()[this.activeFileIndex];
    },
    getFileAt(index) {
      return this.getFiles()[index];
    },
    makeSureOneFileAtLeast() {
      if (this.getFiles().length === 0) {
        this.settings.files.push(EMPTY_FILE);
        this.activeFileIndex = 0;
      }
    },
    editFile(index, updates) {
      this.settings.files[index] = {
        ...this.settings.files[index],
        ...updates
      };
      // console.log(JSON.stringify(this.settings.files, null, 2));
    },
    editCurrentFile(updates) {
      this.editFile(this.activeFileIndex, updates);
    },
    changeActiveFile(index) {
      this.activeFileIndex = index;
      return this.getCurrentFile();
    },
    addNewFile() {
      this.settings.files.push(EMPTY_FILE);
      return this.changeActiveFile(this.settings.files.length - 1);
    },
    deleteFile(index) {
      console.log('delete file');
    }
  }

  if (window['SETTINGS']) {
    api.settings = window['SETTINGS'];
  }

  api.makeSureOneFileAtLeast();

  return api;
}


/********************************** */
const CACHE = {};

const getCacheKey = (demoIdx, snippetIdx) => demoIdx + '_' + snippetIdx;

export const getDemoAndSnippetIdx = function () {
  const hash = window.location.hash;

  if (hash && hash.split(',').length === 2) {
    return hash.split(',')
      .map(value => value.replace('#', ''))
      .map(Number);
  }
  return [0, 0];
}
export const updateDemoAndSnippetIdx = function (demoIdx, snippetIdx) {
  window.location.hash = demoIdx + ',' + snippetIdx;
}
export const getCurrentFileContent = async function (settings) {
  const [ demoIdx, snippetIdx ] = getDemoAndSnippetIdx();

  if (settings.demos && settings.demos[demoIdx] && settings.demos[demoIdx].snippets && settings.demos[demoIdx].snippets[snippetIdx]) {
    const res = await fetch(settings.demos[demoIdx].snippets[snippetIdx]);
    return await res.text();    
  }
}
export const getSnippet = async function (settings) {
  const [ demoIdx, snippetIdx ] = getDemoAndSnippetIdx();
  const cacheKey = getCacheKey(demoIdx, snippetIdx);

  if (CACHE.hasOwnProperty(cacheKey)) return CACHE[cacheKey];

  if (settings.demos && settings.demos[demoIdx] && settings.demos[demoIdx].snippets && settings.demos[demoIdx].snippets[snippetIdx]) {
    const res = await fetch(settings.demos[demoIdx].snippets[snippetIdx]);
    return CACHE[cacheKey] = await res.text();    
  }
}
export const newSnippet = function (settings) {
  const [ demoIdx ] = getDemoAndSnippetIdx();

  if (!settings.demos) {
    settings.demos = [];
  }
  if (!settings.demos[demoIdx].snippets) {
    settings.demos[demoIdx].snippets = [];
  }

  const index = settings.demos[demoIdx].snippets.length;

  settings.demos[demoIdx].snippets.push(`code${ index }.js`);
  CACHE[getCacheKey(demoIdx, index)] = '';
  updateDemoAndSnippetIdx(demoIdx, index);

  return [ demoIdx, index ];
}
export const updateSnippetCache = function (code) {
  const [ demoIdx, snippetIdx ] = getDemoAndSnippetIdx();

  CACHE[getCacheKey(demoIdx, snippetIdx)] = code;
}