export default function setTheme(theme) {
  document.querySelector('.app').setAttribute('class', 'app ' + theme);
}