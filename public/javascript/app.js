var mouseOffset = null;
var iMouseDown  = false;
var lMouseState = false;

var dragObject  = null;
var curTarget   = null;
var lastTarget  = null;
var lastSelected = null;
var dragHelper  = null;

var gridCells = null;
var activeCell = null;
var lastCell = null;
var base = null;
var field = null;

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

function selectCells(target, cell){

  var shipSize = parseInt(target.id.substring(5,6));
  if (target.getAttribute('shipOrientation') === null) target.setAttribute('shipOrientation', 'horizontal');
  var shipOrientation = target.getAttribute('shipOrientation');

  var yCoord = cell.id.substring(0,1);
  var xCoord = cell.id.substring(1, target.id.length);

  var selectedCells = [];

  for(var i = 0; i < shipSize; i++){
    var cellCoord;
    
    if(shipOrientation === 'horizontal' ){
      cellCoord = parseInt(xCoord) + i;
      if(document.getElementById(yCoord+cellCoord)) selectedCells.push(document.getElementById(yCoord+cellCoord));
    }
    else if(shipOrientation === 'vertical'){
      cellCoord = String.fromCharCode(yCoord.charCodeAt() + i);
      if(document.getElementById(cellCoord+xCoord)) selectedCells.push(document.getElementById(cellCoord+xCoord));
    }
  }

  return selectedCells;
}

function selectOCells(target, cell){

  var shipSize = parseInt(target.id.substring(5,6));
  if (target.getAttribute('shipOrientation') === null) target.setAttribute('shipOrientation', 'horizontal');
  var shipOrientation = target.getAttribute('shipOrientation');

  var yCoord = cell.id.substring(0,1);
  var xCoord = cell.id.substring(1, target.id.length);

  var selectedCells = [];

  for(var j = 0; j < 3; j++){
    for(var i = 0; i < shipSize + 2; i++){      
      if(shipOrientation === 'horizontal' ){
        var xTemp = parseInt(xCoord) + i - 1;
        var yTemp = String.fromCharCode(yCoord.charCodeAt() + j - 1);
        if(document.getElementById(yTemp+xTemp)) selectedCells.push(document.getElementById(yTemp+xTemp));
      }
      else if(shipOrientation === 'vertical'){
        var xTemp = parseInt(xCoord) + j - 1;
        var yTemp = String.fromCharCode(yCoord.charCodeAt() + i - 1);
        if(document.getElementById(yTemp+xTemp)) selectedCells.push(document.getElementById(yTemp+xTemp));
      }
    }
  }
  return selectedCells;
}

function gridCellHoverIn(target, cell){
  var shipSize = parseInt(target.id.substring(5,6));
  var selectedCells = selectCells(target, cell);
  var isOccupied = false;
  for(let i = 0; i < selectedCells.length; i++){
    if(selectedCells[i].getAttribute('occupied') > 0 ){
      isOccupied = true;
      break;
    }
  }
  newBackground = 'tomato';
  snappable = false;
  if ((shipSize === selectedCells.length) && !isOccupied){
    var newBackground = 'lightgreen';
    snappable = true;
  }
  for(let i = 0; i < selectedCells.length; i++){
    selectedCells[i].style.backgroundColor = newBackground;
  }
};

function gridCellHoverOut(target, cell){
  var newBackground = 'white';
  for(let i = 0; i < gridCells.length; i++){
    gridCells[i].style.backgroundColor = newBackground;
  }
};

function mouseMove(ev){
	ev         = ev || window.event;
	var target   = ev.target || ev.srcElement;
	var mousePos = mouseCoords(ev);
  var dragObj = target.className;
  calculatePositions(gridCells);
  getPosition(base);
  getPosition(field);
  
	if((dragObj=='ship') && (iMouseDown && !lMouseState)){

    if(target.getAttribute('occupies') !== null){

      var oldCell_id = target.getAttribute('occupies');
      var oldCell = document.getElementById(oldCell_id);

      var selectedCells = selectOCells(target, oldCell);
      for(let i = 0; i < selectedCells.length; i++){
        var temp = selectedCells[i].getAttribute('occupied');
        temp--;
        selectedCells[i].setAttribute('occupied', temp);
      }
    }

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
  
	if(curTarget){

    var cur_x = mousePos.x - mouseOffset.x;
    var cur_y = mousePos.y - mouseOffset.y;

    dragHelper.style.top  = cur_y + 'px';
    dragHelper.style.left = cur_x + 'px';

    for(let i = 0; i < gridCells.length; i++) {

      if((parseInt(gridCells[i].getAttribute('x_start')) < cur_x + 20) &&
      (parseInt(gridCells[i].getAttribute('y_start')) < cur_y + 20) &&
      (parseInt(gridCells[i].getAttribute('x_start')) + 40  > cur_x + 20) &&
      (parseInt(gridCells[i].getAttribute('y_start'))  + 40 > cur_y + 20)){
        activeCell = gridCells[i];
        if(lastCell !== activeCell){
          if(lastCell !== null){
            gridCellHoverOut(target, lastCell);
          }
          gridCellHoverIn(target, activeCell);
          lastCell = activeCell;
        }
        break;
      }
    }

    if((parseInt(gridCells[0].getAttribute('x_start')) > cur_x + 20) |
      (parseInt(gridCells[0].getAttribute('y_start')) > cur_y + 20) |
      (parseInt(gridCells[0].getAttribute('x_start')) + 400  < cur_x + 20) |
      (parseInt(gridCells[0].getAttribute('y_start'))  + 400 < cur_y + 20)){
        if(lastCell !== null){
          gridCellHoverOut(target, lastCell);
        }
        lastCell = null;
    }

  }
  
	lMouseState = iMouseDown;
	return false;
}

function mouseUp(ev){

	if(curTarget){

    document.body.removeChild(dragHelper);
    curTarget.style.display = '';

    if (lastCell !== null) {
      
      gridCellHoverOut(curTarget, lastCell);

      if(snappable){
        var parent = curTarget.parentNode;
        parent.removeChild(curTarget);
        field.appendChild(curTarget);

        curTarget.style.left = lastCell.getAttribute('x_start') - field.getAttribute('x_start') + 'px';
        curTarget.style.top = lastCell.getAttribute('y_start') - field.getAttribute('y_start') + 'px';

        curTarget.setAttribute('occupies', lastCell.id);

        var selectedCells = selectOCells(curTarget, lastCell);
        for(let i = 0; i < selectedCells.length; i++){
          var temp = selectedCells[i].getAttribute('occupied');
          temp++;
          selectedCells[i].setAttribute('occupied', temp);
        }
      }
    }

    if(lastCell === null | !snappable){

      if(curTarget.getAttribute('occupies') !== null){

        field.removeChild(curTarget);
        curTarget.removeAttribute('occupies');
        base.appendChild(curTarget);

        lastSelected.setAttribute('shipOrientation', 'horizontal');
        curTarget.style.transform = 'rotate(0deg)'

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

function buttonClicked(){
  if(lastSelected !== null){
    if(lastSelected.getAttribute('occupies') !== null){

      var currentCell_id = lastSelected.getAttribute('occupies');
      var currentCell = document.getElementById(currentCell_id);

      var oldCells = selectOCells(lastSelected, currentCell);
      for(let i = 0; i < oldCells.length; i++){
        var temp = oldCells[i].getAttribute('occupied');
        temp--;
        oldCells[i].setAttribute('occupied', temp);
      }

      var shipOrientation = lastSelected.getAttribute('shipOrientation');
      if(shipOrientation === 'horizontal') shipOrientation = 'vertical';
      else shipOrientation = 'horizontal';
      lastSelected.setAttribute('shipOrientation', shipOrientation);

      var newCells = selectCells(lastSelected, currentCell);
      var isOccupied = false;
      for(let i = 0; i < newCells.length; i++){
        if(newCells[i].getAttribute('occupied') > 0 ){
          isOccupied = true;
          break;
        }
      }

      if(!isOccupied){
        newCells = selectOCells(lastSelected, currentCell);
        for(let i = 0; i < newCells.length; i++){
          var temp = newCells[i].getAttribute('occupied');
          temp++;
          newCells[i].setAttribute('occupied', temp);
        }

        if(shipOrientation === 'horizontal') lastSelected.style.transform = 'rotate(0deg)';
        else lastSelected.style.transform = 'rotate(90deg)';

        document.getElementById('rotate').style.background = 'lightgreen';
        setTimeout(function(){document.getElementById('rotate').style.background = ''}, 600);

      }
      else{
        if(shipOrientation === 'horizontal') shipOrientation = 'vertical';
        else shipOrientation = 'horizontal';
        lastSelected.setAttribute('shipOrientation', shipOrientation);

        for(let i = 0; i < oldCells.length; i++){
          var temp = oldCells[i].getAttribute('occupied');
          temp++;
          oldCells[i].setAttribute('occupied', temp);

          for(let j = 0; j < 1000; j = j + 300) {
            setTimeout(function(){document.getElementById('rotate').style.background = 'tomato'},j);
            setTimeout(function(){document.getElementById('rotate').style.background = ''}, j + 150);
          }
        }
      }

    } else console.log('Ship is not yet placed!');
  } else console.log('No ship is yet selected!');
}

document.onmousemove = mouseMove;
document.onmousedown = mouseDown;
document.onmouseup   = mouseUp;
document.getElementById('rotate').onclick = buttonClicked;

window.onload = function(){

  dragHelper = document.createElement('DIV');
  dragHelper.style.cssText = 'position:absolute;display:none;';
  gridCells = document.getElementsByClassName('gridCell');
  base = document.getElementsByClassName('other')[0];
  field = document.getElementsByClassName('player')[0];
}