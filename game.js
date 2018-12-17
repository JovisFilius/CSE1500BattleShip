var game = function (gameID) {
    this.id = gameID;
    this.conA = null;
    this.conB = null;
    this.playerA = null;
    this.playerB = null;
    this.dataA = null;
    this.dataB = null;
    this.gameState = "0 JOINT"; //"A" means A won, "B" means B won, "ABORTED" means the game was aborted
};

game.prototype.addPlayer = function (p) {

    if(this.gameState = "0 JOINT"){
        this.gameState = "1 JOINT";
    }
    else{
        this.gameState = "2 JOINT";
    }

    if (this.playerA == null) {
        this.playerA = p;
        return "A";
    }
    else {
        this.playerB = p;
        return "B";
    }
};

module.exports = game;