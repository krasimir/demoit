import el from './element';

export default function setTheme(theme) {
  el.withRelaxedCleanup('.app').attr('class', 'app ' + theme);
}