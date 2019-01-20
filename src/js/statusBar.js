/* eslint-disable max-len, no-sequences */
import el from './utils/element';
import { CLOSE_ICON, PLUS_ICON, SETTINGS_ICON, NO_USER, FORK, SHARE, BARS } from './utils/icons';
import { IS_PROD } from './constants';

const STATUS_BAR_HIDDEN_HEIGHT = '6px';
const STATUS_BAR_VISIBLE_HEIGHT = '36px';

const showProfilePicAndName = profile => {
  return `<img src="${ profile.avatar }"/>`;
};
const createLink = (exportKey, label, className = '', href = 'javascript:void(0)') => {
  return `<a data-export="${ exportKey }" class="${ className }" href="${ href }">${ label }</a>`;
};
const createStr = (str, n) => Array(n).join(str);

export default function statusBar(state, showFile, newFile, editFile, showSettings, saveCurrentFile, editName) {
  const bar = el.withRelaxedCleanup('.status-bar');
  const layout = el.withRelaxedCleanup('.app .layout');
  const menu = el.withRelaxedCleanup('.status-bar-menu');
  let visibility = !!state.getEditorSettings().statusBar;
  let visibilityMenu = false;
  let pending = false;

  const toggleMenu = () => {
    menu.css('display', (visibilityMenu = !visibilityMenu) ? 'block' : 'none');
  };

  const render = () => {
    const items = [];
    const menuItems = [];
    const files = state.getFiles();

    items.push('<div data-export="buttons">');
    files.forEach(([ filename, file ]) => {
      const isCurrentFile = state.isCurrentFile(filename);

      items.push(createLink(
        'file:' + filename,
        `<span>${ filename }${ isCurrentFile && pending ? '*' : ''}</span>`,
        `file${ isCurrentFile ? ' active' : '' }${ file.en ? ' entry' : ''}`
      ));
    });
    items.push(createLink('newFileButton', PLUS_ICON(14), 'new-file'));
    items.push(`
      <div class="meta-and-status">
        ${ state.meta().name ? state.meta().name : 'unnamed' }
        ${ state.loggedIn() && !state.isDemoOwner() ? '<span class="badge warning">not yours</span>' : '' }
      </div>
    `);
    items.push(createLink('menuButton', BARS(14)));
    items.push(createLink('closeButton', CLOSE_ICON(14)));
    items.push('</div>');

    // `/login?did=${ demoId }`;
    // '/u/' + state.getProfile().id;
    IS_PROD && menuItems.push(createLink(
      'profileButton',
      state.loggedIn() ?
      showProfilePicAndName(state.getProfile()) + ' Profile' :
      NO_USER() + ' Log in',
      'profile',
      state.loggedIn() ?
      '/u/' + state.getProfile().id :
      `/login?did=${ state.getDemoId() }`
      ));
    IS_PROD && menuItems.push(createLink('', PLUS_ICON(14) + ' New story', '', '/new'));
    state.isForkable() && menuItems.push(createLink('forkButton', FORK(14) + ' Fork'));
    IS_PROD && menuItems.push(createLink('shareButton', SHARE(14) + ' Share/Embed'));
    state.isDemoOwner() && menuItems.push(createLink('nameButton', SETTINGS_ICON(14) + ' Story'));
    menuItems.push(createLink('settingsButton', SETTINGS_ICON(14) + ' Editor'));
    state.isForkable() && menuItems.push(createLink('', NO_USER() + ' Log out', '', `/logout?r=e/${ state.getDemoId() }`));

    bar.content(items.join('')).forEach(button => {
      if (button.attr('data-export').indexOf('file') === 0) {
        const filename = button.attr('data-export').split(':').pop();

        button.onClick(() => {
          if (!state.isCurrentFile(filename)) {
            showFile(filename);
          } else if (pending) {
            saveCurrentFile();
          }
        });
        button.onRightClick(() => editFile(filename));
      }
    });
    menu.content(menuItems.join(''));

    const { newFileButton, closeButton, menuButton } = bar.namedExports();
    const { forkButton, shareButton, nameButton, settingsButton } = menu.namedExports();

    const manageVisibility = () => {
      const { buttons } = bar.namedExports();

      buttons.css('display', visibility ? 'grid' : 'none');
      buttons.css('gridTemplateColumns', [
        createStr('minmax(auto, 135px) ', state.getNumOfFiles() + 1),
        '30px',
        '1fr',
        '30px',
        '30px'
      ].filter(value => value).join(' '));
      bar.css('height', visibility ? STATUS_BAR_VISIBLE_HEIGHT : STATUS_BAR_HIDDEN_HEIGHT);
      layout.css('height', visibility ? `calc(100% - ${ STATUS_BAR_VISIBLE_HEIGHT })` : `calc(100% - ${ STATUS_BAR_HIDDEN_HEIGHT })`);
      state.updateStatusBarVisibility(visibility);
    };

    newFileButton && newFileButton.onClick(newFile);
    shareButton && shareButton.onClick(() => (showSettings(2), toggleMenu()));
    settingsButton && settingsButton.onClick(() => (showSettings(), toggleMenu()));
    state.isDemoOwner() && nameButton && nameButton.onClick(() => (editName(), toggleMenu()));
    forkButton && forkButton.onClick(() => (state.fork(), toggleMenu()));
    menuButton && menuButton.onClick(toggleMenu);
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
  };

  render();

  state.listen(render);

  return (value) => {
    pending = value;
    render();
  };
}
