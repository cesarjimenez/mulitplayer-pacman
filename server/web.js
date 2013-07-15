var express = require("express");
var app = express();
app.use(express.logger());
app.use(express.bodyParser()); // Needed to parse POST requests

var data = new Object();

// Init data
data.pacman = new Object();
data.pacman.x = -1;
data.pacman.y = -1;

data.blinky = new Object();
data.blinky.x = -1;
data.blinky.y = -1;

data.inky = new Object();
data.inky.x = -1;
data.inky.y = -1;

data.pinky = new Object();
data.pinky.x = -1;
data.pinky.y = -1;

data.clyde = new Object();
data.clyde.x = -1;
data.clyde.y = -1;

/*
 * Returns current data
 */
app.get("/data", function(request, response) {
    response.send(JSON.stringify(data));
});

/*
 * Check for the sprite parameter in a request path and set its value in the request
 */
app.param('sprite', function(request, response, next, id) {
    for (sprite in data) {
        if (id == sprite) {
            request.sprite = id;
            next(); // Send control to the next request processor in the chain
            return;
        }
    }
    response.send(400, "Invalid sprite!");
});

/*
 * Updates sprite position and returns updated data
 */
app.post("/newdata/:sprite", function(request, response) {
    console.log("Received POST request!");
    var newdata = JSON.parse(request.body.newdata);
    if (typeof newdata.x == "undefined" || typeof newdata.y == "undefined") {
        response.send(400);
    }
    data[request.sprite].x = newdata.x;
    data[request.sprite].y = newdata.y;
    response.json(data);
});

/*
 * Set port and fire Express application
 */
var port = process.env.PORT || 5000;
app.listen(port, function() {
    console.log("Listening on " + port);
});
