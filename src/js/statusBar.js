import { el } from './utils/element';
import { CLOSE_ICON, PLUS_ICON, SETTINGS_ICON } from './utils/icons';

let visibility = false;

export default function statusBar(state, showFile, newFile, editFile, showSettings) {
  const bar = el.withFallback('.status-bar');
  const layout = el.withFallback('.editor .layout');

  const render = () => {
    const items  = [];
    const files = state.getFiles();

    items.push('<div data-export="buttons">');
    files.forEach(({ filename, editing }, idx) => {
      items.push(
        `<a data-export="file" href="javascript:void(0);" ${ state.isCurrentIndex(idx) ? 'class="active"' : '' }>${ filename }${ editing ? ' *' : ''}</a>`
      );
    });
    items.push(`<a data-export="newFileButton" href="javascript:void(0)">${ PLUS_ICON(14) }</a>`);
    items.push(`<a data-export="closeButton" class="right" href="javascript:void(0)">${ CLOSE_ICON(14) }</a>`);
    items.push(`<a data-export="settingsButton" class="right" href="javascript:void(0)">${ SETTINGS_ICON(14) }</a>`);
    items.push('</div>');

    bar.content(items.join('')).reduce((index, button) => {
      if (button.attr('data-export') === 'file') {
        button.onClick(() => showFile(index));
        button.onRightClick(() => editFile(index));
        return index + 1;
      }
      return index;
    }, 0);

    const { newFileButton, buttons, closeButton, settingsButton } = bar.namedExports();
    const manageVisibility = () => {
      buttons.css('display', visibility ? 'block' : 'none');
      bar.css('height', visibility ? '36px' : '8px');
      layout.css('height', visibility ? 'calc(100% - 36px)' : 'calc(100% - 8px)');
    }

    newFileButton.onClick(newFile);
    settingsButton.onClick(showSettings);
    closeButton.onClick(e => {
      e.stopPropagation();
      visibility = false;
      manageVisibility();
    });
    bar.onClick(() => {
      if (!visibility) {
        visibility = true;
        manageVisibility();
      }
    });

    manageVisibility();
  }

  render();

  state.listen(render);
}