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
  if(name=(new RegExp('[?&]'+encodeURIComponent(name)+'=([^&]*)')).exec(location.search))
    return decodeURIComponent(name[1]);
  }
}

function init() {
  var character = RequestUtils.getParameter("character"); // TODO Check valid values sharing the code with node.js!
  console.debug(character);

  var maxX = 1;
  var maxY = 1;

  for (var i = 0; i <= maxX; i++) {
    for (var j = 0; j <= maxY; j++) {
      var td = document.getElementById("td" + i + j);
      var onClickFunctionRef = DataSender.send(character, i, j, onDataSent);
      td.onclick = onClickFunctionRef;
    }
  }
}

function onDataSent(json) {
  document.getElementById("status").innerHTML = json;
}

