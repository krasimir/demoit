import el from './utils/element';
import setTheme from './utils/setTheme';

const LAYOUT_BLOCKS = ['editor', 'HTML', 'console'];
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

export default state => {
  const container = el.withRelaxedCleanup('.app .layout');

  setTheme(state.getEditorSettings().theme);

  const layout = state.getEditorSettings().layout || DEFAULT_LAYOUT;
  const output = el.fromTemplate('#template-output');
  const log = el.fromTemplate('#template-console');
  const editor = el.fromTemplate('#template-editor');
  const elementsMap = { output, log, editor };

  const splitFuncs = [];
  let splits;
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
        gutterSize: 2,
        direction,
        onDragEnd: () => {
          splits.forEach(({ split, sizes }) => {
            const newSizes = split.getSizes();
  
            sizes[0] = newSizes[0];
            sizes[1] = newSizes[1];
          });
          state.updateLayout(layout);
        }
      }),
      sizes
    }));

    if (direction === 'horizontal') {
      normalizedElements.map(element => element.css('float', 'left'));
    }

    return normalizedElements;
  }

  container.empty().appendChildren(build(layout));
  setTimeout(() => (splits = splitFuncs.map(f => f())), 1);
}
