import { el } from './element';

const LAYOUTS = {
  'default': {
    direction: 'horizontal',
    sizes: [30, 70],
    elements: [
      {
        direction: 'vertical',
        sizes: [50, 50],
        elements: [ 'output', 'log' ]
      },
      'editor'
    ]
  }
};

export function editorLayout(l, onLayoutUpdate) {
  const layout = l || LAYOUTS.default;
  const page = el('.editor.page .layout');
  const output = el.fromTemplate('#template-output');
  const log = el.fromTemplate('#template-console');
  const editor = el.fromTemplate('#template-editor');
  const elementsMap = { output, log, editor };
  const isLocalStorageAvailable = typeof window.localStorage !== 'undefined';

  const splitFuncs = [];
  const build = ({ direction, elements, sizes }) => {
    const normalizedElements = elements.map(element => {
      if (typeof element === 'object') {
        const wrapper = el.wrap(build(element));

        wrapper.attr('class', 'editor-section'); 
        return wrapper;
      }
      return elementsMap[element];
    });

    splitFuncs.push(() => ({
      split: Split(normalizedElements.map(({ e }) => e), {
        sizes,
        gutterSize: 4,
        direction
      }),
      sizes
    }));

    if (direction === 'horizontal') {
      normalizedElements.map(element => element.css('float', 'left'));
    }

    return normalizedElements;
  }

  page.appendChildren(build(layout));

  setTimeout(() => {
    const splits = splitFuncs.map(f => f());

    if (isLocalStorageAvailable) {
      setInterval(() => {
        splits.forEach(({ split, sizes }) => {
          const newSizes = split.getSizes();

          sizes[0] = newSizes[0];
          sizes[1] = newSizes[1];
        });
        onLayoutUpdate(layout);
      }, 2000);
    }
  }, 1);

  
}