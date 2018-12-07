var mouseOffset = null;
var iMouseDown  = false;
var lMouseState = false;
var dragObject  = null;
var curTarget   = null;
var lastTarget  = null;
var dragHelper  = null;
var cells = null;
var activeCell = null;
var lastCell = null;

var fieldSize = 10;
var shipSelected = null;
var shipOrientation = "horizontal";
var shipSize = 0;
var snappable = false;

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
            curTarget.style.color = "red";
            shipSelected = curTarget;
            shipSize = parseInt(shipSelected.id.substring(5,6));
            shipOrientation = "horizontal";
            if(lastTarget !== null){
                lastTarget.style.color = "black";
            }
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
    for(let i = 0; i < cells.length; i++) {
      if((parseInt(cells[i].getAttribute('x_start')) < cur_x + 20) &&
					(parseInt(cells[i].getAttribute('y_start')) < cur_y + 20) &&
					(parseInt(cells[i].getAttribute('x_start')) + 40  > cur_x + 20) &&
					(parseInt(cells[i].getAttribute('y_start'))  + 40 > cur_y + 20)){
            activeCell = cells[i];
            // console.log(activeCell.getAttribute('id'));
            if(lastCell !== null){
                gridCellHoverOut(lastCell);
            }
            gridCellHoverIn(activeCell);
            lastCell = activeCell;
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



// var main = function(){
//   "use strict";
  
    // var fieldSize = 10;
    // var shipSelected = null;
    // var shipOrientation = "horizontal";
    // var shipSize = 0;
    // var snappable = false;

    // var selectShip = function(){
    //     //   document.getElementById(EventSource.getElementById).style.color = "red";
    //     this.style.color = "red";
    // };

//   $(".other div").on("click", function(){
//     //   console.log(this.id);
//     // selectShip(this);
//     if(shipSelected === null){
//         this.style.color = "red";
//         shipSelected = this;
//         shipSize = parseInt(this.id.substring(5,6));
//     }
//     if(shipSelected !== null && shipSelected !== this){
//         shipSelected.style.color = "black";
//         this.style.color = "red";
//         shipSelected = this;
//         shipSize = parseInt(this.id.substring(5,6));
//         shipOrientation = "horizontal";
//     }
//     });

    var gridCellHoverIn = function(arg){
        if(shipSelected !== null){
    //Select subsequent cells in horizontal or vertical direction as far as the ship's size stretches
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
                if(shipOrientation === "horizontal"){
                // console.log("ship to big in x direction:");
                // console.log("xCoord:" +xCoord+" shipSize: "+shipSize+" largestCoord: "+largestCoord);
                }
                if(shipOrientation === "vertical"){
                    // console.log("ship to big in y direction:");
                    // console.log("yCoord:" +yCoord+" shipSize: "+shipSize+" largestCoord: "+largestCoord);
                }
                newBackground = "tomato";
                snappable = false;
            }                 
            // console.log(fieldSize - startCoord + 1);
            for(var i = 0; i<Math.min(shipSelected.id.substring(5,6), fieldSize - startCoord + 1); i++){
                    var cellCoord;
                if(shipOrientation === "horizontal" ){
                    cellCoord = parseInt(xCoord) + i;
                    // console.log("xNow: "+xNow);
                    var cell = document.getElementById(yCoord+cellCoord);
                    // console.log("coords of next cell: "+yCoord+cellCoord);
                }else if(shipOrientation === "vertical"){
                    cellCoord = String.fromCharCode(yCoord.charCodeAt() + i);
                    var cell = document.getElementById(cellCoord+xCoord);
                    // console.log("coords of next cell: "+cellCoord+xCoord);
                }
                // console.log(newBackground);
                if(newBackground === "lightgreen"){
                    cell.setAttribute("occupied", true);
                }
                cell.style.backgroundColor = newBackground;
            }
            // arg.style.backgroundColor = newBackground;
        }
    };
    var gridCellHoverOut = function(arg){
        if(shipSelected !== null){
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
            for(var i = 0; i<Math.min(shipSelected.id.substring(5,6), fieldSize - startCoord + 1); i++){
                var cellCoord;
                var cell;
                if(shipOrientation === "horizontal" ){
                    cellCoord = parseInt(xCoord) + i;
                    // console.log("xNow: "+xNow);
                    cell = document.getElementById(yCoord+cellCoord);
                    // console.log("coords of next cell: "+yCoord+cellCoord);
                }else if(shipOrientation === "vertical"){
                    cellCoord = String.fromCharCode(yCoord.charCodeAt() + i);
                    cell = document.getElementById(cellCoord+xCoord);
                    // console.log("coords of next cell: "+cellCoord+xCoord);
                }
            // console.log(newBackground);
            cell.setAttribute("occupied", false);
            cell.style.backgroundColor = newBackground;
            }
            // arg.style.backgroundColor = newBackground;
            snappable = false;
        }
    };
    // $(".board > .gridCell").hover(
    //     function(){
    //         gridCellHoverIn(this);
    //     }, function(){
    //         gridCellHoverOut(this);
    //     });


        // var toggleShipOrientation = function(){
        //     // console.log("toggling shipOrientation");
        //     if(shipOrientation === "horizontal"){
        //         shipOrientation = "vertical";
        //     }else if(shipOrientation === "vertical"){
        //         shipOrientation = "horizontal";
        //     }
        // }
        // $(".other button").click(function(event){
        //     if(this.id === "rotate"){
        //         toggleShipOrientation();
        //     }
        //     if(this.id === "play"){
        //         console.log("play button clicked (no further implementation yet)");
        //         // gridCellHoverIn(document.getElementById("A1"));
        //     }
        // });
    // $(".board > .gridCell").hover(function(){
    //     // console.log("gridCell hoverIn");

    //     this.style.backgroundColor = "black";
    // }, function (){
    //     this.style.backgroundColor = "white"}
    //     );

  // var addCommentFromInputBox = function(){
  //     var $new_comment;
  //    if($(".comment-input input").val() !== ""){
  //         $new_comment = $("<p>").text($(".comment-input input").val());
  //         $new_comment.hide();
  //         $(".comments").append($new_comment);
  //         $(".comment-input input").val("");
  //         $new_comment.fadeIn();
  //    }
  // };

  // $(".comment-input button").on("dblclick", function(){
      // alert("You double clicked!");
  // });

  // $(".comment-input button").on("click", function(event) {
  //     addCommentFromInputBox();
  // });

  // $(".comment-input input").on("keypress", function (event){
  //     if (event.keyCode == 13){
  //         addCommentFromInputBox();
  //     }
  // });
// };

// $(document).ready(main);
