function createSVG() {
  return document.getElementById('svg-canvas');
}
function drawCircle(x, y, radius, color) {
  const svg = createSVG();
  const shape = document.createElementNS('http://www.w3.org/2000/svg', 'circle');

  shape.setAttributeNS(null, 'cx', x);
  shape.setAttributeNS(null, 'cy', y);
  shape.setAttributeNS(null, 'r', radius);
  shape.setAttributeNS(null, 'fill', color);
  svg.appendChild(shape);
}
function drawCurvedLine(x1, y1, x2, y2, color) {
  const svg = createSVG();
  const shape = document.createElementNS('http://www.w3.org/2000/svg', 'path');
  const hx1 = 40;
  const hy1 = y1 + 15;
  const hx2 = x2 + 15;
  const hy2 = y2;

  const path = 'M ' + x1 + ' ' + y1 + ' C ' + hx1 + ' ' + hy1 + ' ' + hx2 + ' ' + hy2 + ' ' + x2 + ' ' + y2;

  shape.setAttributeNS(null, 'd', path);
  shape.setAttributeNS(null, 'fill', 'none');
  shape.setAttributeNS(null, 'stroke', color);
  svg.appendChild(shape);
}
function connectCommits(x, y1, y2) {
  const color = '#999';

  drawCircle(x, y1, 3, color);
  drawCircle(x, y2, 3, color);
  drawCurvedLine(x, y1, x, y2, color);
};
function empty() {
  const e = createSVG();

  while (e.firstChild) {
    e.removeChild(e.firstChild);
  }
}

module.exports = {
  connectCommits: connectCommits,
  empty: empty
};
