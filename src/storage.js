const CACHE = {};

const getCacheKey = (demoIdx, snippetIdx) => demoIdx + '_' + snippetIdx;

export const getDemoAndSnippetIdx = function () {
  const hash = window.location.hash;

  if (hash && hash.split(',').length === 2) {
    return hash.split(',')
      .map(value => value.replace('#', ''))
      .map(Number);
  }
  return [0, 0];
}
export const updateDemoAndSnippetIdx = function (demoIdx, snippetIdx) {
  window.location.hash = demoIdx + ',' + snippetIdx;
}
export const getCurrentSnippet = async function (settings) {
  const [ demoIdx, snippetIdx ] = getDemoAndSnippetIdx();

  if (settings.demos && settings.demos[demoIdx] && settings.demos[demoIdx].snippets && settings.demos[demoIdx].snippets[snippetIdx]) {
    const res = await fetch(settings.demos[demoIdx].snippets[snippetIdx]);
    return await res.text();    
  }
}
export const getSnippet = async function (settings) {
  const [ demoIdx, snippetIdx ] = getDemoAndSnippetIdx();
  const cacheKey = getCacheKey(demoIdx, snippetIdx);

  if (CACHE.hasOwnProperty(cacheKey)) return CACHE[cacheKey];

  if (settings.demos && settings.demos[demoIdx] && settings.demos[demoIdx].snippets && settings.demos[demoIdx].snippets[snippetIdx]) {
    const res = await fetch(settings.demos[demoIdx].snippets[snippetIdx]);
    return CACHE[cacheKey] = await res.text();    
  }
}
export const newSnippet = function (settings) {
  const [ demoIdx ] = getDemoAndSnippetIdx();

  if (!settings.demos) {
    settings.demos = [];
  }
  if (!settings.demos[demoIdx].snippets) {
    settings.demos[demoIdx].snippets = [];
  }

  const index = settings.demos[demoIdx].snippets.length;

  settings.demos[demoIdx].snippets.push(`code${ index }.js`);
  CACHE[getCacheKey(demoIdx, index)] = '';
  updateDemoAndSnippetIdx(demoIdx, index);

  return [ demoIdx, index ];
}
export const updateSnippetCache = function (code) {
  const [ demoIdx, snippetIdx ] = getDemoAndSnippetIdx();

  CACHE[getCacheKey(demoIdx, snippetIdx)] = code;
}