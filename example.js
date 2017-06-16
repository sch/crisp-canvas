var querystring = require("querystring");
var { drawLine, drawLines } = require(".");

var SIDES = {
  TOP: "TOP",
  RIGHT: "RIGHT",
  BOTTOM: "BOTTOM",
  LEFT: "LEFT"
};

var GRAY = [100, 100, 100, 255];
var LIGHT_GRAY = [130, 130, 130, 255];
var LIGHTER_GRAY = [160, 160, 160, 255];

var RED = [255, 0, 0, 255];
var GREEN = [0, 255, 0, 255];
var BLUE = [0, 0, 255, 255];

var canvas = document.createElement("canvas");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
document.body.style.margin = 0;
document.body.style.overflow = "hidden";
document.body.style.position = "relative";
document.body.append(canvas);
document.body.append(createControls());

var ctx = canvas.getContext("2d");

var options = querystring.parse(window.location.search.slice(1));
switch (options.image) {
  case "molnar":
    return molnar(ctx, options);
  case "roses":
    return roses(ctx, options);
  default:
    return draw();
}

function draw(timestamp) {
  benchmark("batched time", function() {
    var lines = [];
    for (var i = 0; i < 500; i++) {
      lines.push(randomLine(ctx.canvas));
    }
    drawLines(ctx, lines);
  });
}

function randomLine(dimensions, length) {
  return {
    start: randomPointAlongEdge(dimensions),
    end: randomPointAlongEdge(dimensions),
    color: GRAY
  };
}

function randomPointAlongEdge(dimensions) {
  switch (randomSide()) {
    case SIDES.TOP:
      return { x: randomInteger(dimensions.width), y: 0 };
    case SIDES.RIGHT:
      return { x: dimensions.width, y: randomInteger(dimensions.height) };
    case SIDES.BOTTOM:
      return { x: randomInteger(dimensions.width), y: dimensions.height };
    case SIDES.LEFT:
      return { x: 0, y: randomInteger(dimensions.height) };
  }
}

function randomSide() {
  return Object.keys(SIDES)[Math.floor(Math.random() * 4)];
}

function randomPoint(dimensions) {
  return {
    x: randomInteger(dimensions.width),
    y: randomInteger(dimensions.height)
  };
}

function randomInteger(max) {
  return Math.floor(Math.random() * max);
}

function clear(context) {
  context.clearRect(0, 0, context.canvas.width, context.canvas.height);
}

function benchmark(message, fn) {
  var start = performance.now();
  fn();
  var end = performance.now();
  console.log(message, end - start, "(ms)");
}

function molnar(context) {
  var size = options.size || 100;
  var iterations = options.iterations || 30;
  let allLines = grid(context.canvas, size, function() {
    return veraLines(size, iterations)
  });
  drawLines(
    context,
    allLines.map(line =>
      colorize(line, choice([GRAY, LIGHT_GRAY, LIGHTER_GRAY]))
    )
  );
}

function roses(context, options) {
  var size = options.size || 100;
  var iterations = options.iterations || 30;
  var allLines = grid(context.canvas, size, function () {
    return rose(size, iterations);
  });
  drawLines(context, allLines);
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

function rose(size, count) {
  var points = [];

  for (var i = 0; i < count; i++) {
    var mod = i % 4;
    var variance = randomPoint({ width: i, height: i });
    var point = variance;

    if (mod === 1) {
      point = { x: size - variance.x, y: variance.y };
    } else if (mod === 2) {
      point = { x: size - variance.x, y: size - variance.y };
    } else if (mod === 3) {
      point = { x: variance.x, y: size - variance.y };
    }

    points.push(point);
  }

  return paths(points).map(line => colorize(line, GRAY));
}

function randomPoint(dimensions) {
  return {
    x: randomInteger(dimensions.width),
    y: randomInteger(dimensions.height)
  };
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

function colorize(line, color) {
  line.color = color;
  return line;
}

function last(arr) {
  return arr[arr.length - 1];
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

function choice(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function createSlider(options) {
  var element = document.createElement("input");
  element.type = "range";
  element.min = 1;
  element.max = 20;
  element.value = 5;
  element.style.margin = "20px";
  element.style.display = "block";
  return element;
}

function createControls() {
  var element = document.createElement("div");

  element.append(createSlider());

  element.style.backgroundColor = "white";
  element.style.position = "absolute";
  element.style.bottom = "20px";
  element.style.left = "20px";
  return element;
}
