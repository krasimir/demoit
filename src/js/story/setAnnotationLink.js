export default function setAnnotationLink(editor, code, list, activeFile) {
  let thingToInsert = code;

  try {
    let { line, ch } = editor.getCursor();
    const currentLine = editor.getValue().split('\n')[line];

    if (
      currentLine.charAt(ch) === ')' &&
      currentLine.charAt(ch - 1) === '(' &&
      currentLine.charAt(ch - 2) === ']'
    ) {
      let { anchor, head } = list.shift();

      thingToInsert = ['a', activeFile, anchor.line, head.line ].join(':');
    }
  } catch (error) {
    console.log('Error while setting annotation.');
  }

  editor.replaceSelection(thingToInsert);
}
