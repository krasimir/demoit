/* eslint-disable max-len */
import el from './utils/element';
import { CLOSE_ICON, PLUS_ICON, SETTINGS_ICON, NO_USER, FORK, SHARE } from './utils/icons';
import { IS_PROD } from './constants';

const STATUS_BAR_HIDDEN_HEIGHT = '6px';
const STATUS_BAR_VISIBLE_HEIGHT = '36px';

const showProfilePicAndName = profile => {
  return `<img src="${ profile.avatar }"/>`;
};
const createStatusBarLink = (exportKey, label, className = '') => {
  return `<a data-export="${ exportKey }" class="${ className }" href="javascript:void(0)">${ label }</a>`;
};
const createStr = (str, n) => Array(n).join(str);

export default function statusBar(state, showFile, newFile, editFile, showSettings, showProfile, editName) {
  const bar = el.withRelaxedCleanup('.status-bar');
  const layout = el.withRelaxedCleanup('.app .layout');
  const tooltip = el.withRelaxedCleanup('.status-bar-tooltip');
  let visibility = !!state.getEditorSettings().statusBar;

  const enableTooltip = (button, text, position, positionValue) => {
    button.onMouseOver(() => {
      tooltip
        .attr('class', 'status-bar-tooltip ' + position)
        .css('display', 'block')
        .css(position, positionValue + 'px')
        .content(text);
    });
    button.onMouseOut(() => {
      tooltip.clearCSS().css('display', 'none');
    });
  };

  const render = () => {
    const items = [];
    const files = state.getFiles();

    items.push('<div data-export="buttons">');
    IS_PROD && items.push(createStatusBarLink('profileButton', state.loggedIn() ? showProfilePicAndName(state.getProfile()) : NO_USER(), 'profile'));
    state.isForkable() && items.push(createStatusBarLink('forkButton', FORK(14)));
    files.forEach(([ filename, file ]) => {
      const isCurrentFile = state.isCurrentFile(filename);

      items.push(createStatusBarLink(
        'file:' + filename,
        `<span>${ filename }${ isCurrentFile && state.pendingChanges() ? '*' : ''}</span>`,
        `file${ isCurrentFile ? ' active' : '' }${ file.en ? ' entry' : ''}`
      ));
    });
    items.push(createStatusBarLink('newFileButton', PLUS_ICON(14), ''));
    items.push(createStatusBarLink('nameButton', state.meta().name ? state.meta().name : 'unnamed', 'name'));
    items.push(createStatusBarLink('shareButton', SHARE(14)));
    items.push(createStatusBarLink('settingsButton', SETTINGS_ICON(14)));
    items.push(createStatusBarLink('closeButton', CLOSE_ICON(14)));
    items.push('</div>');

    bar.content(items.join('')).forEach(button => {
      if (button.attr('data-export').indexOf('file') === 0) {
        const filename = button.attr('data-export').split(':').pop();

        button.onClick(() => showFile(filename));
        button.onRightClick(() => editFile(filename));
      }
    });

    const {
      newFileButton,
      closeButton,
      settingsButton,
      profileButton,
      forkButton,
      nameButton,
      shareButton
    } = bar.namedExports();
    const manageVisibility = () => {
      const { buttons } = bar.namedExports();

      buttons.css('display', visibility ? 'grid' : 'none');
      buttons.css('gridTemplateColumns', [
        IS_PROD ? '34px' : false,
        state.isForkable() ? '30px' : false,
        createStr('minmax(auto, 135px) ', state.getNumOfFiles() + 1),
        '30px',
        '1fr',
        '30px',
        '30px',
        '30px'
      ].filter(value => value).join(' '));
      bar.css('height', visibility ? STATUS_BAR_VISIBLE_HEIGHT : STATUS_BAR_HIDDEN_HEIGHT);
      layout.css('height', visibility ? `calc(100% - ${ STATUS_BAR_VISIBLE_HEIGHT })` : `calc(100% - ${ STATUS_BAR_HIDDEN_HEIGHT })`);
      state.updateStatusBarVisibility(visibility);
    };

    newFileButton && newFileButton.onClick(newFile);
    shareButton && shareButton.onClick(() => showSettings(2));
    settingsButton && settingsButton.onClick(() => showSettings());
    profileButton && profileButton.onClick(showProfile);
    state.isDemoOwner() && nameButton && nameButton.onClick(editName);
    forkButton && forkButton.onClick(() => state.fork());
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

    forkButton && enableTooltip(forkButton, '&#8600; Fork this demo', 'left', 34);
    profileButton && enableTooltip(profileButton, state.loggedIn() ? 'Your profile' : 'Log in', 'left', 2);
    enableTooltip(shareButton, 'Embed or save locally', 'right', 60);
    enableTooltip(settingsButton, 'Settings', 'right', 29);
    enableTooltip(closeButton, 'Close status bar', 'right', 2);

    manageVisibility();
  };

  render();

  state.listen(render);
}
