import { modal } from '../utils';

export default function manageDependencies({ storage, changePage }) {
  return {
    name: 'manageDependencies',
    didMount({ el, pageDOMElement }) {
      const saveButton = el('.save');
      const list = el('.dependencies-list');

      list.prop('value', storage.getDependencies().join('\n'));

      saveButton.onClick(async () => {
        storage.setDependencies(list.prop('value').split(/\r?\n/).filter(dep => (dep !== '' || dep !== '\n')));
        changePage('dependencies');
      });

      modal(pageDOMElement, () => changePage('editor'));
    }
  }
}