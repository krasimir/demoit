/* eslint-disable no-use-before-define */

export default function renderDiffs(git, diffs) {
  if (diffs.length === 0) {
    return `
      <div class="working-directory">
        <div class="clear commit-buttons-nav">
          <a href="javascript:void(0)" data-export="addButton" class="commit-button left">
            &#10004; New commit
          </a>
        </div>
      </div>
    `;
  }
  return `
    <div class="working-directory">
      <div class="diffs">
        ${diffs.map(renderDiff).join('')}
      </div>
      <div class="clear commit-buttons-nav">
        ${ git.head() !== null ? `<a href="javascript:void(0)" data-export="editButton" class="commit-button left">
          &#10004; Save
        </a>` : '' }
        <a href="javascript:void(0)" data-export="addButton" class="commit-button left">
          &#10004; New commit
        </a>
        ${
          git.getAll().length > 0 && git.head() !== null ?
            `<a href="javascript:void(0)" data-export="discardButton" class="commit-button right">
            &#10006; Discard changes
          </a>` :
            ''
        }
      </div>
    </div>
  `;
};
function renderDiff(diff) {
  let diffChangeLabel = '';
  let diffAdditionalInfo = '';

  switch (diff[0]) {
    case 'E':
      diffChangeLabel = 'edit';
      diffAdditionalInfo = diff[2].html;
      break;
    case 'N':
      diffChangeLabel = 'new';
      break;
    case 'D':
      diffChangeLabel = 'deleted';
      break;
    case 'R':
      diffChangeLabel = 'renamed';
      diffAdditionalInfo = diff[2];
      break;
  }
  return `
    <div class="diff">
      <div><span class="label label-${diff[0]}">${diffChangeLabel}</span></div>
      <div class="diffA">${diff[1]}</div>
      <div class="diffB">${diffAdditionalInfo}</div>
    </div>
  `;
}
