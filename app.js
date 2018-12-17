var express = require("express");
var http = require("http");
var websocket = require("ws");

var indexRouter = require('./routes/index');

var Game = require('./game');
var gameStats = require("./stats");

var port  = process.argv[2];
var app = express();

app.use(express.static(__dirname + "/public"));
app.get('/', function(req, res){
    res.render('splash.ejs', {gamesInitialized: gameStats.gamesInitialized,
    gamesAborted: gameStats.gamesAborted,
    gamesCompleted: gameStats.gamesCompleted});
});

app.post('/', function(req, res){
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
    currentGame.addPlayer(con);
    // console.log(currentGame.gameState);
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
        
        let msg = JSON.parse(message);

        // console.log(msg);   

        if(msg.type === 'data') {
            if(websockets[con.id].playerA === con){
                websockets[con.id].dataA = msg.data;
            }
            else websockets[con.id].dataB = msg.data;
        } 
        

        if(msg.type === 'shot') {
            var data = {};
            if((msg.player) === 'A') {
                if(websockets[con.id].dataB[msg.cell.substring(1,3)]){
                    // console.log('hit');
                    data['hit'] = true;
                    data['turn'] = 'A';
                    var lifes = websockets[con.id].dataB[websockets[con.id].dataB[msg.cell.substring(1,msg.cell.length)]];
                    lifes[0]--;
                    if(lifes[0] === 0){
                        data['sunk'] = [];
                        for(let j = 1; j < lifes.length; j++){
                            data['sunk'].push(lifes[j]);
                        }
                        websockets[con.id].dataB['ships']--;
                        // console.log('Ship shunk!');
                        if (websockets[con.id].dataB['ships'] === 0){
                            data['won'] = 'A';
                            console.log('Player A wins');
                        };
                    }
                }
                else{
                    // console.log('mis');
                    data['hit'] = false;
                    data['turn'] = 'B'; 
                }
            }
            else{
                if(websockets[con.id].dataA[msg.cell.substring(1,3)]){
                    // console.log('hit');
                    data['hit'] = true;
                    data['turn'] = 'B'; 
                    var lifes = websockets[con.id].dataA[websockets[con.id].dataA[msg.cell.substring(1,msg.cell.length)]];
                    lifes[0]--;
                    if(lifes[0] === 0){
                        data['sunk'] = [];
                        for(let j = 1; j < lifes.length; j++){
                            data['sunk'].push(lifes[j]);
                        }
                        websockets[con.id].dataA['ships']--;
                        // console.log('Ship shunk!');
                        if (websockets[con.id].dataA['ships'] === 0){
                            data['won'] = 'B';
                            console.log('Player B wins');
                        };
                    }
                }
                else{
                    // console.log('mis');
                    data['hit'] = false;
                    data['turn'] = 'A'; 
                }
            }
            data['type'] = 'shot';
            data['cell'] = msg.cell;
            // console.log(data);
            websockets[con.id].playerA.send(JSON.stringify(data));
            websockets[con.id].playerB.send(JSON.stringify(data));
        }
        
    });

})


server.listen(port);