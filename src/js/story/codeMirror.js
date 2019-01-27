/* eslint-disable no-sequences */

import defineCodeMirrorCommands from '../utils/codeMirrorCommands';

export default function codeMirror(container, editorSettings, value, onSave, onChange, onCancel) {
  defineCodeMirrorCommands(CodeMirror);

  const editor = CodeMirror(container.e, {
    value: value || '',
    mode: 'gfm',
    tabSize: 2,
    lineNumbers: false,
    autofocus: true,
    foldGutter: false,
    gutters: [],
    styleSelectedText: true,
    lineWrapping: true,
    highlightFormatting: true,
    ...editorSettings
  });
  const save = () => onSave(editor.getValue());
  const change = () => onChange(editor.getValue());

  editor.on('change', change);
  editor.setOption('extraKeys', {
    'Ctrl-S': save,
    'Cmd-S': save,
    Esc: () => onCancel(editor.getValue()),
    'Ctrl-Enter': () => (save(), onCancel(editor.getValue())),
    'Cmd-Enter': () => (save(), onCancel(editor.getValue()))
  });
  CodeMirror.normalizeKeyMap();
  setTimeout(() => editor.focus(), 50);

  return editor;
}
