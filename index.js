main(document.body);

function main(parent) {
  var canvas = document.createElement("canvas");

  canvas.width = 1000;
  canvas.height = 750;

  parent.append(canvas);

  var ctx = canvas.getContext("2d");

  requestAnimationFrame(draw);

  function draw(timestamp) {
    drawLine(ctx);
    // requestAnimationFrame(main);
  }
}

var blue = [100, 100, 100, 255];

function drawLine(context, line) {
  var imageData = getImageData(context);
  var drawPixel = setPixel.bind(null, imageData, blue);

  for (var i = 0; i < 500; i++) {
    var { start, end } = randomLine(context.canvas);
    bresenhamPoints(start.x, start.y, end.x, end.y).forEach(drawPixel);
  }

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
    case "TOP":
      return { x: randomInteger(dimensions.width), y: 0 };
    case "RIGHT":
      return { x: dimensions.width, y: randomInteger(dimensions.height) };
    case "BOTTOM":
      return { x: randomInteger(dimensions.width), y: dimensions.height };
    case "LEFT":
      return { x: 0, y: randomInteger(dimensions.height) };
  }
}

function randomSide() {
  return ["TOP", "RIGHT", "BOTTOM", "LEFT"][Math.floor(Math.random() * 4)];
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
