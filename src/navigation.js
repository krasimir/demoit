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

export default function navigation(storage, showFile, newFile, editFile) {
  const navigation = el('.files .nav');
  const reset = el('.files .reset');
  const restore = el('.restore');
  
  const render = () => {
    const items  = [];

    // current files
    items.push('<ul>');
    storage.getFiles().forEach(({ filename, editing }, idx) => {
      items.push(
        `<li><a href="javascript:window.showFile(${ idx });" ${ storage.activeFileIndex === idx ? 'class="active"' : '' }" oncontextmenu="javascript:window.editFile(${ idx });return false;">${ filename }${ editing ? ' *' : ''}</a></li>`
      );
    });
    items.push('</ul>');

    // icons
    items.push(
      '<ul class="with-icons"><li><a href="javascript:window.newFile()"><svg width="24" height="24" viewBox="0 0 1792 1792" xmlns="http://www.w3.org/2000/svg"><path d="M1600 736v192q0 40-28 68t-68 28h-416v416q0 40-28 68t-68 28h-192q-40 0-68-28t-28-68v-416h-416q-40 0-68-28t-28-68v-192q0-40 28-68t68-28h416v-416q0-40 28-68t68-28h192q40 0 68 28t28 68v416h416q40 0 68 28t28 68z"/></svg></a></li></ul>'
    );

    navigation.innerHTML = items.join('');
  }

  render();

  window.showFile = index => showFile(index);
  window.editFile = index => editFile(index);
  window.newFile = () => newFile();
  
  
  /*
  const currentDemos = settings.demos;
  const isThereAnyDemos = currentDemos && currentDemos.length > 0;
  var currentSnippets, demoIdx, snippetIdx;

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
  */

  /*
  if (!hasCodeInLocalStorage()) {
    restore.style.display = 'none';
  }
  */

  return render;
}