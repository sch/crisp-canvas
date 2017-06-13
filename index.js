module.exports = {
  drawLines,
  drawLine,
  setPixel
};

function drawLines(context, lines) {
  var imageData = getImageData(context);

  lines.forEach(function(line) {
    drawLine(imageData, line);
  });

  putImageData(context, imageData);
}

function drawLine(imageData, line) {
  const { start, end, color } = line;

  bresenhamPoints(start.x, start.y, end.x, end.y).forEach(function(point) {
    setPixel(imageData, color, point);
  });

  return imageData;
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
