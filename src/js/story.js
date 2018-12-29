import el from './utils/element';
import { PLUS_ICON } from './utils/icons';

var dmpInstance;
const createDMP = () => {
  if (dmpInstance) return dmpInstance;
  return new diff_match_patch();
}

export default function story(state, filesUpdated) {
  const container = el.withFallback('.story');
  const story = state.story() || [];
  const accumulate = (tillIndex) => {
    const dmp = createDMP();

    tillIndex = typeof tillIndex === 'undefined' ? story.length : tillIndex;

    if (story.length === 1) {
      return story[0].files;
    } else {
      return story.reduce((result, { files }, index) => {
        if (index > tillIndex) return result;
        if (index == 0) return files;
        return dmp.patch_apply(dmp.patch_fromText(files), result).shift();
      }, '');
    }
  }
  const snapshot = () => {
    return JSON.stringify(state.getFiles().map(file => {
      delete file.editing;
      return file;
    }));
  }

  if (container.found()) {
    container.content(`
      <div data-export="list"></div>
      <a href="javascript:void(0)" data-export="addButton">${ PLUS_ICON() }</a>
    `);

    const { addButton, list } = container.namedExports();
    const updateList = () => {
      list
        .content(story.map(({ files }, index) => {
          return `<a href="javascript:void(0);" data-export="link" data-index="${ index }">${ index }</a><br />`;
        }).join(''))
        .forEach(link => {
          link.onClick(() => {
            const files = JSON.parse(accumulate(parseInt(link.attr('data-index'))));

            state.setFiles(files);
            filesUpdated();
          });
        });
    }

    addButton.onClick(() => {
      if (story.length === 0) {
        story.push({ files: snapshot() });
      } else {
        const dmp = createDMP();
        const text1 = accumulate();
        const text2 = snapshot();
        const diff = dmp.diff_main(text1, text2, true);

        if (diff.length > 2) {
          dmp.diff_cleanupSemantic(diff);
        }

        const patch = dmp.patch_make(text1, text2, diff);
        const patchText = dmp.patch_toText(patch);

        story.push({ files: patchText });
      }
      state.story(story);
      updateList();
    });

    updateList();
  }
}