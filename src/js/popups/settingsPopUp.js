import createPopup from './popup';
import { EDITOR, READ_ONLY, PREVIEW } from '../mode';

const ENTER_KEY = 13;
const generateIframe = url => `<iframe src="${ url }" style="display: block; width:100%; height: 400px; border:0; overflow:hidden;" sandbox="allow-modals allow-forms allow-popups allow-scripts allow-same-origin"></iframe>`;

export default function settingsPopUp(storageContent, { layout, theme }, dependenciesStr, onDepsUpdated, onLayoutUpdate, onThemeUpdate) {
  return new Promise(done => createPopup({
    buttons: [
      'General',
      'Dependencies',
      'Export/Share',
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
        <textarea class="dependencies-list" data-export="dependenciesTextarea"></textarea>
        <p><small>(Separate your dependencies by a new line)</small></p>
        <button class="save" data-export="saveDependenciesButton">Save</button>
      `,
      `
        <h2>Embed</h2>
        <p>
          <select data-export="modePicker">
            <option value="${ EDITOR }">Editable (403KB page size + dependencies)</option>
            <option value="${ READ_ONLY }">Read only (18KB page size + dependencies)</option>
            <option value="${ PREVIEW }">Code preview (18KB page size)</option>
          </select>
        </p>
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
      stateTextarea,
      dependenciesTextarea,
      saveDependenciesButton,
      layoutPicker,
      themePicker,
      iframeTextarea,
      modePicker
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
      // share
      if (stateTextarea) {
        stateTextarea.prop('value', storageContent);
        stateTextarea.selectOnClick();
      }
      if (iframeTextarea) {
        iframeTextarea.selectOnClick();
      }
      if (modePicker) {
        modePicker.onChange(newMode => {
          if (newMode === EDITOR) {
            iframeTextarea.prop('value', generateIframe(window.location.href));
          } else {
            const [ url, hash ] = window.location.href.split('#');
            const [ onlyURL, params ] = url.split('?');
            const newParams = params ? `mode=${ newMode }&${ params }` : `mode=${ newMode }`;

            iframeTextarea.prop('value', generateIframe([
              onlyURL, '?', newParams, '#', hash
            ].join('')));
          }
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