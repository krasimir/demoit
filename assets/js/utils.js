const el = function (sel) { return document.querySelector(sel); };
const addStyleString = function (str) {
  const node = document.createElement('style');

  node.innerHTML = str;
  document.body.appendChild(node);
}
const addJSFile = function (path, done) {
  const node = document.createElement('script');

  node.src = path;
  node.addEventListener('load', done);
  document.body.appendChild(node);
}
const addCSSFile = function (path, done) {
  // const node = document.createElement('script');

  // node.src = path;
  // node.addEventListener('load', done);
  // document.body.appendChild(node);
}
const debounce = function (func, wait, immediate) {
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