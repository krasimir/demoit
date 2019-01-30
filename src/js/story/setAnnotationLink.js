export default function setAnnotationLink(editor, code, list, activeFile) {
  let thingToInsert = '';

  try {
    let { line, ch } = editor.getCursor();
    const currentLine = editor.getValue().split('\n')[line];

    if (
      currentLine.charAt(ch) === ')' &&
      currentLine.charAt(ch - 1) === '(' &&
      currentLine.charAt(ch - 2) === ']'
    ) {
      let { anchor, head } = list.shift();

      thingToInsert = ['a', activeFile, anchor.line, anchor.ch, head.line, head.ch ].join(':');
    } else if (
      currentLine.charAt(ch - 1) === '' &&
      currentLine.charAt(ch + 1) === ''
    ) {
      thingToInsert = code;
    }
  } catch (error) {
    console.log('Error while setting annotation.');
  }

  editor.replaceSelection(thingToInsert);
}
