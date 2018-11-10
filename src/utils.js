export const el = function (sel) { return document.querySelector(sel); };
export const addStyleString = function (str) {
  const node = document.createElement('style');

  node.innerHTML = str;
  document.body.appendChild(node);
}
export const addScriptString = function (str) {
  const node = document.createElement('script');

  node.innerHTML = str;
  document.body.appendChild(node);
}
export const addJSFile = function (path, done) {
  const node = document.createElement('script');

  node.src = path;
  node.addEventListener('load', done);
  document.body.appendChild(node);
}
export const addCSSFile = function (path, done) {
	// <link rel="stylesheet" type="text/css" href="./assets/css/styles.css" />
  const node = document.createElement('link');

  node.setAttribute('rel', 'stylesheet');
  node.setAttribute('type', 'text/css');
  node.setAttribute('href', path);
  node.addEventListener('load', done);
  document.body.appendChild(node);
}
export const debounce = function (func, wait, immediate) {
	var timeout;
	return function() {
		var context = this, args = arguments;
		var later = function() {
			timeout = null;
			if (!immediate) func.apply(context, args);
		};
		var callNow = immediate && !timeout;
		clearTimeout(timeout);
		timeout = setTimeout(later, wait);
		if (callNow) func.apply(context, args);
	};
};
export const getDemoAndSnippetIdx = function () {
  const hash = window.location.hash;

  if (hash && hash.split(',').length === 2) {
    return hash.split(',')
      .map(value => value.replace('#', ''))
      .map(Number);
  }
  return [0, 0];
}
export const getSettings = async function (file) {
  try {
    const res = await fetch(file);
    return await res.json();
  } catch (error) {
    return { editor: { theme: 'material' }, resources: [] };
  }
}
export const getResources = async function (settings) {
  return Promise.all(
    settings.resources.map(resource => {
      return new Promise(done => {
        const extension = resource.split('.').pop().toLowerCase();

        if (extension === 'js') {
          addJSFile(resource, done)
        } else if (extension === 'css') {
          addCSSFile(resource);
          done();
        } else {
          done();
        }
      });
    })
  );
}
export const basename = function (path) {
  return path.split('/').reverse()[0];
}
export const cleanOutput = function () {
  document.querySelector('.output').innerHTML = '';
}
export const getCurrentSnippet = async function (settings) {
  const [ demoIdx, snippetIdx ] = getDemoAndSnippetIdx();

  if (settings.demos && settings.demos[demoIdx] && settings.demos[demoIdx].snippets && settings.demos[demoIdx].snippets[snippetIdx]) {
    const res = await fetch(settings.demos[demoIdx].snippets[snippetIdx]);
    return await res.text();    
  }
}
const snippetsCache = {};
export const getSnippet = async function (settings, demoIdx, snippetIdx) {
  const cacheKey = demoIdx + '_' + snippetIdx;

  if (snippetsCache[cacheKey]) return snippetsCache[cacheKey];

  if (settings.demos && settings.demos[demoIdx] && settings.demos[demoIdx].snippets && settings.demos[demoIdx].snippets[snippetIdx]) {
    const res = await fetch(settings.demos[demoIdx].snippets[snippetIdx]);
    return snippetsCache[cacheKey] = await res.text();    
  }
}