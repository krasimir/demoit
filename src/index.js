import {
  getResources,
  getSettings,
  getDemo
} from './utils';
import { loadEditorTheme, createEditor } from './editor';
import { createSettingsPanel } from './settingsPanel';
import transpile from './transpile';
import createConsolePanel from './console';
import screenSplit from './screenSplit';

window.onload = async function () {
  screenSplit();
  
  const settings = await getSettings();
  const consolePanel = createConsolePanel(settings);
  
  await getDemo(settings);
  await getResources(settings);
  await loadEditorTheme(settings);
  createSettingsPanel(settings);
  createEditor(settings, code => {
    consolePanel.clear();
    try {
      (new Function(transpile(code)))();
    } catch (error) {
      console.error(error);
    }
  });
};