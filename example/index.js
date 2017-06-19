var querystring = require("querystring");

var { drawLine, drawLines } = require("..");
var controller = require("./controls");
var draw = require("./default");
var unimaginable = require("./unimaginable-images");
var roses = require("./roses");
var molnar = require("./molnar");

var canvas = document.createElement("canvas");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
document.body.style.margin = 0;
document.body.style.overflow = "hidden";
document.body.style.position = "relative";
document.body.append(canvas);

var context = canvas.getContext("2d");

var options = querystring.parse(window.location.search.slice(1));

var image = { molnar, roses, unimaginable }[options.image] || draw;

var controls = controller.create(image.parameters);

image.draw(context, options);

controls.changes.observe(function(options) {
  clear(context);
  image.draw(context, options);
});

if (Object.keys(options).length > 1) {
  document.body.append(controls.element);
}

function clear(context) {
  context.clearRect(0, 0, context.canvas.width, context.canvas.height);
}
