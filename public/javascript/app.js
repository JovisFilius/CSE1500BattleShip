var mouseOffset = null;
var iMouseDown  = false;
var lMouseState = false;
var dragObject  = null;
var curTarget   = null;
var lastTarget  = null;
var dragHelper  = null;
var cells = null;

function calculatePositions(e){
  for(var i = 0; i < e.length; i++) {
    getPosition(e[i]);
  }
}

function mouseCoords(ev){
	if(ev.pageX || ev.pageY){
		return {x:ev.pageX, y:ev.pageY};
	}
	return {
		x:ev.clientX + document.body.scrollLeft - document.body.clientLeft,
		y:ev.clientY + document.body.scrollTop  - document.body.clientTop
	};
}

function getMouseOffset(target, ev){
	ev = ev || window.event;
	var docPos    = getPosition(target);
	var mousePos  = mouseCoords(ev);
	return {x:mousePos.x - docPos.x, y:mousePos.y - docPos.y};
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

function mouseMove(ev){
	ev         = ev || window.event;
	var target   = ev.target || ev.srcElement;
	var mousePos = mouseCoords(ev);
  var dragObj = target.className;
  
	if(dragObj=='ship'){
		if(iMouseDown && !lMouseState){
			curTarget     = target;
			mouseOffset   = getMouseOffset(target, ev);
      for(var i=0; i<dragHelper.childNodes.length; i++) dragHelper.removeChild(dragHelper.childNodes[i]);
      var copy = curTarget.cloneNode(true);
      copy.style.top = '0px';
      copy.style.left = '0px';
			dragHelper.appendChild(copy);
      dragHelper.firstChild.removeAttribute('DragObj');
      dragHelper.style.display = '';
      curTarget.style.display = 'none';
		}
  }
  
	if(curTarget){
    var cur_x = mousePos.x - mouseOffset.x;
    var cur_y = mousePos.y - mouseOffset.y;
    dragHelper.style.top  = cur_y + 'px';
    dragHelper.style.left = cur_x + 'px';
    var activeCell = null;
    for(let i = 0; i < cells.length; i++) {
      if((parseInt(cells[i].getAttribute('x_start')) < cur_x + 20) &&
					(parseInt(cells[i].getAttribute('y_start')) < cur_y + 20) &&
					(parseInt(cells[i].getAttribute('x_start')) + 40  > cur_x + 20) &&
					(parseInt(cells[i].getAttribute('y_start'))  + 40 > cur_y + 20)){
            activeCell = cells[i];
            console.log(activeCell.getAttribute('id'));
						break;
				}
    }
	}
	lMouseState = iMouseDown;
	lastTarget  = target;
	lMouseState = iMouseDown;
	return false;
}
function mouseUp(ev){
	if(curTarget){
		dragHelper.style.display = 'none';
		curTarget.style.display = '';
	}
	curTarget  = null;
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
  document.body.appendChild(dragHelper);
  cells = document.getElementsByClassName('gridCell');
  calculatePositions(cells);
}