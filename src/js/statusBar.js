import el from './utils/element';
import { CLOSE_ICON, PLUS_ICON, SETTINGS_ICON } from './utils/icons';
import { isEditorMode, isReadOnlyMode } from './mode';

const STATUS_BAR_HIDDEN_HEIGHT = '4px';
const STATUS_BAR_VISIBLE_HEIGHT = '36px';

export default function statusBar(state, showFile, newFile, editFile, showSettings) {
  const bar = el.withRelaxedCleanup('.status-bar');
  const layout = el.withRelaxedCleanup('.app .layout');
  let visibility = !!state.getEditorSettings().statusBar;

  const render = () => {
    const items  = [];
    const files = state.getFiles();

    items.push('<div data-export="buttons">');
    files.forEach(({ filename, editing }, idx) => {
      items.push(
        `<a data-export="file" href="javascript:void(0);" ${ state.isCurrentIndex(idx) ? 'class="active"' : '' }>${ filename }${ editing ? ' *' : ''}</a>`
      );
    });
    isEditorMode() && items.push(`<a data-export="newFileButton" href="javascript:void(0)">${ PLUS_ICON(14) }</a>`);
    items.push(`<a data-export="closeButton" class="right" href="javascript:void(0)">${ CLOSE_ICON(14) }</a>`);
    (isEditorMode() || isReadOnlyMode()) && items.push(`<a data-export="settingsButton" class="right" href="javascript:void(0)">${ SETTINGS_ICON(14) }</a>`);
    items.push('</div>');

    bar.content(items.join('')).reduce((index, button) => {
      if (button.attr('data-export') === 'file') {
        button.onClick(() => showFile(index));
        isEditorMode() && button.onRightClick(() => editFile(index));
        return index + 1;
      }
      return index;
    }, 0);

    const { newFileButton, closeButton, settingsButton } = bar.namedExports();
    const manageVisibility = () => {
      const { buttons } = bar.namedExports();
      buttons.css('display', visibility ? 'block' : 'none');
      bar.css('height', visibility ? STATUS_BAR_VISIBLE_HEIGHT : STATUS_BAR_HIDDEN_HEIGHT);
      layout.css('height', visibility ? `calc(100% - ${ STATUS_BAR_VISIBLE_HEIGHT })` : `calc(100% - ${ STATUS_BAR_HIDDEN_HEIGHT })`);
      state.updateStatusBarVisibility(visibility);
    }

    newFileButton && newFileButton.onClick(newFile);
    settingsButton && settingsButton.onClick(showSettings);
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