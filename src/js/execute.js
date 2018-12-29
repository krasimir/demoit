import transpile from './utils/transpile';
import './utils/executeCSS';
import './utils/executeHTML';

const getExt = file => file.split(/\./).pop().toLowerCase();
const prepareExecution = ({ filename, content }) => {
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

export default function execute(index, allFiles) {
  try {
    const code = `
      const modules = [${ allFiles.map(prepareExecution).map(formatModule).join(',') }];
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
    const entryPoint = allFiles.findIndex(({ entryPoint }) => entryPoint === true);
    const fileToExecuteIndex = entryPoint >= 0 ? entryPoint : index;

    (new Function('index', transpiledCode))(fileToExecuteIndex);

    return transpiledCode;
  } catch (error) {
    console.error(error);
  }
}
