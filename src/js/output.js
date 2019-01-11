import el from './utils/element';

var m = 0;
const markers = {};
const DEFAULT_HINT = '<div class="centered">&lt;div id="output" /&gt;</div>';
const createMessageSender = (iframe, addToConsole) => {
  window.onmessage = function (e) {
    if (e.data.marker) {
      // console.log('<-- ' + e.data.marker);
      if (markers[e.data.marker]) {
        markers[e.data.marker].done();
        delete markers[e.data.marker];
      }
    } else if (e.data.log) {
      addToConsole(e.data.log);
    }
  };
  return (op, value, customMarker = null) => {
    const markerId = ++m;

    return new Promise(done => {
      markers[customMarker ? customMarker : markerId] = { done, op, value };
      if (iframe.e.contentWindow) {
        iframe.e.contentWindow.postMessage({
          op,
          value,
          marker: markerId
        });
      }
    });
  };
};

export default async function output(state, addToConsole) {
  const output = el.withFallback('.output');
  const iframe = output.find('#sandbox');
  const sendMessage = createMessageSender(iframe, addToConsole);
  let animInterval;

  iframe.css('opacity', 0);

  return {
    setOutputHTML: async function clearOutput(hintValue = DEFAULT_HINT) {
      return sendMessage('html', hintValue);
    },
    resetOutput: async function () {
      return new Promise(done => {
        iframe.css('opacity', 0);
        clearTimeout(animInterval);
        animInterval = setTimeout(async () => {
          await sendMessage('reload', null, 'loaded');
          done();
          iframe.css('opacity', 1);
        }, 300);
      });
    },
    loadDependenciesInOutput: async function () {
      return sendMessage('dependencies', state.getDependencies());
    },
    executeInOut: async function (value) {
      return sendMessage('code', value);
    }
  };
}
