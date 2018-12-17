var express = require("express");
var http = require("http");
var websocket = require("ws");

var indexRouter = require('./routes/index');

var Game = require('./game');
var gameStats = require("./stats");

var port  = process.argv[2];
var app = express();

app.use(express.static(__dirname + "/public"));
// app.get('/', indexRouter);
// app.post('/', indexRouter);
app.get('/', function(req, res){
    res.render('splash.ejs', {gamesInitialized: gameStats.gamesInitialized,
    gamesAborted: gameStats.gamesAborted,
    gamesCompleted: gameStats.gamesCompleted});
});

var server = http.createServer(app);
const wss = new websocket.Server({ server });

var websockets = {};

setInterval(function() {
    for(let i in websockets){
        if(websockets.hasOwnProperty(i)){
            let gameObj = websockets[i];
            if(gameObj.finalStatus!=null){
                delete websockets[i];
            }
        }
    }
}, 60000);

var currentGame = new Game(gameStats.gamesInitialized++);
var connectionID = 0;


wss.on("connection", function connection(ws) {

    let con = ws;
    con.id = connectionID++;
    let playerType = currentGame.addPlayer(con);
    console.log(currentGame.gameState);
    websockets[con.id] = currentGame;

    if (currentGame.gameState === "2 JOINT") {
        var start_A = {type: 'start', turn: 'A', player: 'A'};
        var start_B = {type: 'start', turn: 'A', player: 'B'};
        currentGame.gameState = "A";
        currentGame.playerA.send(JSON.stringify(start_A));
        currentGame.playerB.send(JSON.stringify(start_B));
        currentGame = new Game(gameStats.gamesInitialized++);
    }

    ws.on('message', function incoming(message) {
        
        let msg = JSON.parse(message.data);

        if(msg.type === 'data' && websockets[con.id].playerA === con) websockets[con.id].dataA = msg.data;
        else websockets[con.id].dataB = msg.data;
        
    });

})


server.listen(port);