import createPopup from './popup';
import { TRASH_ICON, STORAGE_ICON } from '../utils/icons';

const ENTER_KEY = 13;

export default function settingsPopUp(storageContent, { layout, theme }, dependenciesStr, onDepsUpdated, onLayoutUpdate, onThemeUpdate) {
  return new Promise(done => createPopup({
    buttons: [
      'General',
      'Export',
      'Dependencies',
      'About'
    ],
    content: [
      `
      <p>Layout:</p>
      <select data-export="layoutPicker">
        <option value="default">default (HTML/console | editor)</option>
        <option value="layoutLeft">editor | HTML/console</option>
        <option value="layoutTop">HTML|console / editor</option>
        <option value="layoutBottom">editor / HTML|console</option>
        <option value="layoutEC">editor | console</option>
        <option value="layoutEO">editor | HTML</option>
        <option value="layoutECBottom">editor / console</option>
        <option value="layoutEOBottom">editor / HTML</option>
        <option value="layoutO">only HTML</option>
        <option value="layoutE">only editor</option>
      </select>
      <p class="mt1">Theme:</p>
      <select data-export="themePicker">
        <option value="light">light</option>
        <option value="dark">dark</option>
      </select>
      `,
      `
        <h2>Export</h2>
        <p>Download <a href="https://github.com/krasimir/demoit/raw/master/demoit.zip">Demoit.zip</a>. Unzip. Get the JSON below and save it in a <i>mycode.json</i> file. Then open Demoit with<br />"?state=mycode.json". It will automatically pick the data from the json.</p>
        <textarea class="state-json" data-export="storageTextarea"></textarea>
      `,
      `
        <textarea class="dependencies-list" data-export="dependenciesTextarea"></textarea>
        <p><small>(Separate your dependencies by a new line)</small></p>
        <button class="save" data-export="saveDependenciesButton">Save</button>
      `,
      `
        <p>
          Author: <a href="https://twitter.com/krasimirtsonev" target="_blank">Krasimir Tsonev</a><br />
          GitHub repo: <a href="https://github.com/krasimir/demoit" target="_blank">github.com/krasimir/demoit</a>
        </p>
      `
    ],
    cleanUp() {
      done();
    },
    onRender({
      closePopup,
      storageTextarea,
      dependenciesTextarea,
      saveDependenciesButton,
      layoutPicker,
      themePicker
    }) {
      // general settings
      if (layoutPicker && themePicker) {
        layoutPicker.onChange(newLayout => {
          onLayoutUpdate(newLayout);
          closePopup();
        });
        layoutPicker.e.value = layout.name || 'default';
        themePicker.onChange(newTheme => {
          onThemeUpdate(newTheme);
          closePopup();
        });
        themePicker.e.value = theme || 'light';
      }
      // managing storage
      if (storageTextarea) {
        storageTextarea.prop('value', storageContent);
      }
      // managing dependencies
      if (dependenciesTextarea && saveDependenciesButton) {
        const save = () => {
          onDepsUpdated(dependenciesTextarea.prop('value').split(/\r?\n/));
          closePopup();
        }
        
        dependenciesTextarea.prop('value', dependenciesStr);
        dependenciesTextarea.onKeyUp(e => {
          if (e.keyCode === ENTER_KEY) {
            save();
          }
        });
        saveDependenciesButton.onClick(save);
      }
    }
  }));
}