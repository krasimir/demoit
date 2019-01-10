/* eslint-disable no-undef */
import { load as loadDependencies, cache } from './dependencies';

const ZIP_FILE = '/poet.codes.zip';

async function fetchRawFile(url, blob = false) {
  return {
    content: await (await fetch(url))[ blob ? 'blob' : 'text'](),
    url
  };
}
async function fetchRemoteDependencies() {
  const depsToLoad = Object.keys(cache());

  return await Promise.all(
    depsToLoad
      .filter(url => url.match(/^(http|https)/))
      .map(fetchRawFile)
  );
}

export default function download(state) {
  return async button => {
    button
      .prop('disabled', 'disabled')
      .prop('innerHTML', 'Please wait. Preparing the zip file.');

    try {
      const remoteDeps = await fetchRemoteDependencies();

      await loadDependencies(['./resources/jszip.min.js', './resources/FileSaver.min.js']);

      const zip = await JSZip.loadAsync((await fetchRawFile(ZIP_FILE, true)).content);

      button
        .prop('disabled', false)
        .prop('innerHTML', 'Download poet.code.zip');
      button.onClick(async () => {
        const indexFile = await zip.file('index.html').async('string');
        const newState = JSON.parse(JSON.stringify(state.dump()));

        newState.dependencies = remoteDeps.map(({ content, url }) => {
          const fileName = './resources/' + url.split('/').pop();

          zip.file(fileName, content);
          return fileName;
        });
        zip.file('index.html', indexFile.replace('var state = null;', `var state = ${ JSON.stringify(newState) };`));
        saveAs(await zip.generateAsync({ type: 'blob' }), 'poet.code.zip');
      });

    } catch (error) {
      console.error(error);
      button.prop('innerHTML', 'There is an error creating the zip file.');
    }
  };
};
