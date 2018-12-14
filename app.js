var express = require("express");
var http = require("http");
var websocket = require("ws");

var indexRouter = require('./routes/index');

var port  = process.argv[2];
var app = express();

app.use(express.static(__dirname + "/public"));
var server = http.createServer(app)

const wss = new websocket.Server({ server });

wss.on("connection", function connection(ws) {
    console.log('Greeting the player');
    ws.send("Hello player");
    ws.on('message', function incoming(message) {
        console.log('received message from client: %s', message);
    })
})

app.get('/', indexRouter);

server.listen(port);