import createPopup from './popup';
import { CHECK_ICON } from '../../utils/icons';

const ENTER_KEY = 13;

export default function settingsPopUp(storageContent, flushStorage, dependenciesStr, onDepsUpdated) {
  return new Promise(done => createPopup({
    buttons: [
      'Storage',
      'Dependencies',
      'About'
    ],
    content: [
      `
        <p>At the moment Demoit uses <a href="https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage" target="_blank">localStorage API</a> to save your progress.</p>
        <hr />
        <h2>Transfer your work</h2>
        <p>Download <a href="https://github.com/krasimir/demoit/raw/master/demoit.zip">Demoit.zip</a>. Unzip. Get the JSON below and save it in a <i>mycode.json</i> file. Then open Demoit with<br />"?state=mycode.json". It will automatically pick the data from the json.</p>
        <textarea class="state-json" data-export="storageTextarea"></textarea>
        <hr />
        <button class="clear-storage secondary" data-export="flushStorageButton"><svg width="24" height="24" viewBox="0 0 1792 1792" xmlns="http://www.w3.org/2000/svg"><path d="M704 1376v-704q0-14-9-23t-23-9h-64q-14 0-23 9t-9 23v704q0 14 9 23t23 9h64q14 0 23-9t9-23zm256 0v-704q0-14-9-23t-23-9h-64q-14 0-23 9t-9 23v704q0 14 9 23t23 9h64q14 0 23-9t9-23zm256 0v-704q0-14-9-23t-23-9h-64q-14 0-23 9t-9 23v704q0 14 9 23t23 9h64q14 0 23-9t9-23zm-544-992h448l-48-117q-7-9-17-11h-317q-10 2-17 11zm928 32v64q0 14-9 23t-23 9h-96v948q0 83-47 143.5t-113 60.5h-832q-66 0-113-58.5t-47-141.5v-952h-96q-14 0-23-9t-9-23v-64q0-14 9-23t23-9h309l70-167q15-37 54-63t79-26h320q40 0 79 26t54 63l70 167h309q14 0 23 9t9 23z"/></svg><span>Clean up localStorage</span></button>
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
    onRender({ closePopup, storageTextarea, flushStorageButton, dependenciesTextarea, saveDependenciesButton }) {
      // managing storage
      if (storageTextarea && flushStorageButton) {
        storageTextarea.prop('value', storageContent);
        flushStorageButton.onClick(flushStorage);
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