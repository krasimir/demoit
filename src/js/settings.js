import { el, isLocalStorageAvailable } from './utils';
import { LS_KEY } from './storage';

const DEFAULT_SETTINGS = {
  editor: { theme: 'material' },
  dependencies: [],
  files: []
};

const readFromLocalStorage = function () {
  if (isLocalStorageAvailable()) {
    const settings = localStorage.getItem(LS_KEY);
    try {
      if (settings) return JSON.parse(settings);
    } catch(error) {
      console.error(`There is some data in the local storage under the ${ LS_KEY } key. However, it is not a valid JSON.`);
    }
  }
  return null;
}
const readFromLocalJSONFile = async function () {
  try {
    const res = await fetch('./settings.json');
    return await res.json();
  } catch(error) {}
  return null;
}
const formatFiles = files => files.map(({ filename }) => ('&#10035; ' + filename)).join('<br />')

export default async function resolveSettings() {
  const container = el('.home');
  const newProject = el('.new-project');
  const restoreFromLocalStorage = el('.home-local-storage');
  const localJSON = el('.local-json');

  return new Promise(async (done) => {
    const localStorageData = readFromLocalStorage();
    if (localStorageData) {
      restoreFromLocalStorage.find('p').content(formatFiles(localStorageData.files));
      restoreFromLocalStorage.onClick(() => {
        done(localStorageData);
        container.hide();
      });
    } else {
      restoreFromLocalStorage.find('p').content('<small class="centered">There\'s nothing saved in the local storage.</small>');
    }

    const localJSONData = await readFromLocalJSONFile();
    if (localJSONData) {
      localJSON.find('p').content(formatFiles(localJSONData.files));
      localJSON.onClick(() => {
        done(localJSONData);
        container.hide();
      });
    } else {
      localJSON.find('p').content('<small class="centered">There\'s no settings.json file available.</small>');
    }

    newProject.onClick(() => {
      done(DEFAULT_SETTINGS);
      container.hide();
    });
  });
}