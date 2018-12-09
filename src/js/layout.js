import el from './utils/element';
import setTheme from './utils/setTheme';
import { isPreviewMode, isEditorMode } from './mode';

export const LAYOUTS = {
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
  },
  'layoutLeft': {
    direction: 'horizontal',
    sizes: [70, 30],
    elements: [
      'editor',
      {
        direction: 'vertical',
        sizes: [50, 50],
        elements: [ 'output', 'log' ]
      }
    ]
  },
  'layoutTop': {
    direction: 'vertical',
    sizes: [30, 70],
    elements: [
      {
        direction: 'horizontal',
        sizes: [50, 50],
        elements: [ 'output', 'log' ]
      },
      'editor'
    ]
  },
  'layoutBottom': {
    direction: 'vertical',
    sizes: [70, 30],
    elements: [
      'editor',
      {
        direction: 'horizontal',
        sizes: [50, 50],
        elements: [ 'output', 'log' ]
      }
    ]
  },
  'layoutEC': {
    direction: 'horizontal',
    sizes: [70, 30],
    elements: [
      'editor',
      'log'
    ]
  },
  'layoutEO': {
    direction: 'horizontal',
    sizes: [70, 30],
    elements: [
      'editor',
      'output'
    ]
  },
  'layoutEOBottom': {
    direction: 'vertical',
    sizes: [70, 30],
    elements: [
      'editor',
      'output'
    ]
  },
  'layoutECBottom': {
    direction: 'vertical',
    sizes: [70, 30],
    elements: [
      'editor',
      'log'
    ]
  },
  'layoutE': {
    direction: 'horizontal',
    sizes: [100],
    elements: [
      'editor'
    ]
  },
  'layoutO': {
    direction: 'horizontal',
    sizes: [100],
    elements: [
      'output'
    ]
  }
};

export default state => {
  const container = el.withRelaxedCleanup('.app .layout');

  setTheme(state.getEditorSettings().theme);

  if (isPreviewMode()) {
    container.empty().appendChild(el.fromTemplate('#template-code-preview').e);
  } else if (isEditorMode()) {
    const layout = state.getEditorSettings().layout || LAYOUTS.default;
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
}
