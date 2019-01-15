/* eslint-disable no-new-func */
import transpile from './utils/transpile';

const getExt = file => file.split(/\./).pop().toLowerCase();
const prepareExecution = (filename, content) => {
  const ext = getExt(filename || '');

  if (ext === 'css' || ext === 'scss') {
    content = `window.executeCSS("${ filename }", ${ JSON.stringify(content) });`;
  } else if (ext === 'html') {
    content = `window.executeHTML("${ filename }", ${ JSON.stringify(content) });`;
  } else if (ext === 'md') {
    content = `window.executeMarkdown(${ JSON.stringify(content) });`;
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
    `;

    return {
      code: transpile(code),
      entryPoint
    };
  } catch (error) {
    console.error(error);
    return null;
  }
}
