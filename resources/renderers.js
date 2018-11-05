const babelOptions = {
  presets: [ "react", ["es2015", { "modules": false }]]
}
const runJsCode = (code, onError) => {
  try {
    (new Function(code))()
  } catch(error) {
    onError(error);
  }
};

function babelToCode(code, outputElement) {
  outputElement.innerHTML = `
    <pre>${ Babel.transform(code, babelOptions).code }</pre>
  `;
}

function babelToConsole(code, outputElement) {
  const onError = error => {
    outputElement.innerHTML = `<pre>${ error.toString() + error.stack }</pre>`
  }

  try {
    const transpiled = Babel.transform(code, babelOptions).code;
    const originalLog = console.log;
    const consoleOutput = [];
    
    console.log = what => consoleOutput.push(what);
    runJsCode(transpiled, onError);
    console.log = originalLog;

    outputElement.innerHTML = consoleOutput.map(what => `<p>${ what }</p>`).join('');
  } catch (error) {
    onError(error);
  }
}

function babelToReact(str, outputElement) {
  const renderAppComponent = `
    if (typeof App === 'undefined') {
      App = function() { return 'Please define an <App> component.'; }
    }
    ReactDOM.render(React.createElement(App, null), outputElement);
  `;
  let code;
  let onError = error => {
    (new Function('outputElement', `
      function App() {
        return React.createElement('pre', null, \`${ error.toString() + error.stack }\`);
      }
      ${ renderAppComponent }
    `))(outputElement);
  }

  try {
    code = Babel.transform(str, babelOptions).code;
    (new Function('outputElement', code + renderAppComponent))(outputElement);
  } catch(error) {
    onError(error);
  }
}