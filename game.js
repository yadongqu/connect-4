var HUMAN = 1;
var AI = 2;
var Game = function() {
	var that = this;
	this.board = [];
	this.score = 0; // final score
	this.total = 0; // for total rounds
	this.count = 0; // for winning rounds
	this.turn = 0;  // 0 for human, 1 for ai;
	this.winner = null;
	this.init = function(){
	  for(var i = 0; i < 6; i++)
	  {
		this.board[i] = [];
		for(var j = 0; j < 7; j++)
		{
			// init the board = 0;
			this.board[i][j] = 0;
		}
	  }
	  
	};
	this.start = function(){
		this.winner = null;
	    this.total += 1;
	    this.turn = 0;
	}

	this.setCount = function(){
		if(this.winner == HUMAN){
			this.count += 1;
			this.score = this.count * 100;
		}
	}

	// ai take random step for now.
	this.getAIRandomMove = function(){
		if(this.turn == 1){
			var moves = this.getPossibleMove();
			var move = Math.floor(Math.random() * moves.length);
			return moves[move];
		}
	}

	// get still open columns
	this.getEmpty = function(){
		var arr = [];
		for(var i = 0; i < 6; i++)
	  {
		for(var j = 0; j < 7; j++)
		{
			if(this.board[i][j] == 0 && arr.indexOf(j) == -1){
				arr.push(j);
			}
		}
	  }
	  return arr;
	}

	// get all posiblemoves return value [row, col];
	this.getPossibleMove = function(){
		var cols = this.getEmpty();
		var moves = [];
		
		for(var i = 0; i < cols.length; i++){
			var col = cols[i];
			var row = 0;
			while(row < 6 && this.board[row][col] == 0){
				row += 1;
			}
			if(row != 0){
			   moves.push([row-1, col]);
			} else {
				moves.push([row, col]);
			}	
		}
		return moves;
	}

	this.getHumanMove = function(c){
		var moves = this.getPossibleMove();
		for(var i = 0; i < moves.length; i++){
			console.log("checking " + moves[i]);
			if (moves[i][1] == c){
				console.log("I choose " + moves[i]);
				return moves[i];
			} 
		}
	}

	this.play = function(c){
		if(this.getHumanMove(c) != undefined){
			if(this.turn == 0){
				this.handleMove(this.getHumanMove(c), HUMAN);
			}
			
			if(!this.getWinner() && this.turn == 1){
				this.handleMove(this.getAIRandomMove(), AI);
			}
		    
		}
	}

	
	this.handleMove = function(move, player){
		console.log(move);
		this.board[move[0]][move[1]] = player;
		if(!this.getWinner()){
			this.turn = 1 - this.turn;
		} else {
			this.turn = -1;
		}
		
	}

	this.isTaken = function(r, c){
		return this.board[r][c] == HUMAN || this.board[r][c] == AI;
	}

	

	this.hasDrawn = function(){
		if(!this.getWinner() && this.getEmpty().length == 0){
			return true;
		}
		return false;
	}

	this.hasWon = function(){
		if(this.getWinner() == HUMAN){
			this.winner = HUMAN;
			this.setCount();
		    this.turn = -1;
		    return true;
		} else if(this.getWinner() == AI){
			this.winner = AI;
			this.setCount();
		    this.turn = -1;
		    return true;
		}
		return false;
	}

	this.getWinner = function(){
		// horizontal
		for(var i = 0; i < 6; i++){
			for(var j = 0; j < 4; j++){
				if(this.board[i][j] != 0 && this.board[i][j] == this.board[i][j+1] &&
					this.board[i][j+1] == this.board[i][j+2] &&
					this.board[i][j+2] == this.board[i][j+3])
				{
					return this.board[i][j];		
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
					return this.board[i][j];
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
					&& this.board[i+2][j+2] == this.board[i+3][j+3]){
					return this.board[i][j];
				}
			}
		}
		for(var i = 0; i < 3; i++){
			for(var j = 6; j > 2; j--){
				if(this.board[i][j] != 0 &&
					this.board[i][j] == this.board[i+1][j-1]
					&& this.board[i+1][j-1] == this.board[i+2][j-2]
					&& this.board[i+2][j-2] == this.board[i+3][j-3]){
					return this.board[i][j];
				}
			}
		}
		return false;

	}

};

