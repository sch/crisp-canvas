var { drawLine, drawLines } = require("..");

var GRAY = [100, 100, 100, 255];

var parameters = {
  height: { displayName: "height", type: "numeric", min: 10, max: 300, default: 30 },
  spacing: { displayName: "spacing", type: "numeric", min: 1, max: 50, default: 10 },
  density: { displayName: "column density", type: "numeric", min: 10, max: 50, default: 30 }
};

module.exports = { parameters, draw };

function draw(context, options) {
  var height = parseInt(options.height) || 30;
  var spacing = parseInt(options.spacing) || 10;
  var density = parseInt(options.density) || 30; // number of items per line
  var maxWidth = Math.floor(context.canvas.width / density) * 1.5; // the maximum width of a trapezoid
  var rowCount = Math.floor(context.canvas.height / (height + spacing));
  var lines = [];

  for (var rowIndex = 0; rowIndex < rowCount; rowIndex++) {
    for (var columnIndex = 0; columnIndex < density; columnIndex++) {
      var points = [];
      var startX =
        randomInteger(20) +
        Math.floor(context.canvas.width / density) * columnIndex;
      var yOffset = (height + spacing) * rowIndex + spacing;
      points.push({ x: startX, y: yOffset });
      points.push({ x: startX + randomInteger(maxWidth), y: yOffset });
      points.push({ x: startX + randomInteger(maxWidth), y: yOffset + height });
      points.push({ x: startX + randomInteger(maxWidth), y: yOffset + height });
      points.push({ x: startX, y: yOffset });
      lines = lines.concat(paths(points));
    }
  }

  drawLines(context, lines.map(line => colorize(line, GRAY)));
}

function randomInteger(max) {
  return Math.floor(Math.random() * max);
}

// given a list of points, return line objects representing the continuous path
// between them
function paths(points, lines = []) {
  if (points.length === 0) {
    return lines;
  }

  if (lines.length === 0) {
    const line = {
      start: points[0],
      end: points[1]
    };
    return paths(points.slice(2), lines.concat(line));
  } else {
    const line = {
      start: last(lines).end,
      end: points[0]
    };
    return paths(points.slice(1), lines.concat(line));
  }
}

function last(arr) {
  return arr[arr.length - 1];
}

function colorize(line, color) {
  line.color = color;
  return line;
}

