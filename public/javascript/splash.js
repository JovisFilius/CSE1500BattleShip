document.getElementById("howToPlay").onclick = on;
document.getElementById('overlay').onclick = off;

function on() {
    document.getElementById("overlay").style.display = "block";
    document.getElementById("playRules").style.display = "block";
    // console.log('should be black now');
  }
  
  function off() {
    document.getElementById("overlay").style.display = "none";
    document.getElementById("playRules").style.display = "none";
    // console.log('should be clear now');
  }