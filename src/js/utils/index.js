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
export const isLocalStorageAvailable = function () {
  const test = 'test';

  try {
    localStorage.setItem(test, test);
    localStorage.removeItem(test);
    return true;
  } catch(e) {
    return false;
  }
}
export const delay = async (amount = 1) => new Promise(done => setTimeout(done, amount));
export const once = callback => {
	let called = false;

	return (...args) => {
		if (called) return;
		called = true;
		callback(...args);
	}
}
export const getParam = (parameterName, defaultValue) => {
	var result = defaultValue, tmp = [];
	location.search
		.substr(1)
		.split("&")
		.forEach(function (item) {
			tmp = item.split("=");
			if (tmp[0] === parameterName) result = decodeURIComponent(tmp[1]);
		});
	return result;
}

export const readFromJSONFile = async function (file) {
  const res = await fetch(file);
  return await res.json();
}

export const removeParam = function (key, sourceURL) {
	const urlWithoutParams = sourceURL.split("?")[0];
	const hash = sourceURL.split('#')[1];
	const queryString = (sourceURL.indexOf('?') !== -1) ? sourceURL.split('?')[1] : '';
	let params = [];
	let param;

	if (queryString !== '') {
		params = queryString.split("&");
		for (let i = params.length - 1; i >= 0; i -= 1) {
			param = params[i].split('=')[0];
			if (param === key) {
				params.splice(i, 1);
			}
		}
		return urlWithoutParams + '?' + params.join('&') + (hash ? '#' + hash : '');
	}
	return urlWithoutParams;
}

export const isProd = () => {
	return window.location.href.match(/^http:\/\/demoit.app/);
}

export const ensureDemoIdInPageURL = demoId => {
	const currentURL = window.location.href;
	const hash = currentURL.split('#')[1];

	history.pushState(null, null, `${ demoId }${ hash ? '#' + hash : '' }`);
}
