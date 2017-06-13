<p align="center"><img src="https://raw.githubusercontent.com/sch/crisp-canvas/master/example.png"/></p>

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

#### Why?

Html canvas doesn't provide an api for aliasing. All lines and polygons are
anti-aliased by default.

Canvas does provide an api for manipulating the image buffer through the
[`ImageData`](https://developer.mozilla.org/en-US/docs/Web/API/ImageData) class.
This library defines a line drawing command that draws pixels directly to this
image buffer.
