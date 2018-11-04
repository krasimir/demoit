const preStyle = 'style="font-size:0.8em;line-height:1.2em;"';
const preStyleError = 'style="font-size:0.8em;line-height:1.2em;color:#9e0000;font-weight:bold;"';

function babelToCode(code) {
  const babelOptions = {
    presets: [ "react", ["es2015", { "modules": false }]]
  }
  return `
    <pre style="${ preStyle }">${ Babel.transform(code, babelOptions).code }</pre>
  `;
}

function babelToExecutedCodeConsole(code) {
  const babelOptions = {
    presets: [ "react", ["es2015", { "modules": false }]]
  }

  try {
    const transpiled = Babel.transform(code, babelOptions).code;
    const func = new Function(transpiled);
    const originalLog = console.log;
    const consoleOutput = [];
    
    console.log = what => consoleOutput.push(what);
    func();
    console.log = originalLog;

    return consoleOutput.map(what => `<p>${ what }</p>`).join('');
  } catch (error) {
    return `<pre ${ preStyleError }>${ error.toString() + error.stack }</pre>`;
  }
}

function babelToReact(code) {
  const babelOptions = {
    presets: [ "react", ["es2015", { "modules": false }]]
  }

  try {
    const transpiled = Babel.transform(code, babelOptions).code;
    const additionalCode = `
      if (typeof App === 'undefined') {
        throw new Error('Please define an &lt;App> component.');
      }
      const output =  document.querySelector('.output');
      output.innerHTML = '';
      ReactDOM.render(React.createElement(App, null), document.querySelector('.output'));
    `;
    console.log(transpiled + additionalCode);
    const func = new Function(transpiled + additionalCode);
    
    func();
  } catch (error) {
    return `<pre ${ preStyleError }>${ error.toString() + error.stack }</pre>`;
  }
}