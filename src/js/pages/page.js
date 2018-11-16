import { el, delay, once } from '../utils';

export default function createPage({ name, didMount, didShow, isGrid, permanentInDOM }) {
  if (!name) {
    throw new Error('The page definition requires a name.');
  }
  const pageDOMElement = el('body > .' + name);
  const pageAPI = {
    pageDOMElement,
    el(selector) {
      return pageDOMElement.find(selector);
    }
  }

  if (permanentInDOM) {
    didMount = once(didMount);
  }

  return {
    name,
    async show(params) {
      pageDOMElement.css('display', !isGrid ? 'block' : 'grid');
      await delay();
      pageDOMElement.css('opacity', 1);
      pageDOMElement.css('transform', 'translateY(0)');
      didMount && didMount(pageAPI, params);
      didShow && didShow(pageAPI, params);
    },
    async hide() {
      pageDOMElement.css('opacity', 0);
      pageDOMElement.css('transform', 'translateY(-20px)');
      await delay(200);
      pageDOMElement.css('display', 'none');
      !permanentInDOM && pageDOMElement.restoreToInitialDOM();
    }
  }
}