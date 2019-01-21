/* eslint-disable max-len */
import el from './utils/element';

export default function (state) {
  if (!el.exists('#preview')) return;

  const container = el.withFallback('#preview');
  const git = state.git();
  const demoId = state.getDemoId();
  const preview = (input, form) => {
    if (git.head() !== null) {
      input.prop('value', JSON.stringify(git.show()));
      form.e.submit();
    }
  };

  container.content(`
    <form data-export="form" action="/e/${ state.getDemoId() }/story.local" target="frame${ demoId }" method="post">
      <input type="hidden" data-export="input" name="message"/>
    </form>
    <iframe name="frame${ demoId }" src="" style="display: block; width:100%; height: 100%; border:0; overflow:hidden;" sandbox="allow-modals allow-forms allow-popups allow-scripts allow-same-origin allow-top-navigation-by-user-activation"/>
  `);

  const { form, input } = container.namedExports();

  state.listen(event => {
    preview(input, form);
  });

  preview(input, form);
};
