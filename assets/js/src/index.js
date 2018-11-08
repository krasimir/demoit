import {
  setSplitting,
  getSettings,
  getResources
} from './utils';
import { loadEditorTheme, createEditor } from './editor';
import { createOutput } from './output';
import { createSettingsPanel } from './settingsPanel';

window.onload = async function () {
  setSplitting();

  const settings = await getSettings();

  await getResources(settings);
  await loadEditorTheme(settings);

  const outputElement = createOutput(settings);
  const editor = createEditor(settings, outputElement);
  const settingsPanel = createSettingsPanel(settings, editor);

  await editor.showFrame();
};