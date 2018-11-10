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
export const getSettings = async function (file) {
  try {
    const res = await fetch(file);
    return await res.json();
  } catch (error) {
    return { editor: { theme: 'material' }, resources: [] };
  }
}
export const loadResources = async function (settings) {
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
export const getDistFolderURL = function () {
  try {
    return [].slice.call(document.querySelectorAll('script[src]'))
      .map(({ src }) => src)
      .find(url => url.match('demoit.js'))
      .replace('demoit.js', '');
  } catch(error) {
    return './';
  }
}