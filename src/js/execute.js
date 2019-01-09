/* eslint-disable no-new-func */
import transpile from './utils/transpile';
import './utils/executeCSS';
import './utils/executeHTML';

const getExt = file => file.split(/\./).pop().toLowerCase();
const prepareExecution = (filename, content) => {
  const ext = getExt(filename || '');

  if (ext === 'css') {
    content = `window.executeCSS("${ filename }", ${ JSON.stringify(content) });`;
  } else if (ext === 'html') {
    content = `window.executeHTML("${ filename }", ${ JSON.stringify(content) });`;
  }

  return { filename, content };
};
const formatModule = ({ filename, content }) => `
  {
    filename: "${ filename }",
    func: function (require, exports) {
      ${ transpile(content) }
    },
    exports: {}
  }
`;

export default function execute(activeFile, files) {
  const formattedFiles = [];
  let index = 0;

  try {
    let entryPoint = files.findIndex(([ filename ]) => filename === activeFile);

    files.forEach(([filename, file ]) => {
      formattedFiles.push(formatModule(prepareExecution(filename, file.c)));
      if (file.en === true) entryPoint = index;
      index += 1;
    });

    const code = `
      const cleanUpCSS = function() {
        modules.forEach(function (module) {
          if (module.filename.split('.').pop().toLowerCase() === 'css' && imported.indexOf(module.filename) === -1) {
            cleanUpExecutedCSS(module.filename);
          }
        });
      }
      const imported = [];
      const modules = [${ formattedFiles.join(',') }];
      const require = function(file) {
        const module = modules.find(({ filename }) => filename === file);

        if (!module) {
          throw new Error('Can not find "' + file + '" file.');
        }
        imported.push(file);
        module.func(require, module.exports);
        return module.exports;
      };

      modules[index].func(require, modules[index].exports);
      cleanUpCSS();
    `;

    const transpiledCode = transpile(code);

    (new Function('index', transpiledCode))(entryPoint);

    return transpiledCode;
  } catch (error) {
    console.error(error);
    return null;
  }
}
