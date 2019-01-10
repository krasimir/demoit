const gitfred = require('gitfred');

const git = gitfred();
const toDict = arr => arr.reduce((dict, file) => {
  dict[file[0]] = file[1].c;
  return dict;
}, {});

module.exports = function commitDiff(oldFiles, newFiles) {
  const diffs = [];
  const dictA = toDict(oldFiles);
  const dictB = toDict(newFiles);

  Object.keys(dictA).forEach(filename => {
    if (dictB.hasOwnProperty(filename)) {
      const strDiff = git.calcStrDiff(dictA[filename], dictB[filename]);

      if (strDiff !== null) {
        diffs.push(['E', filename, strDiff]);
      }
    } else {
      diffs.push(['D', filename, dictA[filename]]);
      Object.keys(dictB).forEach(filenameInB => {
        if (dictA[filename] === dictB[filenameInB]) {
          diffs.push(['R', filename, filenameInB]);
          delete dictB[filenameInB];
        }
      });
    }
  });
  Object.keys(dictB).forEach(filename => {
    if (!dictA.hasOwnProperty(filename)) {
      diffs.push(['N', filename, dictB[filename]]);
    }
  });

  return diffs;
};
