import createPopup from './popup';
import { TRASH_ICON, STORAGE_ICON } from '../utils/icons';

const ENTER_KEY = 13;

export default function settingsPopUp(storageContent, restoreFromStorage, flushStorage, dependenciesStr, onDepsUpdated, onLayoutUpdate) {
  return new Promise(done => createPopup({
    buttons: [
      'General',
      'Local Storage',
      'Dependencies',
      'About'
    ],
    content: [
      `
      <h2>Layout</h2>
      <div class="layout">
        <a href="javascript:void(0);" data-export="layoutDefault"><img src="./img/layout_default.png" /></a>
        <a href="javascript:void(0);" data-export="layoutLeft"><img src="./img/layout_left.png" /></a>
        <a href="javascript:void(0);" data-export="layoutTop"><img src="./img/layout_top.png" /></a>
        <a href="javascript:void(0);" data-export="layoutBottom"><img src="./img/layout_bottom.png" /></a>
        <a href="javascript:void(0);" data-export="layoutEC"><img src="./img/layout_ec.png" /></a>
        <a href="javascript:void(0);" data-export="layoutEO"><img src="./img/layout_eo.png" /></a>
        <a href="javascript:void(0);" data-export="layoutECBottom"><img src="./img/layout_ecbottom.png" /></a>
        <a href="javascript:void(0);" data-export="layoutEOBottom"><img src="./img/layout_eobottom.png" /></a>
        <a href="javascript:void(0);" data-export="layoutE"><img src="./img/layout_e.png" /></a>
        <a href="javascript:void(0);" data-export="layoutO"><img src="./img/layout_o.png" /></a>
      </div>
      `,
      `
        <h2>Transfer your work</h2>
        <p>Download <a href="https://github.com/krasimir/demoit/raw/master/demoit.zip">Demoit.zip</a>. Unzip. Get the JSON below and save it in a <i>mycode.json</i> file. Then open Demoit with<br />"?state=mycode.json". It will automatically pick the data from the json.</p>
        <textarea class="state-json" data-export="storageTextarea"></textarea>
        <hr />
        <button class="clear-storage secondary" data-export="flushStorageButton">
          ${ TRASH_ICON }<span>Clean up localStorage</span>
        </button>
        <button class="clear-storage secondary right" data-export="restoreStorageButton">
          ${ STORAGE_ICON }<span>Restore from localStorage</span>
        </button>
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
      flushStorageButton,
      restoreStorageButton,
      dependenciesTextarea,
      saveDependenciesButton,
      layoutDefault,
      layoutLeft,
      layoutTop,
      layoutBottom,
      layoutEC,
      layoutEO,
      layoutE,
      layoutO,
      layoutEOBottom,
      layoutECBottom
    }) {
      // general settings
      if (layoutDefault) {
        const switchLayout = name => () => {
          onLayoutUpdate(name);
          closePopup();
        }
        layoutDefault.onClick(switchLayout('default'));
        layoutLeft.onClick(switchLayout('layoutLeft'));
        layoutTop.onClick(switchLayout('layoutTop'));
        layoutBottom.onClick(switchLayout('layoutBottom'));
        layoutEC.onClick(switchLayout('layoutEC'));
        layoutEO.onClick(switchLayout('layoutEO'));
        layoutE.onClick(switchLayout('layoutE'));
        layoutO.onClick(switchLayout('layoutO'));
        layoutECBottom.onClick(switchLayout('layoutECBottom'));
        layoutEOBottom.onClick(switchLayout('layoutEOBottom'));
      }
      // managing storage
      if (storageTextarea && flushStorageButton && restoreStorageButton) {
        storageTextarea.prop('value', storageContent);
        flushStorageButton.onClick(flushStorage);
        restoreStorageButton.onClick(() => {
          restoreFromStorage();
          closePopup();
        });
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