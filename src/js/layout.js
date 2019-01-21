/* eslint-disable no-undef */
import el from './utils/element';
import setTheme from './utils/setTheme';
import { IS_PROD } from './constants';

export const LAYOUT_BLOCKS = ['editor', 'HTML', 'console', 'story'];

if (IS_PROD) {
  LAYOUT_BLOCKS.push('story-preview');
}

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
    };
  }
  if (item.elements.length > 0) {
    item.elements.forEach((i, index) => (item.elements[index] = validateLayout(i)));
  }
  return item;
}
function generateSizes(elements) {
  return elements.map(() => 100 / elements.length);
}

export default state => {
  const container = el.withRelaxedCleanup('.app .layout');
  const body = el.withRelaxedCleanup('body');

  setTheme(state.getEditorSettings().theme);

  const layout = validateLayout(state.getEditorSettings().layout || DEFAULT_LAYOUT);
  const HTML = el.fromTemplate('#template-html');
  const consoleE = el.fromTemplate('#template-console');
  const editor = el.fromTemplate('#template-editor');
  const story = el.fromTemplate('#template-story');
  const storyPreview = el.fromTemplate('#template-story-preview');
  const empty = el.withFallback('.does-not-exists');
  const elementsMap = { HTML, console: consoleE, editor, story, 'story-preview': storyPreview };
  const usedBlocks = [];

  const splitFuncs = [];
  let splits;
  const build = block => {
    let { direction, elements, sizes } = block;
    const normalizedElements = elements.map(item => {
      if (item.elements.length > 0) {
        const wrapper = el.wrap(build(item));

        wrapper.attr('class', 'editor-section');
        return wrapper;
      }
      usedBlocks.push(item.name);
      return elementsMap[item.name] ? elementsMap[item.name] : empty;
    });

    if (sizes && sizes.length !== elements.length) {
      sizes = elements.map(() => (100 / elements.length));
    }

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
          state.updateThemeAndLayout(layout);
        }
      })
    }));

    if (direction === 'horizontal') {
      normalizedElements.map(el => el.css('float', 'left'));
    }

    return normalizedElements;
  };

  container.empty().appendChildren(build({ elements: [layout] }));

  if (usedBlocks.indexOf('HTML') === -1) {
    HTML.css('position', 'absolute');
    HTML.css('width', '10px');
    HTML.css('height', '10px');
    HTML.css('overflow', 'hidden');
    HTML.css('top', '-100px');
    HTML.css('left', '-100px');
    HTML.css('visibility', 'hidden');
    HTML.css('display', 'none');
    HTML.appendTo(body);
  }

  setTimeout(() => (splits = splitFuncs.map(f => f())), 1);
};
