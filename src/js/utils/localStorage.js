const AVAILABLE = (function () {
  const test = 'test';

  try {
    localStorage.setItem(test, test);
    localStorage.removeItem(test);
    return true;
  } catch(e) {
    return false;
  }
})();

const LS = function (key, value) {
  if (!AVAILABLE) return null;

  // setting
  if (typeof value !== 'undefined') {
    localStorage.setItem(key, JSON.stringify(value));
  }

  // reading
  const data = localStorage.getItem(key);

  try {
    if (data) return JSON.parse(data);
  } catch(error) {
    console.error(`There is some data in the local storage under the ${ key } key. However, it is not a valid JSON.`);
  }
  return null
}

export default LS;