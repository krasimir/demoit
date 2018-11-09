import {
  setSplitting,
  getResources,
  getSettings,
  getDemo
} from './utils';
import { loadEditorTheme, createEditor } from './editor';
import { setOutputStyles } from './output';
import { createSettingsPanel } from './settingsPanel';
import transpile from './transpile';
import logger from './logger';

window.onload = async function () {
  logger();
  setSplitting();

  const settings = await getSettings();

  await getDemo(settings);
  await getResources(settings);
  await loadEditorTheme(settings);
  setOutputStyles(settings);
  createSettingsPanel(settings);
  createEditor(settings, code => {
    try {
      (new Function(transpile(code)))();
    } catch (error) {
      console.error(error);
    }
  });
};