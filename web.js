var express = require("express");
var app = express();
app.use(express.logger());
app.use(express.bodyParser()); // Needed to parse POST requests

var message = "Hello World!"

app.get("/message", function(request, response) {
    response.send(message + "\n");
});

app.post("/newmessage", function(request, response) {
    console.log("Received POST request!");
    message = request.body.newmessage;
    response.send("new message is " + message + "\n");
});

var port = process.env.PORT || 5000;
app.listen(port, function() {
    console.log("Listening on " + port);
});
