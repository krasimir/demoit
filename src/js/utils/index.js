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
export const getParam = (parameterName) => {
	var result = null, tmp = [];
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