module.exports = {
  integer: randomInteger,
  sign: randomSign,
  point: randomPoint,
  line: randomLine,
  choice,
}

var SIDES = {
  TOP: "TOP",
  RIGHT: "RIGHT",
  BOTTOM: "BOTTOM",
  LEFT: "LEFT"
};

function randomInteger(max) {
  return Math.floor(Math.random() * max);
}

function randomSign(num) {
  return Math.random() > 0.5 ? num : num * -1;
}

function randomPoint(dimensions) {
  return {
    x: randomInteger(dimensions.width),
    y: randomInteger(dimensions.height)
  };
}

function choice(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function randomLine(dimensions, length) {
  return {
    start: randomPointAlongEdge(dimensions),
    end: randomPointAlongEdge(dimensions),
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

