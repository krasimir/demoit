import { el, delay } from '../../utils';

const ESC_KEY = 27;
const MARKUP = ({ title, content }) => `<div class="popup">
  <section>
    <h2>${ title }</h2>
    <button class="close" data-export="close"><svg width="24" height="24" viewBox="0 0 1792 1792" xmlns="http://www.w3.org/2000/svg"><path d="M1490 1322q0 40-28 68l-136 136q-28 28-68 28t-68-28l-294-294-294 294q-28 28-68 28t-68-28l-136-136q-28-28-28-68t28-68l294-294-294-294q-28-28-28-68t28-68l136-136q28-28 68-28t68 28l294 294 294-294q28-28 68-28t68 28l136 136q28 28 28 68t-28 68l-294 294 294 294q28 28 28 68z"/></svg></button>
    ${ content }
  </section>
</div>`;

export default function popup(config) {
  const container = el.fromString(MARKUP(config));
  const body = el('body');
  const escHandler = e => (e.keyCode === ESC_KEY && close());
  const removeKeyUpListener = body.onKeyUp(escHandler);
  const close = () => {
    removeKeyUpListener();
    container.css('opacity', 0);
    setTimeout(() => container.detach(), 200);
  };

  container.exports().forEach(button => {
    if (button.attr('data-export') === 'close') {
      button.onClick(close);
    }
  });

  container.appendTo(body);
  setTimeout(() => container.css('opacity', 1), 1);

  return {
    closePopup: close,
    ...container.namedExports(),
  }
}