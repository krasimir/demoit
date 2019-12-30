/* eslint-disable no-undef */
import { load as loadDependencies } from './dependencies';
import { clone } from './utils';

const ZIP_FILE = '/poet.krasimir.now.sh.zip';

async function fetchRawFile(url, blob = false) {
  return {
    content: await (await fetch(url))[ blob ? 'blob' : 'text'](),
    url
  };
}
async function fetchRemoteDependencies(depsToLoad) {
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
      const remoteDeps = await fetchRemoteDependencies(state.getDependencies());

      await loadDependencies(['./resources/jszip.min.js', './resources/FileSaver.min.js']);

      const zip = await JSZip.loadAsync((await fetchRawFile(ZIP_FILE, true)).content);

      button
        .prop('disabled', false)
        .prop('innerHTML', 'Download poet.krasimir.now.sh.zip');
      button.onClick(async () => {
        const indexFile = await zip.file('index.html').async('string');
        const newState = clone(state.dump());

        newState.dependencies = remoteDeps.map(({ content, url }) => {
          const fileName = './resources/' + url.split('/').pop();

          zip.file(fileName, content);
          return fileName;
        });
        zip.file('index.html', indexFile.replace('var state = null;', `var state = ${ JSON.stringify(newState, null, 2) };`));
        saveAs(await zip.generateAsync({ type: 'blob' }), 'poet.krasimir.now.sh.zip');
      });

    } catch (error) {
      console.error(error);
      button.prop('innerHTML', 'There is an error creating the zip file.');
    }
  };
};
