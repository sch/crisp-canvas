var { drawLine, drawLines } = require("..");
var random = require("./random");

var GRAY = [100, 100, 100, 255];

var parameters = {};

module.exports = { parameters, draw };

function draw(context, options) {
  benchmark("batched time", function() {
    var lines = [];
    for (var i = 0; i < 500; i++) {
      lines.push(random.line(context.canvas));
    }
    drawLines(context, lines.map(line => colorize(line, GRAY)));
  });
}

function benchmark(message, fn) {
  var start = performance.now();
  fn();
  var end = performance.now();
  console.log(message, end - start, "(ms)");
}

function colorize(line, color) {
  line.color = color;
  return line;
}

