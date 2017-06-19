var { drawLine, drawLines } = require("..");

var GRAY = [100, 100, 100, 255];
var LIGHT_GRAY = [130, 130, 130, 255];
var LIGHTER_GRAY = [160, 160, 160, 255];

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
    default: 20
  }
};

module.exports = { parameters, draw };

function draw(context, options = {}) {
  var size = options.size || 100;
  var iterations = options.iterations || 30;
  let allLines = grid(context.canvas, size, function() {
    return veraLines(size, iterations);
  });
  drawLines(
    context,
    allLines.map(line => colorize(line, choice([GRAY, LIGHT_GRAY])))
  );
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

function veraLines(widthAndHeight, count) {
  var dimensions = { width: widthAndHeight, height: widthAndHeight };
  var points = [];
  for (var i = 0; i <= count; i++) {
    points.push(randomPoint(dimensions));
  }
  return paths(points);
}

function randomPoint(dimensions) {
  return {
    x: randomInteger(dimensions.width),
    y: randomInteger(dimensions.height)
  };
}

function colorize(line, color) {
  line.color = color;
  return line;
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

function choice(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}
