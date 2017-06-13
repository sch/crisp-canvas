# crisp-canvas

<center><img
src="https://raw.githubusercontent.com/sch/crisp-canvas/master/example.png"/></center>

A module for quickly drawing lines to a canvas element using bresenham's
algorithm, for pixel-precision crispness.

#### Usage

```
var crisp = require("crisp-canvas");
var canvas = getElementById("canvas-id");
var context = canvas.getContext("2d");

crisp.drawLines(context, [
  {
    start: { x: 5, y: 5 },
    end: { x: 25, y: 25 },
    color: [ 200, 200, 200, 200 ] // rgba
  }
]);
```
