/* eslint-disable max-len, no-use-before-define, no-sequences, no-undef */
import el from './utils/element';
import { load as loadDependencies } from './dependencies';
import cleanUpMarkdown from './utils/cleanUpMarkdown';
import { escapeHTML } from './utils';

const filesRegExp = new RegExp('{file:(.*)}', 'g');

export default async function reader(state, onChange) {
  const container = el.withFallback('.reader');
  const git = state.git();
  let renderedCommits = [];

  if (!container.found()) return;

  await loadDependencies(['./resources/marked@0.3.6.js']);

  const markedRenderer = new marked.Renderer();

  markedRenderer.code = function (code, language, escaped) {
    return `<pre data-lang="${ language }"><code>${ escapeHTML(code) }</code></pre>`;
  };

  function render() {
    const allCommits = git.log();
    const { name, description } = state.meta();
    const html = Object.keys(allCommits)
      .filter(hash => allCommits[hash].meta && parseInt(allCommits[hash].meta.position, 10) > 0)
      .map(hash => {
        const commit = allCommits[hash];
        const firstLine = cleanUpMarkdown(commit.message.split('\n').shift());

        return {
          position: parseInt(commit.meta.position, 10),
          title: firstLine,
          message: marked(commit.message, { renderer: markedRenderer }),
          hash: hash
        };
      })
      .sort((a, b) => a.position - b.position)
      .reduce((result, commit) => {
        result += `
          <div class="reader-commit" data-export="checkoutLink" data-commit-hash="${ commit.hash }">
            <div class="reader-story">
              ${ replaceFilesInMessage(marked(commit.message), git, commit.hash) }
            </div>
          </div>
        `;
        return result;
      }, '');

    renderedCommits = [];

    container.empty().content(`
      <div class="reader-content">
        <div class="reader-commit reader-header">
          <h1>${ name ? name : 'Unnamed' }</h1>
          ${ description ? `<p>${ marked(description) }</p>` : '' }
        </div>
        ${ html }
      </div>
    `).forEach(el => {
      if (el.attr('data-export') === 'checkoutLink') {
        renderedCommits.push(el);
        el.onMouseOver(() => {
          if (git.head() !== el.attr('data-commit-hash')) {
            git.checkout(el.attr('data-commit-hash'), true);
            onChange();
          }
        });
      }
    });

    [].slice.call(container.e.querySelectorAll('pre')).forEach(node => {
      CodeMirror.colorize([node], null, state.getEditorSettings().theme === 'dark' ? 'cm-s-dark' : undefined);
    });
    setActiveCommit();
  }
  function setActiveCommit() {
    renderedCommits.forEach(el => {
      el.find('.reader-story').attr('class', 'reader-story' + (el.attr('data-commit-hash') === git.head() ? ' selected' : ''));
    });
  }

  state.listen(event => {
    if (event === git.ON_COMMIT) {
      render();
    } else if (event === git.ON_CHECKOUT) {
      setActiveCommit();
    }
  });

  render();
}
function replaceFilesInMessage(message, git, hash) {
  let commit;

  return message.replace(filesRegExp, (match, capture) => {
    if (!commit) {
      commit = git.show(hash);
      commit.files = commit.files.reduce((result, f) => {
        result[f[0]] = f[1];
        return result;
      }, {});
    }
    if (commit.files[capture]) {
      return formatCodeSnippet(capture, commit.files[capture].c);
    }
    return match;
  });
};
function formatCodeSnippet(filename, content) {
  const ext = filename.split('.').pop().toLowerCase();
  let lang = ext;

  if (lang === 'js') {
    lang = 'jsx';
  }

  return `<pre data-lang="${ lang }"><code>${ escapeHTML(content) }</code></pre>`;
}
