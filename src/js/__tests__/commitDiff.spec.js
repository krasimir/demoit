/* eslint-disable quotes */
const commitDiff = require('../utils/commitDiff');

describe('Given the Story commit diff helper', () => {
  describe('when giving the files of two commits', () => {
    [
      {
        A: [
          [ "code.js", { "c": "h" } ]
        ],
        B: [
          [ "code.js", { "c": "hi" } ]
        ],
        result: [
          [
            "E",
            "code.js",
            {
              "text": "@@ -1 +1,2 @@\n h\n+i\n",
              "html": "<span>h</span><ins>i</ins>"
            }
          ]
        ]
      },

      {
        A: [
          [ "code.js", { "c": "h" } ]
        ],
        B: [
          [ "code.js", { "c": "h" } ]
        ],
        result: []
      },

      {
        A: [
          [ "code.js", { "c": "h" } ],
          [ "a.js", { "c": "b" } ]
        ],
        B: [
          [ "code.js", { "c": "h" } ],
          [ "b.js", { "c": "d" } ]
        ],
        result: [
          [
            "D", "a.js", "b"
          ],
          [
            "N", "b.js", "d"
          ]
        ]
      },

      {
        A: [
          [ "code.js", { "c": "h" } ],
          [ "a.js", { "c": "b" } ]
        ],
        B: [
          [ "code.js", { "c": "h" } ],
          [ "b.js", { "c": "b" } ]
        ],
        result: [
          [
            "D", "a.js", "b"
          ],
          [
            "R", "a.js", "b.js"
          ]
        ]
      },

      {
        A: [
          [ "code.js", { "c": "" } ]
        ],
        B: [
          [ "code.js", { "c": "" } ]
        ],
        result: []
      }
    ].forEach((testCase, i) => {
      it('should calculate the diff #' + (i + 1), () => {
        // if (i == 3) console.log(JSON.stringify(commitDiff(testCase.A, testCase.B), null, 2));
        expect(commitDiff(testCase.A, testCase.B)).toStrictEqual(testCase.result);
      });
    });
  });
});
