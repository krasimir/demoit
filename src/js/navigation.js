import { el } from './utils';

export default function navigation(storage, showFile, newFile, editFile) {
  const navigation = el('.files .nav');
  
  const render = () => {
    const items  = [];

    // current files
    items.push('<ul>');
    storage.getFiles().forEach(({ filename, editing }, idx) => {
      items.push(
        `<li><a href="javascript:window.showFile(${ idx });void(0);" ${ storage.isCurrentIndex(idx) ? 'class="active"' : '' }" oncontextmenu="javascript:window.editFile(${ idx });return false;">${ filename }${ editing ? ' *' : ''}</a></li>`
      );
    });
    items.push('</ul>');

    // icons
    items.push(
      '<ul class="with-icons"><li><a href="javascript:window.newFile()"><svg width="24" height="24" viewBox="0 0 1792 1792" xmlns="http://www.w3.org/2000/svg"><path d="M1600 736v192q0 40-28 68t-68 28h-416v416q0 40-28 68t-68 28h-192q-40 0-68-28t-28-68v-416h-416q-40 0-68-28t-28-68v-192q0-40 28-68t68-28h416v-416q0-40 28-68t68-28h192q40 0 68 28t28 68v416h416q40 0 68 28t28 68z"/></svg></a></li></ul>'
    );

    navigation.content(items.join(''));
  }

  render();

  window.showFile = index => showFile(index);
  window.editFile = index => editFile(index);
  window.newFile = () => newFile();

  storage.listen(render);
}