var socket = new WebSocket("ws://localhost:4444");
socket.onmessage = function(event){
    let msg = JSON.parse(event.data);

    if(msg.type === 'GameStats'){
        // console.log('Game Stat: games initialized: '+ incomingMsg.gamesInitialized + ' games aborted: ' + incomingMsg.gamesInitialized + ' games completed: ' + incomingMsg.gamesCompleted);
        document.getElementById('stat1').innerHTML = 'Games Initialized: '+msg.gamesInitialized;
        document.getElementById('stat2').innerHTML = 'Games Aborted: '+msg.gamesAborted;
        document.getElementById('stat3').innerHTML = 'Games Completed: '+msg.gamesCompleted;
    }
    
    console.log(event.data);
    // console.log(JSON.parse(event));
}

document.getElementById('play').onclick = function(event){
    var playerData = "data containing board positions and player info";
    socket.send(playerData);
    console.log('clicked play button, sending data to server');
}