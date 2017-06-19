var { drawLine, drawLines } = require("..");

var SIDES = {
  TOP: "TOP",
  RIGHT: "RIGHT",
  BOTTOM: "BOTTOM",
  LEFT: "LEFT"
};

var GRAY = [100, 100, 100, 255];

var parameters = {};

module.exports = { parameters, draw };

function draw(context, options) {
  benchmark("batched time", function() {
    var lines = [];
    for (var i = 0; i < 500; i++) {
      lines.push(randomLine(context.canvas));
    }
    drawLines(context, lines);
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

function randomInteger(max) {
  return Math.floor(Math.random() * max);
}

function randomSide() {
  return Object.keys(SIDES)[Math.floor(Math.random() * 4)];
}

function benchmark(message, fn) {
  var start = performance.now();
  fn();
  var end = performance.now();
  console.log(message, end - start, "(ms)");
}

