var main = function(){
  "use strict";
  
    var shipSelected = null;
    var shipOrientation = "horizontal";

  var selectShip = function(){
    //   document.getElementById(EventSource.getElementById).style.color = "red";
    this.style.color = "red";
  };

  $(".other div").on("click", function(){
      console.log(this.id);
    // selectShip(this);
    if(shipSelected == null){
        this.style.color = "red";
        shipSelected = this;
    }
    if(shipSelected != null){
        shipSelected.style.color = "black";
        this.style.color = "red";
        shipSelected = this;
        shipOrientation = "horizontal";
    }
    });



    var gridCellHoverIn = function(){
        if(shipSelected != null){
    //Select subsequent cells in horizontal or vertical direction as far as the ship's size stretches
            var coord = this.attr('id');
            var i = 0;
            if(shipOrientation === "horizontal" ){
                i = 1;
            }
        this.style.backgroundColor = "black"
    }
    };
    var gridCellHoverOut = function(){this.style.backgroundColor = "white"};
        $(".board > .gridCell").hover(gridCellHoverIn, gridCellHoverOut);

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