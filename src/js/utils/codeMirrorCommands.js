function isSelectedRange(ranges, from, to) {
  for (var i = 0; i < ranges.length; i++)
    if (ranges[i].from() == from && ranges[i].to() == to) return true
  return false
}

export default function (CodeMirror) {
  const cmds = CodeMirror.commands;
  const Pos = CodeMirror.Pos;

  cmds.selectNextOccurrence = function(cm) {
    var from = cm.getCursor("from"), to = cm.getCursor("to");
    var fullWord = cm.state.sublimeFindFullWord == cm.doc.sel;
    if (CodeMirror.cmpPos(from, to) == 0) {
      var word = wordAt(cm, from);
      if (!word.word) return;
      cm.setSelection(word.from, word.to);
      fullWord = true;
    } else {
      var text = cm.getRange(from, to);
      var query = fullWord ? new RegExp("\\b" + text + "\\b") : text;
      var cur = cm.getSearchCursor(query, to);
      var found = cur.findNext();
      if (!found) {
        cur = cm.getSearchCursor(query, Pos(cm.firstLine(), 0));
        found = cur.findNext();
      }
      if (!found || isSelectedRange(cm.listSelections(), cur.from(), cur.to()))
        return CodeMirror.Pass
      cm.addSelection(cur.from(), cur.to());
    }
    if (fullWord)
      cm.state.sublimeFindFullWord = cm.doc.sel;
  };

  cmds.toggleCommentIndented = function(cm) {
    cm.toggleComment({ indent: true });
  }
}