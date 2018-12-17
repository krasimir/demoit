import el from './utils/element';
import { CLOSE_ICON, PLUS_ICON, SETTINGS_ICON, DOT_CIRCLE, NO_USER } from './utils/icons';
import { isProd } from './utils';

const STATUS_BAR_HIDDEN_HEIGHT = '4px';
const STATUS_BAR_VISIBLE_HEIGHT = '36px';

const showProfilePicAndName = profile => {
  return `<img src="${ profile.avatar }"/>`
};

const createStatusBarLink = (exportKey, label, className = 'right') => {
  return `<a data-export="${ exportKey }" class="${ className }" href="javascript:void(0)">${ label }</a>`;
}

export default function statusBar(state, showFile, newFile, editFile, showSettings, showProfile) {
  const bar = el.withRelaxedCleanup('.status-bar');
  const layout = el.withRelaxedCleanup('.app .layout');
  let visibility = !!state.getEditorSettings().statusBar;

  const render = () => {
    const items  = [];
    const files = state.getFiles();

    items.push('<div data-export="buttons">');
    files.forEach(({ filename, entryPoint }, idx) => {
      const isCurrentFile = state.isCurrentIndex(idx);

      items.push(createStatusBarLink(
        'file',
        `${ entryPoint ? DOT_CIRCLE(15) : ''}${ filename }${ isCurrentFile && state.pendingChanges() ? '*' : ''}`,
        `file ${ isCurrentFile ? ' active' : '' }`
      ))
    });
    items.push(createStatusBarLink('newFileButton', PLUS_ICON(14), ''));
    items.push(createStatusBarLink('closeButton', CLOSE_ICON(14)));
    items.push(createStatusBarLink('settingsButton', SETTINGS_ICON(14)));
    isProd() && items.push(createStatusBarLink('profileButton', state.loggedIn() ? showProfilePicAndName(state.getProfile()) : NO_USER(), 'right profile'));
    items.push('</div>');

    bar.content(items.join('')).reduce((index, button) => {
      if (button.attr('data-export') === 'file') {
        button.onClick(() => showFile(index));
        button.onRightClick(() => editFile(index));
        return index + 1;
      }
      return index;
    }, 0);

    const { newFileButton, closeButton, settingsButton, profileButton } = bar.namedExports();
    const manageVisibility = () => {
      const { buttons } = bar.namedExports();
      buttons.css('display', visibility ? 'block' : 'none');
      bar.css('height', visibility ? STATUS_BAR_VISIBLE_HEIGHT : STATUS_BAR_HIDDEN_HEIGHT);
      layout.css('height', visibility ? `calc(100% - ${ STATUS_BAR_VISIBLE_HEIGHT })` : `calc(100% - ${ STATUS_BAR_HIDDEN_HEIGHT })`);
      state.updateStatusBarVisibility(visibility);
    }

    newFileButton && newFileButton.onClick(newFile);
    settingsButton && settingsButton.onClick(showSettings);
    profileButton && profileButton.onClick(showProfile);
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