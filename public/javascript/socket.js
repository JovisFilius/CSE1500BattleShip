var socket = new WebSocket("ws://localhost:4444");
socket.onmessage = function(event){
    console.log(event.data);
}

document.getElementById('play').onclick = function(event){
    var playerData = "data containing board positions and player info";
    socket.send(playerData);
    console.log('clicked play button, sending data to server');
}