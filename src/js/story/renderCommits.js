/* eslint-disable max-len, no-use-before-define */
import { CHECK_ICON, CLOSE_ICON, TRASH_ICON, DOT_CIRCLE, BOOK } from '../utils/icons';
import getTitleFromCommitMessage from './getTitleFromCommitMessage';

export default function renderCommits(git, commits, editMode, currentlyEditingHash) {
  function process(commit) {
    const { hash, message, position } = commit;
    const isEditing = currentlyEditingHash === hash && editMode;
    const currentPosition = position && position > 0 ? `<span class="current-position">${position}</span>` : '';
    const messageFirstLine = getTitleFromCommitMessage(message);
    const isCurrent = git.head() === hash;
    let html = '';

    html += `<div class="commit ${ isCurrent ? 'commit-head' : ''}" id="c${hash}">`;
    html += !isEditing ? `
      <a href="javascript:void(0);" data-export="checkoutLink" data-hash="${hash}" class="checkout">
        ${currentPosition}<span class="commit-message-text">${ messageFirstLine ? messageFirstLine : '...' }</span>
      </a>
    ` : '';
    if (isEditing) {
      html += `
        <a href="javascript:void(0);" data-export="confirmButton">${CHECK_ICON(12)} save</a>
        ${ git.head() !== hash ? `<a href="javascript:void(0);" data-export="checkoutLink" data-hash="${hash}">${ DOT_CIRCLE(12) } checkout</a>` : '' }
        <a href="javascript:void(0);" data-export="deleteCommit" data-hash="${hash}" data-commit-message="${messageFirstLine}">${ TRASH_ICON(12) } delete</a>
        <a href="javascript:void(0);" data-export="editMessage" data-hash="${hash}" class="edit right">
          ${ CLOSE_ICON(12) }
        </a>
        <hr />
        <select data-export="publishStatus" data-hash="${ hash }">
          ${getPublishOptions(git, hash)}
        </select>
        <select data-export="injector">
          <option value="">inject</option>
          <option value="{inject:all}">All files</option>
          ${getFileInjectionOptions(git, hash)}
        </select>
      `;
    } else {
      html += `
        <a href="javascript:void(0);" data-export="editMessage" data-hash="${hash}" class="edit ${ !isEditing ? 'right' : ''}">
          ${ BOOK(12) + ' edit' }
        </a>
      `;
    }
    html += '</div>';

    if (isEditing) {
      html += `
        <div class="commit commit-edit ${ isCurrent ? 'commit-head' : ''}" id="c${hash}">
          <div data-export="messageArea" class="message-area" spellcheck="true"></div>
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
