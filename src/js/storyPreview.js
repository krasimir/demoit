/* eslint-disable max-len */
import el from './utils/element';

export default function (state) {
  if (!el.exists('#preview')) return;

  const container = el.withFallback('#preview');
  const git = state.git();
  const demoId = state.getDemoId();
  const preview = (input, hash, form) => {
    if (git.head() !== null) {
      input.prop('value', JSON.stringify(git.export()));
      hash.prop('value', git.head());
      form.e.submit();
    }
  };

  container.content(`
    <form data-export="form" action="/e/${ state.getDemoId() }/story.local" target="frame${ demoId }" method="post">
      <input type="hidden" data-export="input" name="git"/>
      <input type="hidden" data-export="hash" name="hash"/>
    </form>
    <iframe name="frame${ demoId }" src="" style="display: block; width:100%; height: 100%; border:0; overflow:hidden;" sandbox="allow-modals allow-forms allow-popups allow-scripts allow-same-origin allow-top-navigation-by-user-activation"/>
  `);

  const { form, input, hash } = container.namedExports();

  state.listen(event => {
    preview(input, hash, form);
  });

  preview(input, hash, form);
};
