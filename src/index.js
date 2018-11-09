import { getResources, getSettings, cleanOutput } from './utils';
import { loadEditorTheme, createEditor } from './editor';
import { createSettingsPanel } from './settingsPanel';
import transpile from './transpile';
import createConsolePanel from './console';
import screenSplit from './screenSplit';
import files from './files';

window.onload = async function () {
  screenSplit();
  
  const settings = await getSettings();
  const consolePanel = createConsolePanel(settings);
  const { indicateFileEditing } = files(settings);
  
  await getResources(settings);
  await loadEditorTheme(settings);
  createSettingsPanel(settings);
  createEditor(
    settings,
    code => {
      consolePanel.clear();
      indicateFileEditing(false);
      try {
        (new Function(transpile(code)))();
      } catch (error) {
        console.error(error);
      }
    },
    () => {
      indicateFileEditing(true);
    }
  );
};