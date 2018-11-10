import { basename, el } from './utils';
import { getDemoAndSnippetIdx, updateDemoAndSnippetIdx } from './storage';

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
  return `javascript:window.showSnippet(${ demoIdx },${ snippetIdx});`;
}

export default function files(settings) {
  const navigation = el('.files .nav');
  const reset = el('.files .reset');
  const restore = el('.restore');
  const currentDemos = settings.demos;
  const isThereAnyDemos = currentDemos && currentDemos.length > 0;
  var currentSnippets, demoIdx, snippetIdx;
  var restoreFromLocalStorageCallback = () => {};
  var showSnippetCallback = () => {};
  var newSnippetCallback = () => {};

  const init = () => {
    const idxs = getDemoAndSnippetIdx();

    demoIdx = idxs[0];
    snippetIdx = idxs[1];
    currentSnippets = isThereAnyDemos ? settings.demos[demoIdx].snippets : [];

    if (isThereAnyDemos) {
      navigation.innerHTML = [
        currentDemos.length > 1 ? '<ul class="demos">' + currentDemos.map((demo, idx) => {
          return `<li><a href="${ getFilesLinkURL(idx, 0) }" ${ demoIdx === idx ? 'class="active"' : '' }>${ idx + 1 }</a></li>`;
        }).join('') + '<li><span>&#8594;</span></li></ul>' : '',
        '<ul>' + currentSnippets.map((path, idx) => {
          return `<li><a href="${ getFilesLinkURL(demoIdx, idx) }" ${ snippetIdx === idx ? 'class="active"' : '' } id="${ getFilesLinkId(demoIdx, idx) }">${ basename(path) }</a></li>`;
        }).join('') + '</ul>',
        '<ul class="with-icons"><li><a href="javascript:window.newSnippet()"><svg width="24" height="24" viewBox="0 0 1792 1792" xmlns="http://www.w3.org/2000/svg"><path d="M1600 736v192q0 40-28 68t-68 28h-416v416q0 40-28 68t-68 28h-192q-40 0-68-28t-28-68v-416h-416q-40 0-68-28t-28-68v-192q0-40 28-68t68-28h416v-416q0-40 28-68t68-28h192q40 0 68 28t28 68v416h416q40 0 68 28t28 68z"/></svg></a></li></ul>'
      ].join('');
    }
  }

  isLocalStorageAvailable && reset.addEventListener('click', () => {
    localStorage.clear();
    window.location.reload();
  })
  isLocalStorageAvailable && restore.addEventListener('click', () => {
    restoreFromLocalStorageCallback(loadFromLocalStorage());
  });

  init();

  if (!hasCodeInLocalStorage()) {
    restore.style.display = 'none';
  }

  window.showSnippet = (demoIdx, snippetIdx) => {
    updateDemoAndSnippetIdx(demoIdx, snippetIdx);
    showSnippetCallback();
  }
  window.newSnippet = () => {
    newSnippetCallback();
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
    },
    onShowSnippet(callback) {
      showSnippetCallback = callback;
    },
    onNewSnippet(callback) {
      newSnippetCallback = callback;
    },
    initNavigation: init
  }
}