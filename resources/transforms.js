const preStyle = 'style="font-size:0.8em;line-height:1.2em;"';
const preStyleError = 'style="font-size:0.8em;line-height:1.2em;color:#9e0000;font-weight:bold;"';
const runJsCode = (code, onError) => {
  try {
    (new Function(code))()
  } catch(error) {
    onError(error);
  }
};

function babelToCode(code) {
  const babelOptions = {
    presets: [ "react", ["es2015", { "modules": false }]]
  }
  return `
    <pre style="${ preStyle }">${ Babel.transform(code, babelOptions).code }</pre>
  `;
}

function babelToConsole(code) {
  const babelOptions = {
    presets: [ "react", ["es2015", { "modules": false }]]
  }

  try {
    const transpiled = Babel.transform(code, babelOptions).code;
    const originalLog = console.log;
    const consoleOutput = [];
    
    console.log = what => consoleOutput.push(what);
    runJsCode(transpiled);
    console.log = originalLog;

    return consoleOutput.map(what => `<p>${ what }</p>`).join('');
  } catch (error) {
    return `<pre ${ preStyleError }>${ error.toString() + error.stack }</pre>`;
  }
}

function babelToReact(str) {
  const babelOptions = {
    presets: [ "react", ["es2015", { "modules": false }]]
  }
  const renderAppComponent = `
    if (typeof App === 'undefined') {
      App = function() { return 'Please define an <App> component.'; }
    }
    const output =  document.querySelector('.output');
    ReactDOM.render(React.createElement(App, null), document.querySelector('.output'));
  `;
  let code;
  let onError = error => {
    (new Function(`
      function App() {
        return React.createElement('pre', null, \`${ error.toString() + error.stack }\`);
      }
      ${ renderAppComponent }
    `))();
  }

  try {
    code = Babel.transform(str, babelOptions).code;
    runJsCode(code + renderAppComponent, onError);
  } catch(error) {
    onError(error);
  }
}