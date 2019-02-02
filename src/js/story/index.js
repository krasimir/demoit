/* eslint-disable max-len, no-use-before-define, no-sequences, no-undef */
import el from '../utils/element';
import commitDiff from '../utils/commitDiff';
import { formatDate } from '../utils';
import confirmPopUp from '../popups/confirmPopUp';
import { DEBUG } from '../constants';
import setAnnotationLink from './setAnnotationLink';
import renderCommits from './renderCommits';
import getTitleFromCommitMessage from './getTitleFromCommitMessage';
import renderDiffs from './renderDiffs';
import codeMirror from './codeMirror';
import renderGraph from './renderGraph';

export default function story(state, onChange) {
  const container = el.withFallback('.story');
  const git = state.git();
  let editor = null,
    editMode = false,
    currentlyEditingHash;
  const onSave = message => git.amend(currentlyEditingHash, { message });
  const onCancel = message => {
    editMode = false;
    editor = null;
    if (message === '') {
      git.amend(currentlyEditingHash, {
        message: formatDate()
      });
    }
    render();
  };

  if (!container.found()) return () => {};

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
    const renderedCommits = renderCommits(git, commits, editMode, currentlyEditingHash);

    container.attr('class', numOfCommits <= 1 || editMode ? 'editor-section story no-graph' : 'editor-section story');
    container.content(`
      ${ renderedCommits !== '' ? '<div data-export="list">' + renderedCommits + '</div>' : '' }
      ${ editMode ? '' : renderDiffs(git, diffs) }
      <div class="story-arrows"><svg id="svg-canvas" width="32px" height="100%"></svg></div>
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
        if (el.attr('data-export') === 'editMessage') {
          el.onClick(() => {
            const hash = el.attr('data-hash');

            if (editMode && currentlyEditingHash === hash) {
              editMode = false;
              onCancel();
            } else {
              editMode = true;
              currentlyEditingHash = el.attr('data-hash');
              render();
            }
          });
        }
        if (el.attr('data-export') === 'deleteCommit') {
          el.onClick(() => {
            confirmPopUp(
              'Deleting a commit',
              `Deleting "${el.attr('data-commit-message')}" commit. Are you sure?`,
              decision => {
                if (decision) {
                  editMode = false;
                  git.adios(el.attr('data-hash'));
                  onChange();
                }
              }
            );
          });
        }
        if (el.attr('data-export') === 'publishStatus') {
          el.onChange(position => {
            const hash = el.attr('data-hash');

            git.amend(hash, {
              message: git.show(hash).message,
              meta: { position }
            });
            render();
          });
        }
      });

    const {
      editButton,
      addButton,
      discardButton,
      messageArea,
      confirmButton,
      injector
    } = container.namedExports();

    editButton &&
      editButton.onClick(() => {
        git.amend();
        render();
      });

    addButton &&
      addButton.onClick(() => {
        editMode = true;
        git.add();
        currentlyEditingHash = git.commit('');
        render();
      });

    discardButton &&
      discardButton.onClick(() => {
        confirmPopUp('Discard changes', 'You are about to discard your current changes. Are you sure?', decision => {
          if (decision) {
            git.discard();
            onChange();
          }
        });
      });

    if (messageArea) {
      editor = codeMirror(
        messageArea,
        state.getEditorSettings(),
        git.show(currentlyEditingHash).message,
        function onSaveInEditor(message) {
          confirmButton.css('opacity', '0.3');
          onSave(message);
          el.withFallback(`[data-hash="${ currentlyEditingHash }"] > .commit-message-text`)
            .text(getTitleFromCommitMessage(message));
        },
        function onChange() {
          confirmButton.css('opacity', '1');
          numOfCommits > 1 && renderGraph(commits, git.logAsTree());
        },
        onCancel
      );
      confirmButton.css('opacity', '0.3');
      confirmButton.onClick(() => {
        onSave(editor.getValue());
        editMode = false;
        editor = null;
        render();
      });
      injector.onChange(str => {
        setTimeout(() => {
          editor.focus();
          editor.refresh();
          editor.replaceSelection(str);
          injector.e.value = '';
        }, 1);
      });
    }

    numOfCommits > 1 && renderGraph(commits, git.logAsTree());
  };

  state.listen(event => {
    if (!editMode) render();
  });

  render();

  return function addToStory({ code, list }, otherEditor) {
    if (editMode && editor) {
      otherEditor.setCursor({ line: 0, ch: 0 });
      setTimeout(() => {
        editor.focus();
        editor.refresh();

        setAnnotationLink(editor, code, list, state.getActiveFile());
      }, 1);
    }
  };
}
