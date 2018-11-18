import { el } from '../../utils';

export default function navigation(storage, showFile, newFile, editFile, manageStorage, manageDependencies) {
  const navigation = el('.files .nav');
  const manageStorageButton = el('.files .storage');
  const manageDependenciesButton = el('.files .manageDependencies');
  
  const render = () => {
    const items  = [];

    // current files
    items.push('<ul>');
    storage.getFiles().forEach(({ filename, editing }, idx) => {
      items.push(
        `<li><a data-export href="javascript:void(0);" ${ storage.isCurrentIndex(idx) ? 'class="active"' : '' }>${ filename }${ editing ? ' *' : ''}</a></li>`
      );
    });
    items.push('</ul>');

    // icons
    items.push(
      '<ul class="with-icons"><li><a data-export="newFile" href="javascript:void(0)"><svg width="24" height="24" viewBox="0 0 1792 1792" xmlns="http://www.w3.org/2000/svg"><path d="M1600 736v192q0 40-28 68t-68 28h-416v416q0 40-28 68t-68 28h-192q-40 0-68-28t-28-68v-416h-416q-40 0-68-28t-28-68v-192q0-40 28-68t68-28h416v-416q0-40 28-68t68-28h192q40 0 68 28t28 68v416h416q40 0 68 28t28 68z"/></svg></a></li></ul>'
    );

    navigation.content(items.join('')).forEach((button, i) => {
      if (button.attr('data-export') === 'newFile') {
        button.onClick(newFile);
      } else {
        button.onClick(() => showFile(i));
        button.onRightClick(() => editFile(i));
      }
    });
  }

  render();

  storage.listen(render);

  manageStorageButton.onClick(manageStorage);
  manageDependenciesButton.onClick(manageDependencies);
}