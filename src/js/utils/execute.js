import transpile from './transpile';

export function execute(index, allFiles) {
  try {
    const transpiledFiles = allFiles.map(({ filename, content }) => `
      {
        filename: "${ filename }",
        func: function (require, exports) {
          ${ transpile(content) }
        },
        exports: {}
      }
    `);
    const code = `
      const modules = [${ transpiledFiles.join(',') }];
      const require = function(file) {
        const module = modules.find(({ filename }) => filename === file);

        if (!module) {
          throw new Error('Demoit can not find "' + file + '" file.');
        }
        module.func(require, module.exports);
        return module.exports;
      };
      modules[${ index }].func(require, modules[${ index }].exports);
    `;

    (new Function(transpile(code)))();
  } catch (error) {
    console.error(error);
  }
}
