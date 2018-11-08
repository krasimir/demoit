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

window.onload = async function () {
  setSplitting();

  const settings = await getSettings();
  const demo = await getDemo(settings);

  await getResources(settings);
  await loadEditorTheme(settings);
  setOutputStyles(settings);
  createSettingsPanel(settings);
  createEditor(settings, code => {
    try {
      (new Function(transpile(code)))();
    } catch (error) {
      console.error('Ops, error', error);
    }
  });
};