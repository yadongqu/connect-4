const COLORS = ['white', 'yellow', 'red', 'teal'];
const HUMAN = 1;
const AI = 2;


var Game = function() {
	var that = this;
	this.board = [];
	this.turn = 0;  // 0 for human, 1 for ai;
	this.init = function(){
	  for(var i = 0; i < 6; i++)
	  {
		this.board[i] = [];
		for(var j = 0; j < 7; j++)
		{
			this.board[i][j] = 0;
		}
	  }
	  this.drawBoard();
	};
	this.drawBoard = function(){
		var rows = document.getElementsByClassName("row");
		for(var i = 0; i < rows.length; i++){
			var cols = rows[i].children;
			for(var j = 0; j < cols.length; j++){	
				cols[j].addEventListener('click', this.humanMove);
				cols[j].myIndex = [i, j];
				cols[j].style.backgroundColor = COLORS[this.board[i][j]];
			}
		}
	}
	this.humanMove = function(e){
		if(that.turn == 0){
		var c = e.target.myIndex[1];
		that.handleMove(c, HUMAN);
		}
		var random =Math.floor(Math.random()*that.getEmpty().length);
		that.AIMove(that.getEmpty()[random]);
	}

	this.AIMove = function(c){
		if(this.turn == 1){
			this.handleMove(c, AI);
		}
	}

	this.getEmpty = function(){
		var arr = [];
		for(var i = 0; i < 6; i++)
	  {
		for(var j = 0; j < 7; j++)
		{
			if(this.board[i][j] == 0){
				arr.push(j);
			}
		}
	  }
	  return arr;
	}

	this.handleMove = function(c, player){
		var r = 0;
		while(r < 6 && !this.isTaken(r, c)){
			r += 1;
		}
		if (r != 0) {
		   this.board[r-1][c] = player; 
		   this.turn = 1 - this.turn;
		}
		this.drawBoard();
		console.log("check");
		if(this.checkWin()){
			console.log("win");
			this.showInfo();
		}
	}

	this.showInfo = function(){
		var info = document.getElementById('info');
		if(this.winner == HUMAN){
		   info.innerHTML = "You win";
		} else {
			info.innerHTML = "You lose";
		}
		
	}


	this.isTaken = function(r, c){
		return this.board[r][c] == HUMAN || this.board[r][c] == AI;
	}

	this.winner = null;

	this.checkWin = function(){
		// horizontal
		for(var i = 0; i < 6; i++){
			for(var j = 0; j < 7 - 3; j++){
				if(this.board[i][j] != 0 && this.board[i][j] == this.board[i][j+1] &&
					this.board[i][j+1] == this.board[i][j+2] &&
					this.board[i][j+2] == this.board[i][j+3])
				{
					this.turn = -1;
					this.winner = this.board[i][j];
					return true;		
				}
			}
		}

		// vertical
		var j = 0;
		while(j < 7){
			for(var i = 0; i < 3; i++){
				if(this.board[i][j] != 0 && this.board[i][j] == this.board[i+1][j]
					&& this.board[i+1][j] == this.board[i+2][j]
					&& this.board[i+2][j] == this.board[i+3][j])
				{
					this.turn = -1;
					this.winner = this.board[i][j];
					return true;
				}
			}
			j += 1;
		}

		// diagonal
		for(var i = 0; i < 3; i++){
			for(var j = 0; j < 4; j++){
				if(this.board[i][j] != 0 && 
					this.board[i][j] == this.board[i+1][j+1] &&
					this.board[i+1][j+1] == this.board[i+2][j+2]
					&& this.board[i+3][j+3]){
					this.turn = -1;
			     	this.winner = this.board[i][j];
				    return true;
				}
			}
		}
		for(var i = 0; i < 3; i++){
			for(var j = 6; j > 2; j--){
				if(this.board[i][j] != 0 &&
					this.board[i][j] == this.board[i+1][j-1]
					&& this.board[i+1][j-1] == this.board[i+2][j-2]
					&& this.board[i+2][j-2] == this.board[i+3][j-3]){
					this.turn = -1;
				    this.winner = this.board[i][j];
				    return true;
				}
			}
		}

	}

};


var game = new Game();
game.init();