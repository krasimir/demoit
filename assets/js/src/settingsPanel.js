import { el, basename, getDemoAndSnippetIdx } from './utils';

export const createSettingsPanel = function(settings) {
  const toggler = el('.settings-button');
  const panel = el('.settings');
  const [ editorDemoIdx, editorSnippetIdx ] = getDemoAndSnippetIdx();
  const openNewSnippet = hash => {
    return `javascript:window.location.hash='${ hash }';window.location.reload();`;
  }
  const renderSettings = function () {
    panel.innerHTML = settings.demos.map((demo, demoIdx) => {
      const idx = demoIdx + 1;

      return `
        <div class="demo">
          ${
            demo.snippets.map(
              (snippet, snippetIdx) => {
                const active = editorDemoIdx === demoIdx && editorSnippetIdx === snippetIdx ? ' active' : '';
                const fileName = basename(snippet);

                return `
                  <a class="${ active }" href="${ openNewSnippet(`#${ demoIdx },${ snippetIdx }`) }">
                    ${ fileName }
                  </a>
                `;
              }
            ).join('')
          }
        </div>
      `
    }).join('');
  }
  const toggle = () => {
    visible = !visible;
    panel.style.display = visible ? 'block' : 'none';
    if (visible) {
      renderSettings();
      toggler.setAttribute('src', './assets/img/close.svg');
    } else {
      toggler.setAttribute('src', './assets/img/laptop.svg');
    }
  }
  let visible = false;

  toggler.addEventListener('click', toggle);
}