/* eslint-disable max-len, no-use-before-define */
import { CHECK_ICON, CLOSE_ICON, TRASH_ICON, DOT_CIRCLE, BOOK } from '../utils/icons';
import getTitleFromCommitMessage from './getTitleFromCommitMessage';

export default function renderCommits(git, commits, editMode, currentlyEditingHash) {
  function process(commit) {
    const { hash, message, position } = commit;

    const currentPosition = position && position > 0 ? `<span class="current-position">${position}</span>` : '';
    const messageFirstLine = getTitleFromCommitMessage(message);
    const isCurrent = git.head() === hash;
    let html = '';

    html += `
      <div class="commit ${ isCurrent ? 'commit-head' : ''}" id="c${hash}">
        <a href="javascript:void(0);" data-export="checkoutLink" data-commit-hash="${hash}" class="checkout">
          ${currentPosition}<span class="commit-message-text">${ messageFirstLine ? messageFirstLine : '...' }</span>
        </a>
        <a href="javascript:void(0);" data-export="editMessage" data-commit-hash="${hash}" class="edit">${ BOOK(12) } edit</a>
      </div>
    `;

    if (currentlyEditingHash === hash && editMode) {
      html += `
        <div class="commit commit-edit" id="c${hash}">
          <div class="story-form">
            <div class="story-form-bar">
              <a href="javascript:void(0);" data-export="confirmButton">${CHECK_ICON(12)} save</a>
              <a href="javascript:void(0);" data-export="closeButton">${CLOSE_ICON(12)} cancel</a>
              ${ git.head() !== hash ? `<a href="javascript:void(0);" data-export="checkoutLink" data-commit-hash="${hash}">${ DOT_CIRCLE(12) } checkout</a>` : '' }
              <a href="javascript:void(0);" data-export="deleteCommit" data-commit-hash="${hash}" data-commit-message="${messageFirstLine}">${ TRASH_ICON(12) } delete</a>
              <select data-export="publishStatus">
                ${getPublishOptions(git, hash)}
              </select>
              <select data-export="injector">
                <option value="">inject</option>
                <option value="{inject:all}">All files</option>
                ${getFileInjectionOptions(git, hash)}
              </select>
            </div>
            <div data-export="messageArea" class="message-area" spellcheck="true"></div>
          </div>
        </div>
      `;
    }
    return html;
  }

  if (commits.length === 0) {
    return '';
  }
  return commits.map(process).join('');
};

function getPublishOptions(git, currentHash) {
  const allCommits = git.log();
  const { meta } = allCommits[currentHash];
  const currentPosition = meta ? parseInt(meta.position, 10) : 0;
  let options = [];

  options.push(`<option value="0"${currentPosition === 0 ? 'selected="selected"' : ''}>not in story</option>`);
  for (let i = 1; i < Object.keys(allCommits).length + 1; i++) {
    options.push(`<option value="${i}" ${currentPosition === i ? 'selected="selected"' : ''}>position #${i}</option>`);
  }

  return options.join('');
}
function getFileInjectionOptions(git, currentHash) {
  const files = git.show(currentHash).files;

  return files.map(file => `<option value="{inject:${file[0]}}">${file[0]}</option>`);
}
