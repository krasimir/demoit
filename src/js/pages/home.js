import { ICON_ERROR, FILE_ICON, STORAGE_ICON, isLocalStorageAvailable, getParam } from '../utils';
import { LS_KEY, DEFAULT_STATE } from '../storage';

const EMPTY_PROJECT_COLUMN = {
  cls: 'as-button newProject',
  title: 'Start a new project',
  text: 'A blank file. No dependencies.',
  icon: '<svg width="48" height="48" viewBox="0 0 1792 1792"><path d="M1600 736v192q0 40-28 68t-68 28h-416v416q0 40-28 68t-68 28h-192q-40 0-68-28t-28-68v-416h-416q-40 0-68-28t-28-68v-192q0-40 28-68t68-28h416v-416q0-40 28-68t68-28h192q40 0 68 28t28 68v416h416q40 0 68 28t28 68z"/></svg>'
};
const CODE_SAMPLE_ERROR_LOADING = file => ({
  title: 'Ops!',
  icon: ICON_ERROR,
  text: `${ file } can not be loaded or it contains broken JSON.`
});
const CODE_SAMPLE_LOADING_COLUMN = file => ({
  title: 'Code samples',
  icon: FILE_ICON,
  text: `Loading ${ file } file ...`,
  cls: 'notClickable'
});
const CODE_SAMPLES_LIST_FILES_COLUMN = files => ({
  title: 'Code samples',
  icon: FILE_ICON,
  text: files.map(file => `
    <a href="javascript:void(0);" data-export="jsonFile" data-file="${ file }">${ file.split(/\//).pop() }</a>
  `).join(''),
  cls: 'notClickable'
});
const LOCAL_STORAGE_COLUMN = files => ({
  cls: 'as-button restoreFromLocalStorage',
  title: 'Your latest changes',
  icon: STORAGE_ICON,
  text: files.join('<br />')
});

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
const readFromJSONFile = async function (file) {
  const res = await fetch(file);
  return await res.json();
}
const resolveStateGetParam = function () {
  const s = getParam('state');

  if (s !== null) {
    return s.split(',');
  }
  return null;
}

const renderColumns = function (columns, pageDOMElement) {
  const c = [{}, ...columns, EMPTY_PROJECT_COLUMN, {}].filter(column => column !== null);
  const handlers = pageDOMElement.content(
    c.map(
      ({ title, text, icon, cls }) => title ? `
        <div class="${ cls ? cls : 'as-button' }">
          ${ icon }
          <h2>${ title }</h2>
          <hr />
          <p>${ text }</p>
        </div>
      `:
      '<div></div>'
    ).join('')
  );
  pageDOMElement.css('grid-template-columns', c.map(({ title }) => (title ? '250px' : '1fr')).join(' '));

  return handlers;
}

export default function home({ storage, changePage }) {
  return {
    isGrid: true,
    name: 'home',
    async didMount({ el, pageDOMElement }) {
      const stateFiles = resolveStateGetParam();
      const localStorageData = readFromLocalStorage();
      let codeSamplesColumn = null;
      let localStorageColumn = null;

      if (stateFiles) {
        codeSamplesColumn = CODE_SAMPLES_LIST_FILES_COLUMN(stateFiles);
      }
      

      if (localStorageData) {
        localStorageColumn = LOCAL_STORAGE_COLUMN(localStorageData.files.map(({ filename }) => filename));
      }

      const elements = renderColumns([ codeSamplesColumn, localStorageColumn ], pageDOMElement);

      elements
        .filter(e => e.attr('data-file'))
        .forEach(e => {
          e.onClick(async () => {
            const file = e.attr('data-file');

            renderColumns([ CODE_SAMPLE_LOADING_COLUMN(file), localStorageColumn ], pageDOMElement);
            try {
              storage.setState(await readFromJSONFile(file));
              changePage('dependencies');
            } catch(error) {
              renderColumns([ CODE_SAMPLE_ERROR_LOADING(file), localStorageColumn ], pageDOMElement);
            }
          });
        })

      el('.newProject').onClick(() => {
        storage.setState(DEFAULT_STATE);
        changePage('dependencies');
      });
      localStorageData && el('.restoreFromLocalStorage').onClick(() => {
        storage.setState(localStorageData);
        changePage('dependencies');
      });
    }
  }
}