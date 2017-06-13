var { drawLine, drawLines } = require(".");

var SIDES = {
  TOP: "TOP",
  RIGHT: "RIGHT",
  BOTTOM: "BOTTOM",
  LEFT: "LEFT"
};

var canvas = document.createElement("canvas");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
document.body.style.margin = 0;
document.body.style.overflow = "hidden";
document.body.append(canvas);

var ctx = canvas.getContext("2d");

requestAnimationFrame(draw);

function draw(timestamp) {
  benchmark("batched time", function() {
    var lines = [];
    for (var i = 0; i < 500; i++) {
      lines.push(randomLine(ctx.canvas));
    }
    drawLines(ctx, lines);
  });

  // requestAnimationFrame(main);
}

var blue = [100, 100, 100, 255];

function randomLine(dimensions, length) {
  return {
    start: randomPointAlongEdge(dimensions),
    end: randomPointAlongEdge(dimensions),
    color: blue
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
