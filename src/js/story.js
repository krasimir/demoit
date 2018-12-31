import el from './utils/element';
import { PLUS_ICON, TRASH_ICON } from './utils/icons';

var dmpInstance;
const createDMP = () => {
  if (dmpInstance) return dmpInstance;
  return new diff_match_patch();
}
const accumulate = (story, selected) => {
  if (story.length === 1) return story[0].files;

  const dmp = createDMP();
  const tillIndex = selected === null ? story.length : selected;

  return story.reduce((result, { files }, index) => {
    if (index > tillIndex) return result;
    if (index == 0) return files;
    return dmp.patch_apply(dmp.patch_fromText(files), result).shift();
  }, '');
}
const deleteCommit = (story, indexToRemove) => {
  /*
    a, b, c

  */
  if (story.length > 1) {
    const dmp = createDMP();

    if (indexToRemove === 0) {
      story[1].files = dmp.patch_apply(dmp.patch_fromText(story[1].files), story[0].files).shift();
    } else if (indexToRemove < story.length - 1) {
      
    }
  }
  story.splice(indexToRemove, 1);
}
const snapshot = state => JSON.stringify(state.getFiles().map(file => {
  delete file.editing;
  return file;
}));
const editStory = (commit, link, commitTitle, commitText, onSave, onClose) => {
  setTimeout(() => commitTitle.e.focus(), 10);
  const handler = e => {
    if ((e.metaKey || e.ctrlKey) && e.keyCode === 83) { // save
      e.preventDefault();
      commit.t = commitTitle.prop('value');
      commit.m = commitText.prop('value');
      link.content(commit.t);
      onSave();
    } else if (e.keyCode === 27) { // escape
      onClose();
    } else if (e.keyCode !== 9) { // tag
      link.content(commit.t + '*');
    }
  };
  commitTitle.attr('value', commit.t || '');
  commitText.content(commit.m || '');
  commitTitle.onKeyDown(handler);
  commitText.onKeyDown(handler);
}

export default function story(state, filesUpdated) {
  var selected = null;
  const container = el.withFallback('.story');
  const story = state.story() || [];
  const persist = () => {
    state.story(story);
    console.log(JSON.stringify(story, null, 2));
  };

  if (!container.found()) return;

  container.content(`
    <div data-export="list"></div>
    <div class="${ story.length === 0 ? 'centered' : '' }">
      <a href="javascript:void(0)" data-export="addButton" class="add-button">${ PLUS_ICON() }</a>
    </div>
  `);

  const { addButton, list } = container.namedExports();
  const render = () => {
    const htmlString = story.map(({ files, t }, index) => {
      if (selected === index) {
        return `
          <div data-index="${ index }" class="commit selected">
            <span>${ t || (index + 1) }</span>
            <a href="javascript:void(0);" data-index="${ index }" data-export="deleteButton" class="delete-commit">${ TRASH_ICON(16) }</a>
          </div>
          <div class="edit-story">
            <input type="text" data-export="commitTitle" placeholder="Title" class="commit-title"/>
            <textarea data-export="commitText" class="commit-text" placeholder="Text"></textarea>
          </div>
        `;
      }
      return `
        <a href="javascript:void(0);" data-export="link" data-index="${ index }" class="commit">
          ${ t || (index + 1) }
        </a>
      `;
    }).join('');
    
    if (htmlString !== '') {
      const elements = list.content(htmlString);

      elements.forEach(link => {
        if (link.attr('data-export') === 'link') {
          link.onClick(() => {
            try {
              selected = parseInt(link.attr('data-index'));
              state.setFiles(JSON.parse(accumulate(story, selected)));
              filesUpdated();
              render();
            } catch(error) {
              console.error(error);
              render();
            }
          });
        }
      });
    }
    
    const { commitTitle, commitText, deleteButton } = list.namedExports();

    if (commitText && commitTitle) {
      editStory(
        story[selected],
        el(`[data-index="${ selected }"] span`),
        commitTitle,
        commitText,
        function onSave() {
          persist();
        },
        function onClose() {
          selected = null;
          render();
        }
      );
      deleteButton.onClick(() => {
        selected = null;
        deleteCommit(story, parseInt(deleteButton.attr('data-index')));
        persist();
        render();
        console.log(JSON.stringify(story, null, 2));
      });
    }
  }

  addButton.onClick(() => {
    if (story.length === 0) {
      story.push({
        files: snapshot(state),
        t: (story.length + 1)
      });
    } else {
      const dmp = createDMP();
      const text1 = accumulate(story, selected);
      const text2 = snapshot(state);
      const diff = dmp.diff_main(text1, text2, true);

      if (diff.length > 2) {
        dmp.diff_cleanupSemantic(diff);
      }
      story.push({
        files: dmp.patch_toText(dmp.patch_make(text1, text2, diff)),
        t: (story.length + 1)
      });
    }
    selected = story.length - 1;
    persist();
    render();
  });

  render();
}