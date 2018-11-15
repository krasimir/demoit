import { isLocalStorageAvailable } from '../utils';
import { LS_KEY, DEFAULT_SETTINGS } from '../storage';

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

export default function home({ storage, changePage }) {
  return {
    isGrid: true,
    name: 'home',
    async didMount({ el }) {
      const newProject = el('.new-project');
      const restoreFromLocalStorage = el('.home-local-storage');
      const localJSON = el('.local-json');
      const localStorageData = readFromLocalStorage();

      if (localStorageData) {
        restoreFromLocalStorage.find('p').content(formatFiles(localStorageData.files));
        restoreFromLocalStorage.onClick(() => {
          storage.updateSettings(localStorageData);
          changePage('dependencies');
        });
      } else {
        restoreFromLocalStorage.find('p').content('<small class="centered">There\'s nothing saved in the local storage.</small>');
      }

      const localJSONData = await readFromLocalJSONFile();

      if (localJSONData) {
        localJSON.find('p').content(formatFiles(localJSONData.files));
        localJSON.onClick(() => {
          storage.updateSettings(localJSONData);
          changePage('dependencies');
        });
      } else {
        localJSON.find('p').content('<small class="centered">There\'s no settings.json file available.</small>');
      }

      newProject.onClick(() => {
        storage.updateSettings(DEFAULT_SETTINGS);
        changePage('dependencies');
      });
    }
  }
}