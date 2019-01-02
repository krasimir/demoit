import transpile from './utils/transpile';
import './utils/executeCSS';
import './utils/executeHTML';

const getExt = file => file.split(/\./).pop().toLowerCase();
const prepareExecution = (filename, content) => {
  const ext = getExt(filename || '');

  if (ext === 'css') {
    content = `imported && window.executeCSS("${ filename }", ${ JSON.stringify(content) });`;
  } else if (ext === 'html') {
    content = `imported && window.executeHTML("${ filename }", ${ JSON.stringify(content) });`;
  }

  return { filename, content };
}
const formatModule = ({ filename, content }) => `
  {
    filename: "${ filename }",
    func: function (require, exports, imported) {
      ${ transpile(content) }
    },
    exports: {}
  }
`;

export default function execute(activeFile, files) {
  const formattedFiles = [];
  let index = 0;
  let entryPoint = files.findIndex(([ filename ]) => filename === activeFile);

  files.forEach(([filename, file ]) => {
    formattedFiles.push(formatModule(prepareExecution(filename, file.c)));
    if (file.en === true) entryPoint = index;
    index += 1;
  });

  try {
    const code = `
      const modules = [${ formattedFiles.join(',') }];
      const require = function(file) {
        const module = modules.find(({ filename }) => filename === file);

        if (!module) {
          throw new Error('Demoit can not find "' + file + '" file.');
        }
        module.func(require, module.exports, true);
        return module.exports;
      };

      modules[index].func(require, modules[index].exports, false);
    `;
    
    const transpiledCode = transpile(code);

    (new Function('index', transpiledCode))(entryPoint);

    return transpiledCode;
  } catch (error) {
    console.error(error);
  }
}
