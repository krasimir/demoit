import { getDemoAndSnippetIdx, basename, el } from './utils';

const isLocalStorageAvailable = typeof window.localStorage !== 'undefined';

const LOCAL_STORAGE_DEMOIT_CODE = 'demoit-code';
const saveInLocalStorage = code => {
  if (!isLocalStorageAvailable) return false;
  localStorage.setItem(LOCAL_STORAGE_DEMOIT_CODE, code);
  return true;
}
const loadFromLocalStorage = () => {
  if (!isLocalStorageAvailable) return;
  return localStorage.getItem(LOCAL_STORAGE_DEMOIT_CODE);
}
const hasCodeInLocalStorage = () => {
  if (!isLocalStorageAvailable) return;
  return localStorage.getItem(LOCAL_STORAGE_DEMOIT_CODE);
}
const getFilesLinkId = (demoIdx, snippetIdx) => {
  return `s_${ demoIdx + '-' + snippetIdx }`;
}
const getFilesLinkURL = (demoIdx, snippetIdx) => {
  return `javascript:window.location.hash='${ demoIdx },${ snippetIdx}';` +
  `window.location.reload();`;
}

export default function files(settings, ) {
  const navigation = el('.files .nav');
  const reset = el('.files .reset');
  const restore = el('.restore');
  const [ demoIdx, snippetIdx ] = getDemoAndSnippetIdx();
  const currentDemos = settings.demos;
  const isThereAnyDemos = currentDemos && currentDemos.length > 0;
  const currentSnippets = isThereAnyDemos ? settings.demos[demoIdx].snippets : [];
  var restoreFromLocalStorageCallback = () => {};

  isLocalStorageAvailable && reset.addEventListener('click', () => {
    localStorage.clear();
    window.location.reload();
  })
  isLocalStorageAvailable && restore.addEventListener('click', () => {
    restoreFromLocalStorageCallback(loadFromLocalStorage());
  });

  if (isThereAnyDemos) {
    navigation.innerHTML = [
      currentDemos.length > 1 ? '<ul class="demos">' + currentDemos.map((demo, idx) => {
        return `<li><a href="${ getFilesLinkURL(idx, 0) }" ${ demoIdx === idx ? 'class="active"' : '' }>${ idx + 1 }</a></li>`;
      }).join('') + '<li><span>&#8594;</span></li></ul>' : '',
      '<ul>' + currentSnippets.map((path, idx) => {
        return `<li><a href="${ getFilesLinkURL(demoIdx, idx) }" ${ snippetIdx === idx ? 'class="active"' : '' } id="${ getFilesLinkId(demoIdx, idx) }">${ basename(path) }</a></li>`;
      }).join('') + '</ul>'
    ].join('');
  }

  if (!hasCodeInLocalStorage()) {
    restore.style.display = 'none';
  }

  return {
    indicateFileEditing(editing) {
      if (!isThereAnyDemos) return;

      const snippet = document.querySelector('#' + getFilesLinkId(demoIdx, snippetIdx));

      if (
        snippet &&
        typeof settings.demos[demoIdx] !== 'undefined' &&
        typeof settings.demos[demoIdx].snippets[snippetIdx] !== 'undefined'
      ) {
        snippet.innerText = basename(settings.demos[demoIdx].snippets[snippetIdx]) + (editing ? ' *' : '');
      }
    },
    saveLatestChangeInLocalStorage(code) {
      if (saveInLocalStorage(code)) {
        restore.style.display = 'block';
      } else {
        restore.style.display = 'none';
      }
    },
    onRestoreFromLocalStorage(callback) {
      restoreFromLocalStorageCallback = callback;
    }
  }
}