var mouseOffset = null;
var iMouseDown  = false;
var lMouseState = false;

var dragObject  = null;
var curTarget   = null;
var lastTarget  = null;
var lastSelected = null;
var dragHelper  = null;

var cells = null;
var activeCell = null;
var lastCell = null;
var base = null;
var field = null;

var fieldSize = 10;
var shipOrientation = null;
var shipSize = null;
var snappable = false;

function mouseCoords(ev){
	if(ev.pageX || ev.pageY){
		return {x:ev.pageX, y:ev.pageY};
	}
	return {
		x:ev.clientX + document.body.scrollLeft - document.body.clientLeft,
		y:ev.clientY + document.body.scrollTop  - document.body.clientTop
	};
}

function getPosition(e){
  var d = e;
	var left = 0;
	var top  = 0;
	while (e.offsetParent){
		left += e.offsetLeft;
		top  += e.offsetTop;
		e     = e.offsetParent;
  }
  left += e.offsetLeft;
  top  += e.offsetTop;
  d.setAttribute('x_start', left);
  d.setAttribute('y_start', top);
	return {x:left, y:top};
}

function getMouseOffset(target, ev){
	ev = ev || window.event;
	var docPos    = getPosition(target);
	var mousePos  = mouseCoords(ev);
	return {x:mousePos.x - docPos.x, y:mousePos.y - docPos.y};
}

function calculatePositions(e){
  for(var i = 0; i < e.length; i++) {
    getPosition(e[i]);
  }
}

var gridCellHoverIn = function(arg){
  var yCoord = arg.id.substring(0,1);
  var xCoord = arg.id.substring(1, arg.id.length);
  var newBackground = "lightgreen";
  var largestCoord;
  var startCoord = 1;
  snappable = true;
  if(shipOrientation === "horizontal"){
    startCoord = parseInt(xCoord);
  }else if (shipOrientation === "vertical"){
    startCoord = yCoord.charCodeAt() - 64;
  }
  largestCoord = startCoord + shipSize - 1;
  if(largestCoord > fieldSize){
    newBackground = "tomato";
    snappable = false;
  }
  for(var i = 0; i<Math.min(curTarget.id.substring(5,6), fieldSize - startCoord + 1); i++){
    var cellCoord;
    if(shipOrientation === "horizontal" ){
      cellCoord = parseInt(xCoord) + i;
      var cell = document.getElementById(yCoord+cellCoord);
    }else if(shipOrientation === "vertical"){
      cellCoord = String.fromCharCode(yCoord.charCodeAt() + i);
      var cell = document.getElementById(cellCoord+xCoord);
    }
    if(cell.getAttribute('occupied') === 'true'){
      newBackground = "tomato";
      snappable = false;
    }
  }

  for(var i = 0; i<Math.min(curTarget.id.substring(5,6), fieldSize - startCoord + 1); i++){
    var cellCoord;
    if(shipOrientation === "horizontal" ){
      cellCoord = parseInt(xCoord) + i;
      var cell = document.getElementById(yCoord+cellCoord);
    }else if(shipOrientation === "vertical"){
      cellCoord = String.fromCharCode(yCoord.charCodeAt() + i);
      var cell = document.getElementById(cellCoord+xCoord);
    }
    if(cell.getAttribute('occupied') !== 'true'){
        cell.style.backgroundColor = newBackground;
    }
  }
};

var gridCellHoverOut = function(arg){
  var yCoord = arg.id.substring(0,1);
  var xCoord = arg.id.substring(1, arg.id.length);
  var newBackground = "white";
  var largestCoord;
  var startCoord = 1;
  if(shipOrientation === "horizontal"){
    startCoord = parseInt(xCoord);
  }else if (shipOrientation === "vertical"){
    startCoord = yCoord.charCodeAt() - 64;
  }
  largestCoord = startCoord + shipSize - 1;
  for(var i = 0; i<Math.min(curTarget.id.substring(5,6), fieldSize - startCoord + 1); i++){
    var cellCoord;
    var cell;
    if(shipOrientation === "horizontal" ){
      cellCoord = parseInt(xCoord) + i;
      cell = document.getElementById(yCoord+cellCoord);
    }else if(shipOrientation === "vertical"){
      cellCoord = String.fromCharCode(yCoord.charCodeAt() + i);
      cell = document.getElementById(cellCoord+xCoord);
    }
    if(cell.getAttribute("occupied") !== "true"){
      cell.style.backgroundColor = newBackground;
    }
  }
  snappable = false;
};

function mouseMove(ev){
	ev         = ev || window.event;
	var target   = ev.target || ev.srcElement;
	var mousePos = mouseCoords(ev);
  var dragObj = target.className;
  calculatePositions(cells);
  getPosition(base);
  getPosition(field);
  
	if(dragObj=='ship'){

		if(iMouseDown && !lMouseState){

      if(target.getAttribute('occupies') !== null){

        var oldCell_id = target.getAttribute('occupies');
        var oldCell = document.getElementById(oldCell_id);

        var yCoord = oldCell.id.substring(0,1);
        var xCoord = oldCell.id.substring(1, target.id.length);

        for(var i = 0; i<target.id.substring(5,6); i++){
          var cellCoord;
          var cell;
          
          if(shipOrientation === "horizontal" ){
            cellCoord = parseInt(xCoord) + i;
            cell = document.getElementById(yCoord+cellCoord);
          }
          else if(shipOrientation === "vertical"){
            cellCoord = String.fromCharCode(yCoord.charCodeAt() + i);
            cell = document.getElementById(cellCoord+xCoord);
          }

          cell.setAttribute("occupied", "false");
        }

      }

      shipSize = parseInt(target.id.substring(5,6));
      if (target.getAttribute('shipOrientation') === null) target.setAttribute('shipOrientation', 'horizontal');
      shipOrientation = target.getAttribute('shipOrientation');

      if(lastSelected !== null){
        lastSelected.style.border = '4px solid black';
      }
      target.style.border = '4px solid red';

      mouseOffset   = getMouseOffset(target, ev);
      
      document.body.appendChild(dragHelper);
      for(var i=0; i<dragHelper.childNodes.length; i++) dragHelper.removeChild(dragHelper.childNodes[i]);
      var copy = target.cloneNode(true);
      copy.style.top = '0px';
      copy.style.left = '0px';
      copy.removeAttribute('DragObj');
      dragHelper.appendChild(copy);
      
      dragHelper.style.display = '';
      target.style.display = 'none';
      
      lastSelected = target;
      curTarget = target;

		}
  }
  
	if(curTarget){

    var cur_x = mousePos.x - mouseOffset.x;
    var cur_y = mousePos.y - mouseOffset.y;

    dragHelper.style.top  = cur_y + 'px';
    dragHelper.style.left = cur_x + 'px';

    for(let i = 0; i < cells.length; i++) {

      if((parseInt(cells[i].getAttribute('x_start')) < cur_x + 20) &&
      (parseInt(cells[i].getAttribute('y_start')) < cur_y + 20) &&
      (parseInt(cells[i].getAttribute('x_start')) + 40  > cur_x + 20) &&
      (parseInt(cells[i].getAttribute('y_start'))  + 40 > cur_y + 20)){
        activeCell = cells[i];
        if(lastCell !== activeCell){
          if(lastCell !== null){
            gridCellHoverOut(lastCell);
          }
          gridCellHoverIn(activeCell);
          lastCell = activeCell;
        }
        break;
      }
    }

    if((parseInt(base.getAttribute('x_start')) - 130 < cur_x + 20) &&
      (parseInt(base.getAttribute('y_start')) < cur_y + 20) &&
      (parseInt(base.getAttribute('x_start')) + 500  > cur_x + 20) &&
      (parseInt(base.getAttribute('y_start'))  + 500 > cur_y + 20)){
        if(lastCell !== null){
          gridCellHoverOut(lastCell);
        }
        lastCell = null;
    }

  }
  
	lMouseState = iMouseDown;
	lMouseState = iMouseDown;
	return false;
}

function mouseUp(ev){

	if(curTarget){

    document.body.removeChild(dragHelper);
    curTarget.style.display = '';

    if (lastCell !== null) {

      if(!snappable){
        gridCellHoverOut(lastCell);
      }
      else{

        var parent = curTarget.parentNode;
        parent.removeChild(curTarget);
        field.appendChild(curTarget);

        curTarget.style.left = lastCell.getAttribute('x_start') - field.getAttribute('x_start') + 'px';
        curTarget.style.top = lastCell.getAttribute('y_start') - field.getAttribute('y_start') + 'px';

        curTarget.setAttribute('occupies', lastCell.id);

        var yCoord = lastCell.id.substring(0,1);
        var xCoord = lastCell.id.substring(1, curTarget.id.length);

        for(var i = 0; i<curTarget.id.substring(5,6); i++){
          var cellCoord;
          var cell;

          if(shipOrientation === "horizontal" ){
            cellCoord = parseInt(xCoord) + i;
            cell = document.getElementById(yCoord+cellCoord);
          }
          else if(shipOrientation === "vertical"){
            cellCoord = String.fromCharCode(yCoord.charCodeAt() + i);
            cell = document.getElementById(cellCoord+xCoord);
          }

          cell.setAttribute("occupied", "true");
        }
      }
    }
    else {

      if(curTarget.getAttribute('occupies') !== null){

        field.removeChild(curTarget);
        curTarget.removeAttribute('occupies');
        base.appendChild(curTarget);

        curTarget.style.left = curTarget.getAttribute('x') + 'px'; 
        curTarget.style.top = curTarget.getAttribute('y') + 'px';
      }

    }
  }
  
	lastTarget  = curTarget;
	curTarget  = null;
  lastCell = null;
	iMouseDown = false;
}

function mouseDown(){
	iMouseDown = true;
	if(lastTarget){
		return false;
	}
}

document.onmousemove = mouseMove;
document.onmousedown = mouseDown;
document.onmouseup   = mouseUp;

window.onload = function(){

  dragHelper = document.createElement('DIV');
  dragHelper.style.cssText = 'position:absolute;display:none;';
  
  cells = document.getElementsByClassName('gridCell');
  base = document.getElementsByClassName('other')[0];
  field = document.getElementsByClassName('player')[0];
}


// var toggleShipOrientation = function(){
//     // console.log("toggling shipOrientation");
//     if(shipOrientation === "horizontal"){
//         shipOrientation = "vertical";
//     }else if(shipOrientation === "vertical"){
//         shipOrientation = "horizontal";
//     }
// }
// $(".other button").click(function(event){
//     // if(this.id === "rotate"){
//     //     toggleShipOrientation();
//     // }
//     if(this.id === "play"){
//         console.log("play button clicked (no further implementation yet)");
//         // gridCellHoverIn(document.getElementById("A1"));
//         document.getElementById("B4").style.backgroundColor = "purple";
//         document.getElementById("B5").style.backgroundColor = "purple";
//         document.getElementById("B6").style.backgroundColor = "purple";
//         document.getElementById("B7").style.backgroundColor = "purple";
//         document.getElementById("B4").setAttribute("occupied", "true");
//         document.getElementById("B5").setAttribute("occupied", "true");
//         document.getElementById("B6").setAttribute("occupied", "true");
//         document.getElementById("B7").setAttribute("occupied", "true");
//     }
// });