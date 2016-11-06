function Game() {
    this.rows = 6;
    this.columns = 7;
    this.status = 0;
    this.depth = 4;
    this.score = 100000, this.round = 0;
    this.winning_array = [];
    this.iterations = 0;
    that = this;
    that.init();
}
Game.prototype.init = function() {
    var game_board = new Array(that.rows);
    for (var i = 0; i < game_board.length; i++) {
        game_board[i] = new Array(that.columns);
        for (var j = 0; j < game_board[i].length; j++) {
            game_board[i][j] = null;
        }
    }
    this.board = new Board(this, game_board, 0);
    var game_board = "";
    for (var i = 0; i < that.rows; i++) {
        game_board += "<tr>";
        for (var j = 0; j < that.columns; j++) {
            game_board += "<td class='empty'></td>";
        }
        game_board += "</tr>";
    }
    document.getElementById('game_board').innerHTML = game_board;
    var td = document.getElementById('game_board').getElementsByTagName("td");
    for (var i = 0; i < td.length; i++) {
        if (td[i].addEventListener) {
            td[i].addEventListener('click', that.act, false);
        } else if (td[i].attachEvent) {
            td[i].attachEvent('click', that.act)
        }
    }
}
Game.prototype.act = function(e) {
    var element = e.target || window.event.srcElement;
    if (that.round == 0) that.place(element.cellIndex);
    if (that.round == 1) that.generateComputerDecision();
}
Game.prototype.place = function(column) {
    if (that.board.score() != that.score && that.board.score() != -that.score && !that.board.isFull()) {
        for (var y = that.rows - 1; y >= 0; y--) {
            if (document.getElementById('game_board').rows[y].cells[column].className == 'empty') {
                if (that.round == 1) {
                    document.getElementById('game_board').rows[y].cells[column].className = 'coin cpu-coin';
                } else {
                    document.getElementById('game_board').rows[y].cells[column].className = 'coin human-coin';
                }
                break;
            }
        }
        if (!that.board.place(column)) {
            return alert("Invalid move!");
        }
        that.round = that.switchRound(that.round);
        that.updateStatus();
    }
}
Game.prototype.generateComputerDecision = function() {
    if (that.board.score() != that.score && that.board.score() != -that.score && !that.board.isFull()) {
        that.iterations = 0;
        document.getElementById('loading').style.display = "block";
        setTimeout(function() {
            var startzeit = new Date().getTime();
            var ai_move = that.maximizePlay(that.board, that.depth);
            var laufzeit = new Date().getTime() - startzeit;
            document.getElementById('ai-time').innerHTML = laufzeit.toFixed(2) + 'ms';
            that.place(ai_move[0]);
            document.getElementById('ai-column').innerHTML = 'Column: ' + parseInt(ai_move[0] + 1);
            document.getElementById('ai-score').innerHTML = 'Score: ' + ai_move[1];
            document.getElementById('ai-iterations').innerHTML = that.iterations;
            document.getElementById('loading').style.display = "none";
        }, 100);
    }
}
Game.prototype.maximizePlay = function(board, depth) {
    var score = board.score();
    if (board.isFinished(depth, score)) return [null, score];
    var max = [null, -99999];
    for (var column = 0; column < that.columns; column++) {
        var new_board = board.copy();
        if (new_board.place(column)) {
            that.iterations++;
            var next_move = that.minimizePlay(new_board, depth - 1);
            if (max[0] == null || next_move[1] > max[1]) {
                max[0] = column;
                max[1] = next_move[1];
            }
        }
    }
    return max;
}
Game.prototype.minimizePlay = function(board, depth) {
    var score = board.score();
    if (board.isFinished(depth, score)) return [null, score];
    var min = [null, 99999];
    for (var column = 0; column < that.columns; column++) {
        var new_board = board.copy();
        if (new_board.place(column)) {
            that.iterations++;
            var next_move = that.maximizePlay(new_board, depth - 1);
            if (min[0] == null || next_move[1] < min[1]) {
                min[0] = column;
                min[1] = next_move[1];
            }
        }
    }
    return min;
}
Game.prototype.switchRound = function(round) {
    if (round == 0) {
        return 1;
    } else {
        return 0;
    }
}
Game.prototype.updateStatus = function() {
    if (that.board.score() == -that.score) {
        that.status = 1;
        that.markWin();
        alert("You have won!");
    }
    if (that.board.score() == that.score) {
        that.status = 2;
        that.markWin();
        alert("You have lost!");
    }
    if (that.board.isFull()) {
        that.status = 3;
        alert("Tie!");
    }
    var html = document.getElementById('status');
    if (that.status == 0) {
        html.className = "status-running";
        html.innerHTML = "running";
    } else if (that.status == 1) {
        html.className = "status-won";
        html.innerHTML = "won";
    } else if (that.status == 2) {
        html.className = "status-lost";
        html.innerHTML = "lost";
    } else {
        html.className = "status-tie";
        html.innerHTML = "tie";
    }
}
Game.prototype.markWin = function() {
    document.getElementById('game_board').className = "finished";
    for (var i = 0; i < that.winning_array.length; i++) {
        var name = document.getElementById('game_board').rows[that.winning_array[i][0]].cells[that.winning_array[i][1]].className;
        document.getElementById('game_board').rows[that.winning_array[i][0]].cells[that.winning_array[i][1]].className = name + " win";
    }
}
Game.prototype.restartGame = function() {
    if (confirm('Game is going to be restarted.\nAre you sure?')) {
        var difficulty = document.getElementById('difficulty');
        var depth = difficulty.options[difficulty.selectedIndex].value;
        that.depth = depth;
        that.status = 0;
        that.round = 0;
        that.init();
        document.getElementById('ai-iterations').innerHTML = "?";
        document.getElementById('ai-time').innerHTML = "?";
        document.getElementById('ai-column').innerHTML = "Column: ?";
        document.getElementById('ai-score').innerHTML = "Score: ?";
        document.getElementById('game_board').className = "";
        that.updateStatus();
    }
}

function Start() {
    window.Game = new Game();
}
window.onload = function() {
    Start()
};
