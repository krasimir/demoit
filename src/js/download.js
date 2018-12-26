import { load as loadDependencies, cache } from './dependencies';

const ZIP_FILE = '/demoit.zip';

async function fetchRawFile(url, blob = false) {
  return {
    content: await (await fetch(url))[ blob ? 'blob' : 'text'](),
    url
  }
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
      
      await loadDependencies(['./resources/jszip.min.js']);
      
      const zip = await JSZip.loadAsync((await fetchRawFile(ZIP_FILE, true)).content);

      zip.forEach(r => console.log(r));
      

    } catch(error) {
      console.error(error);
      button.prop('innerHTML', 'There is an error creating the zip file.')
    }
  }
};
