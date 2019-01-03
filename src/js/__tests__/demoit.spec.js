const commitDiff = require('../utils/commitDiff');

describe('Given the Story commit diff helper', () => {
  describe('when giving the files of two commits', () => {
    it('should calculate the diff', () => {
      expect(commitDiff([
        [
          "code.js", { "c": "console.log('hello world');" }
        ]
      ],
      [
        [
          "code.js", { "c": "console.log('hello world aa');" }
        ]
      ])).toStrictEqual([]);
    });
  });
});