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
	// a predefined value to help ai decide how to place
	this.cellValues = [
	    [3, 4, 5, 7, 5, 4, 3],
        [4, 6, 8, 10, 8, 6, 4],
        [5, 8, 11, 13, 11, 8, 5],
        [5, 8, 11, 13, 11, 8, 5],
        [4, 6, 8, 10, 8, 6, 4],
        [3, 4, 5, 7, 5, 4, 3]
        ];



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

	// restart the game
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

    // get the human input value
	this.getHumanMove = function(c){
		var moves = this.getPossibleMove();
		for(var i = 0; i < moves.length; i++){
			
			if (moves[i][1] == c){
				
				return moves[i];
			} 
		}
	}

	// main controller.
	this.play = function(c){
		if(this.getHumanMove(c) != undefined){
			if(this.turn == 0){
				this.handleMove(this.getHumanMove(c), HUMAN);
			}
			
			if(!this.getWinner() && this.turn == 1){
				this.handleMove(this.getAIMove(), AI);
			}

			this.restoreValues();
		}
	}


	
	this.getAIMove = function(){
		var max = -10000;
		var bestMove = [];
		var moves = this.getPossibleMove();
		console.log("possible Moves" + moves);
		for (var i = 0; i < moves.length; i++){

			var r = moves[i][0];
			var c = moves[i][1];

			this.is3InRow(moves[i]);
			this.is2InRow();
			if(max < this.cellValues[r][c]){
				max = this.cellValues[r][c];
				bestMove = moves[i];
			}
		}
		console.log("my best move" + bestMove);
		return bestMove;
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


    // helper funcntion used to restore predefined value
	this.restoreValues = function(){
		this.cellValues = [
	    [3, 4, 5, 7, 5, 4, 3],
        [4, 6, 8, 10, 8, 6, 4],
        [5, 8, 11, 13, 11, 8, 5],
        [5, 8, 11, 13, 11, 8, 5],
        [4, 6, 8, 10, 8, 6, 4],
        [3, 4, 5, 7, 5, 4, 3]
        ];

	}


	this.is3InRow = function(move){
		
		if(this.getWinner() == AI){
			this.cellValues[move[0][move[1]]] = 20000;
		}

		this.board[move[0]][move[1]] = AI;
		var pMove = this.getPossibleMove();
		
		for(var i = 0; i < pMove.length; i++){
			this.board[pMove[i][0]][pMove[i][1]] = HUMAN;
			if(this.getWinner() == HUMAN){
				
				this.cellValues[move[0]][move[1]] = -100;
			}
			this.board[pMove[i][0]][pMove[i][1]] = 0;
		}

		this.board[move[0]][move[1]] = HUMAN;
		if(this.getWinner() == HUMAN && this.cellValues[move[0]][move[1]] > 0){
			this.cellValues[move[0]][move[1]] = 10000;
		}

		this.board[move[0]][move[1]] = 0;
	}


	this.is2InRow = function(){
		var moves = this.getPossibleMove();
		for(var i = 0; i < moves.length; i++){
			for(var j = 0; j < moves.length; j++){

				var move1 = moves[i];
				var move2 = moves[j];
				if(move1 != move2){
					this.board[move1[0]][move1[1]] = HUMAN;
					this.board[move2[0]][move2[1]] = HUMAN;
					if(this.getWinner() == HUMAN){
						if(Math.abs(move1[0] - move2[0]) == 3 || Math.abs(move1[1] - move2[1]) == 3){
						   if(this.cellValues[move1[0]][move1[1]] < 5000 && this.cellValues[move1[0]][move1[1]] > 0){
						   	this.cellValues[move1[0]][move1[1]] = 5000;
						   }			
						}
					}
				}
				this.board[move1[0]][move1[1]] = 0;
				this.board[move2[0]][move2[1]] = 0;
			}
		}
	}




};

