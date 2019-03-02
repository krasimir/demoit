/* eslint-disable max-len, no-sequences */
import el from './utils/element';
import commitDiff from './utils/commitDiff';
import confirmPopUp from './popups/confirmPopUp';
import { DEBUG } from './constants';
import getTitleFromCommitMessage from './story/getTitleFromCommitMessage';

function renderCommits(git, commits) {
  function process(commit) {
    const { hash, message, position } = commit;
    const currentPosition = position && position > 0 ? `<span class="current-position">${position}</span>` : '';
    const messageFirstLine = getTitleFromCommitMessage(message);
    const isCurrent = git.head() === hash;
    let html = '';

    html += `<div class="commit ${ isCurrent ? 'commit-head' : ''}" id="c${hash}">`;
    html += `
      <a href="javascript:void(0);" data-export="checkoutLink" data-hash="${hash}" class="checkout">
        ${currentPosition}<span class="commit-message-text">${ messageFirstLine ? messageFirstLine : '...' }</span>
      </a>
    `;
    html += '</div>';
    return html;
  }

  if (commits.length === 0) {
    return '';
  }
  return commits.map(process).join('');
};

export default function story(state, onChange) {
  const container = el.withFallback('.read-only');
  const git = state.git();

  if (!container.found()) return;

  const render = () => {
    DEBUG && console.log('story:render');
    const allCommits = git.log();
    const commits = Object.keys(allCommits).map(hash => ({
      hash,
      message: allCommits[hash].message,
      position: allCommits[hash].meta ? parseInt(allCommits[hash].meta.position, 10) || null : null
    })).sort((a, b) => {
      if (a.position !== null && b.position !== null) {
        return a.position - b.position;
      } else if (a.position !== null && b.position === null) {
        return -1;
      } else if (a.position === null && b.position !== null) {
        return 1;
      }
      return a.hash - b.hash;
    });
    const numOfCommits = commits.length;
    const diffs = commitDiff(numOfCommits > 0 ? git.show().files : [], git.getAll());
    const renderedCommits = renderCommits(git, commits);

    container.attr('class', 'editor-section story');
    container.content(`
      ${ renderedCommits !== '' ? '<div data-export="list">' + renderedCommits + '</div>' : '' }
    `).forEach(el => {
        if (el.attr('data-export') === 'checkoutLink') {
          el.onClick(() => {
            const hashToCheckout = el.attr('data-hash');

            if (diffs.length > 0) {
              confirmPopUp(
                'Checkout',
                'You are about to checkout another commit. You have an unstaged changes. Are you sure?',
                decision => {
                  if (decision && allCommits[hashToCheckout]) {
                    git.checkout(hashToCheckout, true);
                    onChange();
                    render();
                  }
                }
              );
            } else {
              if (allCommits[hashToCheckout]) {
                git.checkout(hashToCheckout);
                onChange();
                render();
              }
            }
          });
        }
      });
  };

  state.listen(event => {
    render();
  });

  render();
}
