import Layout from 'layout-architect';
import createPopup from './popup';
import { LAYOUT_BLOCKS } from '../layout';

const generateIframe = url => `<iframe src="${ url }" style="display: block; width:100%; height: 400px; border:0; overflow:hidden;" sandbox="allow-modals allow-forms allow-popups allow-scripts allow-same-origin allow-top-navigation-by-user-activation"></iframe>`;

export default function settingsPopUp(storageContent, { layout, theme }, dependenciesStr, onDepsUpdated, onGeneralUpdate) {
  return new Promise(done => createPopup({
    buttons: [
      'General',
      'Dependencies',
      'Export/Share',
      'About'
    ],
    content: [
      `
        <p>
          Theme:
          <select data-export="themePicker">
            <option value="light">light</option>
            <option value="dark">dark</option>
          </select>
        </p>
        <p class="mt1">Layout:</p>
        <div class="mb1" data-export="layoutArchitectContainer"></div>
        <button class="save" data-export="saveGeneral">Save</button>
      `,
      `
        <textarea class="dependencies-list" data-export="dependenciesTextarea"></textarea>
        <p><small>(Separate your dependencies by a new line)</small></p>
        <button class="save" data-export="saveDependenciesButton">Save</button>
      `,
      `
        <h2>Embed</h2>
        <textarea data-export="iframeTextarea">${ generateIframe(window.location.href) }</textarea>
        <h2>Working offline</h2>
        <p>Download <a href="https://github.com/krasimir/demoit/raw/master/demoit.zip">Demoit.zip</a>. Unzip. Get the JSON below and save it in a <i>mycode.json</i> file. Then open Demoit with "?state=mycode.json". It will automatically pick the data from the json.</p>
        <textarea data-export="stateTextarea"></textarea>
      `,
      `
        <p>
          On the web: <a href="https://demoit.app" target="_blank">demoit.app</a><br />
          GitHub repo: <a href="https://github.com/krasimir/demoit" target="_blank">github.com/krasimir/demoit</a>
        </p>
      `
    ],
    cleanUp() {
      done();
    },
    onRender({
      closePopup,
      saveGeneral,
      stateTextarea,
      dependenciesTextarea,
      saveDependenciesButton,
      themePicker,
      iframeTextarea,
      layoutArchitectContainer
    }) {
      // general settings
      if (layoutArchitectContainer && themePicker) {
        const la = Layout(layoutArchitectContainer.e, LAYOUT_BLOCKS, layout);
        themePicker.e.value = theme || 'light';
        saveGeneral.onClick(() => {
          onGeneralUpdate(themePicker.e.value, la.get());
          closePopup();
        });
      }
      // share
      if (stateTextarea) {
        stateTextarea.prop('value', storageContent);
        stateTextarea.selectOnClick();
      }
      if (iframeTextarea) {
        iframeTextarea.selectOnClick();
      }
      // managing dependencies
      if (dependenciesTextarea && saveDependenciesButton) {        
        dependenciesTextarea.prop('value', dependenciesStr);
        saveDependenciesButton.onClick(() => {
          onDepsUpdated(dependenciesTextarea.prop('value').split(/\r?\n/));
          closePopup();
        });
      }
    }
  }));
}