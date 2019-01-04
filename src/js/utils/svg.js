function createSVG() {
  return document.getElementById("svg-canvas");
}
function drawCircle(x, y, radius, color) {
  const svg = createSVG();
  const shape = document.createElementNS("http://www.w3.org/2000/svg", "circle");

  shape.setAttributeNS(null, "cx", x);
  shape.setAttributeNS(null, "cy", y);
  shape.setAttributeNS(null, "r",  radius);
  shape.setAttributeNS(null, "fill", color);
  svg.appendChild(shape);
}
function drawCurvedLine(x1, y1, x2, y2, color) {
  const svg = createSVG();
  const shape = document.createElementNS("http://www.w3.org/2000/svg", "path");
  const hx1 = 0.8;
  const hy1 = y1 + getRandomArbitrary(0, 30);
  const hx2 = x2 - getRandomArbitrary(0, 30);
  const hy2 = y2;

  const path = "M "  + x1 + " " + y1 + " C " + hx1 + " " + hy1 + " "  + hx2 + " " + hy2 + " " + x2 + " " + y2;

  shape.setAttributeNS(null, "d", path);
  shape.setAttributeNS(null, "fill", "none");
  shape.setAttributeNS(null, "stroke", color);
  svg.appendChild(shape);
}
function randDarkColor() {
  var lum = -0.25;
  var hex = String('#' + Math.random().toString(16).slice(2, 8).toUpperCase()).replace(/[^0-9a-f]/gi, '');
  if (hex.length < 6) {
      hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
  }
  var rgb = "#",
      c, i;
  for (i = 0; i < 3; i++) {
      c = parseInt(hex.substr(i * 2, 2), 16);
      c = Math.round(Math.min(Math.max(0, c + (c * lum)), 255)).toString(16);
      rgb += ("00" + c).substr(c.length);
  }
  return rgb;
}
function getRandomArbitrary(min, max) {
  return Math.random() * (max - min) + min;
}
module.exports = function connectCommits(x, y1, y2) {
  const color = randDarkColor();

  drawCircle(x, y1, 3, color);
  drawCircle(x, y2, 3, color);
  drawCurvedLine(x, y1, x, y2, color);
}