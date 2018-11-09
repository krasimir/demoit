import { addStyleString, getDemoAndSnippetIdx, el, basename } from './utils';
import { CODEMIRROR_SETTINGS } from './config';

const LOCAL_STORAGE_DEMOIT_CODE = 'demoit-code';
const isLocalStorageAvailable = typeof window.localStorage !== 'undefined';
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

export const createEditor = async function (settings, onSave, onChange) {
  const [ demoIdx, snippetIdx ] = getDemoAndSnippetIdx();
  const container = el('.js-code-editor');
  const restoreElement = el('.restore');
  const editor = CodeMirror(container, Object.assign({}, CODEMIRROR_SETTINGS, settings.editor));
  const save = () => {
    const code = editor.getValue();

    onSave(code);
    if (saveInLocalStorage(code)) {
      restoreElement.style.display = 'block';
    }
  }

  editor.on('change', () => onChange(editor.getValue()));
  editor.setOption("extraKeys", { 'Ctrl-S': save, 'Cmd-S': save });
  CodeMirror.normalizeKeyMap();
  container.addEventListener('click', () => editor.focus());
  isLocalStorageAvailable && restoreElement.addEventListener('click', () => {
    editor.setValue(loadFromLocalStorage());
    editor.focus();
  });
  
  if (settings.demos && settings.demos[demoIdx] && settings.demos[demoIdx].snippets && settings.demos[demoIdx].snippets[snippetIdx]) {
    const res = await fetch(settings.demos[demoIdx].snippets[snippetIdx]);
    const code = await res.text();

    editor.setValue(code);
    onSave(code);
  }

  editor.focus();

  if (!hasCodeInLocalStorage()) {
    restoreElement.style.display = 'none';
  }
};
export const loadEditorTheme = async function(settings) {
  try {
    const res = await fetch(`./vendor/codemirror/theme/${ settings.editor.theme }.css`);
    const css = await res.text();

    addStyleString(css);
  } catch (error) {
    console.log(error);
  }
}