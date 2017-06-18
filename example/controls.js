var mergeObject = require("most-combineobj").combineObj;
var eventStream = require("@most/dom-event");

module.exports = {
  create: createControls
};

function createSlider(options) {
  var element = document.createElement("input");
  element.type = "range";

  element.style.margin = "20px";
  element.style.display = "block";

  if (options) {
    if (options.min) element.min = options.min;
    if (options.max) element.max = options.max;
    if (options.default) element.value = options.default;
    if (options.handler) element.addEventListener("change", options.handler);
  }

  return element;
}

function createInput(options) {
  var element = document.createElement("div");

  if (options.type === "slider") {
    var input = createSlider(options);
  }

  element.append(options.name);
  element.append(input);
  element.append(options.default);

  element.style.display = "flex";
  element.style.alignItems = "center";
  element.style.marginLeft = "20px";
  element.style.paddingRight = "20px";

  return element;
}

function createControls(controls) {
  var element = document.createElement("div");
  var hideregion = createHideRegion();

  element.style.backgroundColor = "white";
  element.style.fontFamily = "-apple-system, sans-serif";
  element.style.fontWeight = "500";
  element.style.color = "#444";
  element.style.position = "absolute";
  element.style.bottom = "20px";
  element.style.left = "20px";
  element.style.display = "flex";
  element.style.transition = "opacity 0.3s ease-in-out";
  element.style.borderRadius = "3px";

  element.append(hideregion);

  var changeStreams = {};

  for (var controlKey in controls) {
    var settings = controls[controlKey];
    var inputElement = createInput(settings);
    inputElement.style.borderRight = "solid 1px #EEE";
    var values = eventValues(eventStream.change(inputElement)).startWith(
      settings.default
    );
    values.observe(function(value) {
      inputElement.lastChild.nodeValue = value;
    });
    element.append(inputElement);
    changeStreams[controlKey] = values;
  }

  hideregion.addEventListener("click", function() {
    element.style.opacity = 0;
  });
  element.addEventListener("mouseleave", function() {
    element.style.opacity = 1;
  });

  var changes = mergeObject(changeStreams);

  return { element, changes };
}

function eventValues(eventStream) {
  return eventStream.map(event => parseInt(event.target.value, 10));
}

function createHideRegion() {
  var element = document.createElement("div");
  element.textContent = "hide";
  element.style.cursor = "pointer";
  element.style.padding = "20px";
  element.style.borderRight = "solid 1px #EEE";
  return element;
}
