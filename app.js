var main = function(){
  "use strict";
  
    var fieldSize = 10;
    var shipSelected = null;
    var shipOrientation = "horizontal";
    var shipSize = 0;

    var selectShip = function(){
        //   document.getElementById(EventSource.getElementById).style.color = "red";
        this.style.color = "red";
    };

  $(".other div").on("click", function(){
      console.log(this.id);
    // selectShip(this);
    if(shipSelected === null){
        this.style.color = "red";
        shipSelected = this;
        shipSize = parseInt(this.id.substring(5,6));
    }
    if(shipSelected !== null && shipSelected !== this){
        shipSelected.style.color = "black";
        this.style.color = "red";
        shipSelected = this;
        shipSize = parseInt(this.id.substring(5,6));
        shipOrientation = "horizontal";
    }
    });

    var gridCellHoverIn = function(){
        if(shipSelected !== null){
    //Select subsequent cells in horizontal or vertical direction as far as the ship's size stretches
            var yCoord = this.id.substring(0,1);
            var xCoord = this.id.substring(1, this.id.length);
            var newBackground = "lightgreen";
            var largestCoord = 10;
            var startCoord = 1;
            if(shipOrientation === "horizontal"){
                startCoord = parseInt(xCoord);
            }else if (shipOrientation === "vertical"){
                startCoord = yCoord.charCodeAt() - 64;
            }
            largestCoord = startCoord + shipSize - 1;
            if(largestCoord > fieldSize){
                if(shipOrientation === "horizontal"){
                console.log("ship to big in x direction:");
                console.log("xCoord:" +xCoord+" shipSize: "+shipSize+" largestCoord: "+largestCoord);
                }
                if(shipOrientation === "vertical"){
                    console.log("ship to big in y direction:");
                    console.log("yCoord:" +yCoord+" shipSize: "+shipSize+" largestCoord: "+largestCoord);
                }
                newBackground = "tomato";
            }                 
            console.log(fieldSize - startCoord + 1);
            for(var i = 1; i<Math.min(shipSelected.id.substring(5,6), fieldSize - startCoord + 1); i++){
                    var cellCoord;
                if(shipOrientation === "horizontal" ){
                    cellCoord = parseInt(xCoord) + i;
                    // console.log("xNow: "+xNow);
                    var cell = document.getElementById(yCoord+cellCoord);
                    console.log("coords of next cell: "+yCoord+cellCoord);
                }else if(shipOrientation === "vertical"){
                    cellCoord = String.fromCharCode(yCoord.charCodeAt() + i);
                    var cell = document.getElementById(cellCoord+xCoord);
                    console.log("coords of next cell: "+cellCoord+xCoord);
                }
                console.log(newBackground);
                cell.style.backgroundColor = newBackground;
            }
            this.style.backgroundColor = newBackground;
        }
    };
    var gridCellHoverOut = function(){
        if(shipSelected !== null){
            var yCoord = this.id.substring(0,1);
            var xCoord = this.id.substring(1, this.id.length);
            var newBackground = "white";
            var largestCoord = 10;
            var startCoord = 1;
            if(shipOrientation === "horizontal"){
                startCoord = parseInt(xCoord);
            }else if (shipOrientation === "vertical"){
                startCoord = yCoord.charCodeAt() - 64;
            }
            largestCoord = startCoord + shipSize - 1;
            for(var i = 1; i<Math.min(shipSelected.id.substring(5,6), fieldSize - startCoord + 1); i++){
                var cellCoord;
                var cell;
                if(shipOrientation === "horizontal" ){
                    cellCoord = parseInt(xCoord) + i;
                    // console.log("xNow: "+xNow);
                    cell = document.getElementById(yCoord+cellCoord);
                    console.log("coords of next cell: "+yCoord+cellCoord);
                }else if(shipOrientation === "vertical"){
                    cellCoord = String.fromCharCode(yCoord.charCodeAt() + i);
                    cell = document.getElementById(cellCoord+xCoord);
                    console.log("coords of next cell: "+cellCoord+xCoord);
                }
            console.log(newBackground);
            cell.style.backgroundColor = newBackground;
            }
            this.style.backgroundColor = newBackground;
        }
    };
        $(".board > .gridCell").hover(gridCellHoverIn, gridCellHoverOut);


        var toggleShipOrientation = function(){
            console.log("toggling shipOrientation");
            if(shipOrientation === "horizontal"){
                shipOrientation = "vertical";
            }else if(shipOrientation === "vertical"){
                shipOrientation = "horizontal";
            }
        }
        $(".other button").on("click", function(event){
            if(this.id === "rotate"){
                toggleShipOrientation();
            }
            if(this.id === "play"){
                console.log("play button clicked");
            }
        });
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
};

$(document).ready(main);