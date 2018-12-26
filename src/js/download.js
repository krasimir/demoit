import { load as loadDependencies, cache } from './dependencies';

async function fetchRemoteDependencies() {
  const depsToLoad = Object.keys(cache());

  return await Promise.all(
    depsToLoad
      .filter(url => url.match(/^(http|https)/))
      .map(async url => ({
        content: await (await fetch(url)).text(),
        url: url
      })
  ));
}

export default function download(state) {
  return async button => {
    button
      .prop('disabled', 'disabled')
      .prop('innerHTML', 'Please wait. Preparing the zip file.');
    
      
    try {
      const remoteDeps = await fetchRemoteDependencies();
      
      await loadDependencies(['./resources/jszip.min.js']);
      
      
    } catch(error) {
      console.error(error);
      button.prop('innerHTML', 'There is an error creating the zip file.')
    }
  }
};
