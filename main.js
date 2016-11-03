const COLORS = ['white', 'yellow', 'red', 'teal'];
const HUMAN = 2;
const AI = 3;

var Game = function() {
	var that = this;
	this.board = [];
	this.turn = 0;
	this.init = function(){
	  for(var i = 0; i < 6; i++)
	  {
		this.board[i] = [];
		for(var j = 0; j < 7; j++)
		{
			this.board[i][j] = 0;
		}
	  }
	  console.log(this.board);
	  this.drawBoard();
	};
	this.drawBoard = function(){
		var rows = document.getElementsByClassName("row");
		for(var i = 0; i < rows.length; i++){
			var cols = rows[i].children;
			for(var j = 0; j < cols.length; j++){
				console.log(cols[j]);
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
		that.AIMove(c);
		
	}

	this.AIMove = function(c){
		if(this.turn == 1){
			this.handleMove(c, AI);
		}
	}

	this.handleMove = function(c, player){
		var r = 0;
		console.log(this);
		while(r < 6 && !this.isTaken(r, c)){
			r += 1;
		}
		console.log(r);
		if (r != 0) {
		   this.board[r-1][c] = player; 
		   this.turn = 1 - this.turn;
		}
		this.drawBoard();
	}

	this.isTaken = function(r, c){
		
		return this.board[r][c] == HUMAN || this.board[r][c] == AI;
	}

};





var game = new Game();
game.init();