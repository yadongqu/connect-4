const colors = ['/img/default.png', '/img/human.png', '/img/ai.png'];

 
var renderer = PIXI.autoDetectRenderer(600, 700,{"antialias": true});
renderer.backgroundColor = 0x1099bb;

renderer.view.style.borderRadius = "30px";
//Add the canvas to the HTML document
document.body.appendChild(renderer.view);
let stage = new PIXI.Container(0xFFFFFF);
let TextureCache = PIXI.utils.TextureCache;

PIXI.loader
   .add("/img/default.png")
   .add("/img/human.png")
   .add("/img/ai.png")
   .add("/img/startbutton.png")
   .load(setup);

sounds.load(["click.wav", "end.mp3"]);
sounds.whenLoaded  = addSound;

let clickSound, endSound;
function addSound(){
	clickSound = sounds["click.wav"];
	endSound = sounds["end.mp3"];
}



var game = new Game();
game.init();
game.turn = -1;
var board = game.board;

function setup(){
	drawTitle();
	drawScoreAndRound();
	drawButton();
	drawBoard();
	animate();
}

function drawTitle(){
	var titleStyle = {
    fontFamily : 'Arial',
    fontSize : '36px',
    fontStyle : 'italic',
    fontWeight : 'bold',
    fill : '#F7EDCA',
    stroke : '#4a1850',
    strokeThickness : 5,
    dropShadow : true,
    dropShadowColor : '#000000',
    dropShadowAngle : Math.PI / 6,
    dropShadowDistance : 6,
    wordWrap : true,
    wordWrapWidth : 440,
	};

	var titleText = new PIXI.Text('CONNECT 4',titleStyle);
	titleText.x = renderer.width/2 - titleText.width/2;
	titleText.y = 30;
	titleText.name = "title";
	stage.addChild(titleText);
}


let button;
function drawButton(){
	let texture = TextureCache["/img/startbutton.png"];
    button = new PIXI.Sprite(texture);
    button.scale.set(0.5);
    button.x = renderer.width/2 - button.width/2;
    button.y = 90;
    button.interactive = true;
    button.on('mouseover',handleButtonMouseOver);
    button.on('mouseout',handleButtonMouseOut);
    button.on('click', handleButtonClick);
    stage.addChild(button);   
}

function handleButtonMouseOut(e){
	e.data.target.scale.set(0.5, 0.5);
}

function handleButtonMouseOver(e){
	e.data.target.scale.set(0.6, 0.6);
}


function handleButtonClick(e){
	clickSound.play();
	e.target.scale.set(0.6, 0.6);
	game.init();
	game.start();
	score.text = 'Score: ' + game.score;
	round.text = 'Round: ' + game.total;
	stage.getChildAt(0).text = "CONNECT 4";
	stage.removeChildren();
	setup();
}


let score, round;
function drawScoreAndRound(){
	var titleStyle = {
    fontFamily : 'Arial',
    fontSize : '26px',
    fontStyle : 'italic',
    fontWeight : 'bold',
    fill : '#F7EDCA',
    stroke : '#4a1850',
    strokeThickness : 5,
    dropShadow : true,
    dropShadowColor : '#000000',
    dropShadowAngle : Math.PI / 6,
    dropShadowDistance : 6,
    wordWrap : true,
    wordWrapWidth : 440
	};
    score = new PIXI.Text('Score: ' + game.score, titleStyle);
	score.x = 40;
	score.y = 180;
	stage.addChild(score);

	round = new PIXI.Text('Round: ' + game.total, titleStyle);
	round.x = 440;
	round.y = 180;
	stage.addChild(round);
}




function drawCircle(x, y, id, img){
	let graphics = new PIXI.Graphics();
	graphics.beginFill(0xffffff);
	graphics.drawCircle(x, y, 30);
	graphics.endFill();
    stage.addChild(graphics);
    let texture = TextureCache[img];
    let player = new PIXI.Sprite(texture);
	player.position.x = x-31;
	player.position.y = y-31;
	stage.addChild(player);
	
	player.mask = graphics;
	player.interactive = true;
	player.indexID = id;
    player.on('click', handleClick);
    player.on('mouseover', handleMouseOver);
    player.on('mouseout', handleMouseLeave);
}

function getSprites(){
	var children = stage.children;
	var sprites = []
	for(var i = 5; i < children.length; i+=2){
		// board sprite start at index 5
		sprites.push(children[i]);
	}
	return sprites;
}


function handleClick(e){
	clickSound.play();
	if(game.turn == 0){
		var id = e.target.indexID;
		var i = id[0];
		var j = id[1];
		game.play(j);
		drawBoard();
		if(game.hasWon()){
			showWin();
			endSound.play();
		}	
	}
}

function handleMouseOver(e){
	var col = e.data.target.indexID[1];
	var sprites = getSprites();
	for(var i = 0; i < sprites.length; i++){
		if (i % 7 == col){
			sprites[i].alpha = 0.2;
		}
	}
}

function handleMouseLeave(e){
	var col = e.data.target.indexID[1];
	var sprites = getSprites();
	for(var i = 0; i < sprites.length; i++){
		if (i % 7 == col){
			sprites[i].alpha = 1;
		}
	}
}

function drawBoard(){
   var y = 220;
   for(var i = 0; i < 6; i++){
    y += 70;
    var x = -20;
    for(var j = 0; j < 7; j++){
        x += 80;
        var id = [i, j];
        drawCircle(x, y, id, colors[board[i][j]]);
    }
   }
}

function showWin(){
	if(game.winner == HUMAN){
		stage.getChildAt(0).text = "You Won  !!!";
		score.text = "Score: " + game.score;
	    round.text = "Round: " + game.total;
	} else {
		stage.getChildAt(0).text = "You were beated";
	}
}


function animate() {	
    renderer.render(stage);
    requestAnimationFrame( animate );
}
