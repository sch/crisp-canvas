var SIDES = {
  TOP: "TOP",
  RIGHT: "RIGHT",
  BOTTOM: "BOTTOM",
  LEFT: "LEFT",
};

main(document.body);

function main(parent) {
  var canvas = document.createElement("canvas");

  canvas.width = 1000;
  canvas.height = 1000;

  parent.append(canvas);

  var ctx = canvas.getContext("2d");

  requestAnimationFrame(draw);

  function draw(timestamp) {
    var start = performance.now();
    for (var i = 0; i < 500; i++) {
      drawLine(ctx, randomLine(ctx.canvas));
    }
    var end = performance.now();
    console.log("individual image data time (ms)", end - start);


    var lines = []
    for (var i = 0; i < 500; i++) {
      lines.push(randomLine(ctx.canvas));
    }
    start = performance.now();
    drawLines(ctx, lines);
    end = performance.now();
    console.log("batched time (ms)", end - start);

    // requestAnimationFrame(main);
  }
}

var blue = [100, 100, 100, 255];

function drawLines(context, lines) {
  var imageData = getImageData(context);
  var drawPixel = setPixel.bind(null, imageData, blue);

  lines.forEach(function ({ start, end }) {
    bresenhamPoints(start.x, start.y, end.x, end.y).forEach(drawPixel);
  });

  putImageData(context, imageData);
}

function drawLine(context, line) {
  var imageData = getImageData(context);
  var drawPixel = setPixel.bind(null, imageData, blue);
  var { start, end } = line
  bresenhamPoints(start.x, start.y, end.x, end.y).forEach(drawPixel);
  putImageData(context, imageData);
}

function setPixel(imageData, color, point) {
  var { data, width } = imageData;
  var [r, g, b, a] = color;
  var { x, y } = point;
  var offset = (y * width + x) * 4;

  data[offset] = r;
  data[offset + 1] = g;
  data[offset + 2] = b;
  data[offset + 3] = a;
  return imageData;
}

function getImageData(context) {
  var { width, height } = context.canvas;
  return context.getImageData(0, 0, width, height);
}

function putImageData(context, imageData) {
  context.putImageData(imageData, 0, 0);
  return context;
}

function randomLine(dimensions, length) {
  return {
    start: randomPointAlongEdge(dimensions),
    end: randomPointAlongEdge(dimensions)
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

function bresenhamPoints(x0, y0, x1, y1) {
  var dx = delta(x1, x0);
  var dy = delta(y1, y0);
  var sx = x0 < x1 ? 1 : -1;
  var sy = y0 < y1 ? 1 : -1;
  var err = dx - dy;
  var lines = [];

  while (true) {
    lines.push({ x: x0, y: y0 });

    if (x0 === x1 && y0 === y1) break;

    var e2 = 2 * err;

    if (e2 > -dy) {
      err -= dy;
      x0 += sx;
    }

    if (e2 < dx) {
      err += dx;
      y0 += sy;
    }
  }

  return lines;
}

function delta(first, second) {
  return Math.abs(first - second);
}
