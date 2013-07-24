var DataSender = {

  /*
   * Sends data to server.
   * 
   * @param character Character controlled by the player
   * @param x X coordinate
   * @param y Y coordinate
   * @param {requestCallback} callback - The callback that handles the response
   */
  send: function(character, x, y, callback) {
    return function() {
      var coords = new Object();
      coords.x = x;
      coords.y = y;
      var client = new XMLHttpRequest();
      client.open("POST", "/newdata/" + character);
      client.onload = function() {
        callback(this.responseText);
      };
      client.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
      client.send("newdata=" + JSON.stringify(coords));
    }
  }
}

var RequestUtils = {

  // Use a library to do this!
  getParameter: function(name) {
    if(name=(new RegExp('[?&]'+encodeURIComponent(name)+'=([^&]*)')).exec(location.search)) {
      return decodeURIComponent(name[1]);
    }
  }
}

var InputProcessor = {

  keyDownHandler: "undefined",

  /*
   * Registers a callback that will be called when a keyDown event is received.
   */
  registerOnKeyDown: function(keyDownHandler) {
    this.keyDownHandler = keyDownHandler;

    // Set global keyboard event listener
    var self = this; // Need to define "self" because when onkeydown is triggered "this" points to Window object!
    window.onkeydown = function(e) {

      // Call internal function to handle the event
      self.onKeyDown(e, self.keyDownHandler);
    }
  },

  /*
   * Processes an onkeydown event.
   *
   * _Internal use only_
   */
  onKeyDown: function(e, callback) {
    console.debug("onKeyDown");

    if (callback !== "undefined") {
      switch(e.keyCode) {
        case 37: // left
          return callback("W");
        case 38: // up
          return callback("N");
        case 39: // right
          return callback("E");
        case 40: // down
          return callback("S");
        default:
          return; // Only cursors are allowed
      }
    }

    // No listener registered
    console.warn("No listener registered.");
  }
}

var DocumentUtils = {

  e: function(name) {
    return document.getElementById(name);
  }

}

function init() {
  console.debug(character);

  InputProcessor.registerOnKeyDown(onMove);

  DataSender.send(character, 0, 0, onDataSent);

  for (var i = 0; i <= maxX; i++) {
    for (var j = 0; j <= maxY; j++) {
      var td = document.getElementById("td" + i + j);
      var onClickFunctionRef = DataSender.send(character, i, j, onDataSent);
      td.onclick = onClickFunctionRef;
    }
  }
}

// TODO Extract following code to a Game function!

var maxX = 1;
var maxY = 1;
var gameStatus = "undefined";
var character = RequestUtils.getParameter("character"); // TODO Check valid values sharing the code with node.js!

function onDataSent(json) {
  console.debug("onDataSent");
  document.getElementById("status").innerHTML = json;
  gameStatus = JSON.parse(json);
}

function onMove(direction) {
  console.debug("move now to " + direction);
  var oldStatusX = gameStatus[character].x;
  var oldStatusY = gameStatus[character].y;
  var status = gameStatus[character];
  switch(direction) {
    case "W":
      if (status.y - 1 >= 0) {
        status.y -= 1;
      }
      break;
    case "N":
      if (status.x - 1 >= 0) {
        status.x -= 1;
      }
      break;
    case "E":
      if (status.y + 1 <= maxY) {
        status.y += 1;
      }
      break;
    case "S":
      if (status.x + 1 <= maxX) {
        status.x += 1;
      }
  }
  console.debug("old: " + oldStatusX + "," + oldStatusY + ", current: " + status.x + ", " + status.y);
  var oldTd = DocumentUtils.e("td" + oldStatusX + oldStatusY);
  oldTd.style.color = "black";
  var td = DocumentUtils.e("td" + status.x + status.y);
  td.style.color = "red";
}
