var { drawLine, drawLines } = require("..");
var random = require("./random");

var GRAY = [100, 100, 100, 255];

var parameters = {
  size: {
    displayName: "size (pixels)",
    type: "numeric",
    min: 10,
    max: 300,
    default: 100
  },
  iterations: {
    displayName: "number of iterations",
    type: "numeric",
    min: 4,
    max: 50,
    default: 10
  }
};

module.exports = { parameters, draw };

function draw(context, options) {
  var size = parseInt(options.size) || 100;
  var iterations = parseInt(options.iterations) || 30;
  var allLines = grid(context.canvas, size, function() {
    return rose(size, iterations);
  });
  drawLines(context, allLines);
}

function rose(size, count) {
  var points = [];

  var bounds = [
    { x: 0, y: 0 }, // top-left
    { x: size, y: 0 }, // top-right
    { x: size, y: size }, // bottom-right
    { x: 0, y: size } // bottom-left
  ];

  for (var i = 0; i < count; i++) {
    var point = bounds[i % 4];
    points.push(drift(point, i));
  }

  return paths(points).map(line => colorize(line, GRAY));
}

function drift(point, radius) {
  return {
    x: point.x + random.sign(random.integer(radius)),
    y: point.y + random.sign(random.integer(radius))
  };
}

function colorize(line, color) {
  line.color = color;
  return line;
}

function grid(dimensions, size, draw) {
  const columnCount = Math.floor(dimensions.width / size);
  const rowCount = Math.floor(dimensions.height / size);
  let allLines = [];
  for (var i = 0; i < columnCount; i++) {
    for (var j = 0; j < rowCount; j++) {
      allLines = allLines.concat(
        transposeLines(draw(), {
          x: i * size,
          y: j * size
        })
      );
    }
  }
  return allLines;
}

function transposeLines(lines, { x, y }) {
  return lines.map(function(line) {
    return {
      start: {
        x: line.start.x + x,
        y: line.start.y + y
      },
      end: {
        x: line.end.x + x,
        y: line.end.y + y
      },
      color: line.color
    };
  });
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
