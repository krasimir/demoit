import el from './utils/element';
import setTheme from './utils/setTheme';

export const LAYOUT_BLOCKS = ['editor', 'HTML', 'console', 'story'];
export const DEFAULT_LAYOUT = {
  elements: [
    {
      name: 'editor',
      elements: []
    },
    {
      elements: [
        {
          name: 'HTML',
          elements: []
        },
        {
          name: 'console',
          elements: []
        }
      ],
      direction: 'horizontal'
    }
  ],
  direction: 'vertical'
};

function validateLayout(item) {
  if (typeof item === 'string') {
    if (item === 'output') item = 'HTML';
    if (item === 'log') item = 'console';
    return {
      name: item,
      elements: []
    }
  }
  if (item.elements.length > 0) {
    item.elements.forEach((i, index) => item.elements[index] = validateLayout(i));
  }
  return item;
}
function generateSizes(elements) {
  return elements.map(() => 100 / elements.length);
}

export default state => {
  const container = el.withRelaxedCleanup('.app .layout');

  setTheme(state.getEditorSettings().theme);

  const layout = validateLayout(state.getEditorSettings().layout || DEFAULT_LAYOUT);
  const HTML = el.fromTemplate('#template-html');
  const consoleE = el.fromTemplate('#template-console');
  const editor = el.fromTemplate('#template-editor');
  const story = el.fromTemplate('#template-story');
  const elementsMap = { HTML, console: consoleE, editor, story };

  const splitFuncs = [];
  let splits;
  const build = block => {
    const { direction, elements, sizes } = block;
    const normalizedElements = elements.map(item => {
      if (item.elements.length > 0) {
        const wrapper = el.wrap(build(item));

        wrapper.attr('class', 'editor-section'); 
        return wrapper;
      }
      return elementsMap[item.name];
    });

    splitFuncs.push(() => ({
      b: block,
      split: Split(normalizedElements.map(({ e }) => e), {
        sizes: sizes || generateSizes(normalizedElements),
        gutterSize: 2,
        direction,
        onDragEnd: () => {
          splits.forEach(({ b, split }) => {
            b.sizes = split.getSizes();
          });
          state.updateLayout(layout);
        }
      })
    }));

    if (direction === 'horizontal') {
      normalizedElements.map(el => el.css('float', 'left'));
    }

    return normalizedElements;
  }

  container.empty().appendChildren(build({
    elements: [layout]
  }));
  setTimeout(() => (splits = splitFuncs.map(f => f())), 1);
}
