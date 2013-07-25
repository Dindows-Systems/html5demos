
var lPuzzleId = 0; //puzzle id
var lStartX = 0;
var lStartY = 0;
var lEndX, lBeginX
var lIsGamePaused = false;
var lGameSpeed = 1;
var lAddBlockY = 18;
var lGameTimer = null;

var lGameLevelString = null;
var lGameBlocks = new Array ();
var lGameBlocks1 = new Array();
var Penguin, Penguin1, bg, Flag ;
var lJumpTimer = null;
var lJumpCount = 0;
var lIsGameFallSoundPlayed = false;
var lIsGameFailed = false;

function setGameUnPaused() {
	lIsGamePaused = false;
}

function setGameLevelId(pLevelId) {
	if(pLevelId) {
		
		lLevelId = pLevelId;	
		console.log("set game level id ", lLevelId);
	}
}

function setGameLevelString(pString) {
	lGameBlocks = pString.split(',');

	placeLevelBlocks()
}


function placeLevelBlocks() {
	console.log("------------------- place level blocks ", lGameBlocks);
	var bBeginX, bBeginY
	bBeginX = lStartX + 90;
	bBeginY = lStartY + 240;

	for(i=0; i< lGameBlocks.length; i++) {
		
		if(parseInt(lGameBlocks[i]) != 0 && lGameBlocks[i] != undefined) {
				
				 var block1 = Crafty.e("2D, DOM, Block")
			     block1.x = bBeginX; block1.y = bBeginY + lAddBlockY*lGameBlocks[i];
			     // console.log(" i ", i, lGameBlocks[i], bBeginX)
			     block1.rowLevel=lGameBlocks[i]; block1.levelId = i;
			     block1.isGoingDown = false;
			     console.log("block rowid, place", block1.rowLevel, block1.y)
			     if(i==lGameBlocks.length-1) {
			     	//place flag here
			     	Flag = Crafty.e("2D, DOM, SpriteAnimation, Flag, Tween");
				    Flag.x= block1.x+40; Flag.y=bBeginY
				    Flag.originY = bBeginY+lAddBlockY*lGameBlocks[i]-20;
				    
				    Flag.animate('animate', 0, 0, 5) //setup animation
				    Flag.animate('animate', 15, -1) 
				    if(Flag.x > lBeginX) {
				    	Flag.visible=false;
				    	Flag.y= lStartY+10;	
				    } 
				    Flag.bind("EnterFrame", function(e) {
				    	if(lIsGamePaused) return true ;
				    	this.x= this._x-lGameSpeed;

				    	 if(this.x < lBeginX-10 && this.visible == false){
				     		this.visible=true;
				     		// console.log("this x and lBeginX", this.x, lBeginX)
				     		this.tween({y:this.originY}, 50);
				     	} else if(this.x < lStartX) {

				     		this.destroy();	
				     	} 
				    })
			     }
			     if(block1.x > lBeginX) {
			     	block1.visible = false;
			     	block1.originY = block1._y;
			     	block1.y = lStartY+10;
			     	
			     } 


			     block1.bind("EnterFrame", function(e)  {
			     	if(lIsGamePaused) return true ;
			     	
			     	this.x= this._x-lGameSpeed;
			     	// console.log("this x is ", this._x, lEndX)
			     	if(this.x < lEndX && this.isGoingDown==false) {
			     		// this.y = this._y + 3*lGameSpeed
			     		this.isGoingDown=true;
			     		this.tween({y:lStartY+450}, 50)

			     		// this.destroy();
			     	} 
			     	else if(this.x < lBeginX-9 && this.visible == false){
			     		this.visible=true;
			     		// console.log("this x and lBeginX", this.x, lBeginX)
			     		this.tween({y:this.originY}, 50);
			     	}
			     	if(this.x < lStartX || this.y > lStartY+440) {
			     		this.destroy();
			     	}

			     })
		}
		
			bBeginX+=50; 
		// }
	}

	Penguin = Crafty.e("2D, DOM, SpriteAnimation, Penguin");
    Penguin.x= lStartX+90; Penguin.y=lStartY+200;
    
    Penguin.gravity = true;
    Penguin.up = false;
    Penguin.rowLevel=0;

    Penguin.animate('run', 0, 0, 1) //setup animation
    Penguin.animate('fly', 2, 0, 5) //setup animation
    Penguin.animate('run', 10, -1) 

    Penguin1 = Crafty.e("2D, DOM, Color, Collision").attr({x:Penguin._x+15, y:Penguin._y+10, w: 20, h: 33 }).color('rgb(20, 50, 125)');
    Penguin1.alpha=0.01

    Penguin.bind("EnterFrame", function(e) {
    	if(lIsGamePaused) return true;
    	if(Penguin.gravity && !Penguin.up) {
    		Penguin.y=Penguin._y + 3; Penguin1.y=Penguin1._y + 3;
    		if(lJumpCount==0 || lJumpCount==2) {
    			Penguin.up=false;
    			lJumpCount=2;
    			// console.log("falling down")
    			// playSfxAudio("PenguinFall")
    		}
    	}
    	else if(Penguin.up && Penguin.y > lStartY+20) {
    		Penguin.y = Penguin._y-3; Penguin1.y = Penguin1._y-3;
    	}

    	Penguin.gravity=true;
    	

    	if(Penguin.x +10  >= Flag.x) {
    		console.log("WIN GAME LEVEL CLEARED")
    		if(lLevelId!=25) {
    			lLevelId++;
    			setStorageItem("PenguinJump_LevelId"+lLevelId, 1)
    			Crafty.scene("LevelCleared");
    		}

    		else
    			Crafty.scene('GameOver');
    		
    	}
    	else if(this.y > lStartY + 425 && lIsGameFailed==false) {
    		if(!lIsGameFallSoundPlayed) playSfxAudio("PenguinFall")
    			lIsGameFallSoundPlayed = true;
    		
    		lIsGameFailed=true;
    		// console.log("Game Failed", Penguin.y, lStartY)
    		setTimeout(function(e) {
    			Crafty.scene("LevelLost");
    			Penguin.destroy();	 Penguin1.destroy();
    		}, 200)
    		
    	}

    	if(this.y> lStartY + 430) Penguin.visible=false;
    })

    Penguin1.onHit("Block", function(target) {
    	if(lIsGamePaused) return true;
    	// if(target[0].obj.rowLevel==10) {
    		// console.log("block hitted", target[0].obj.y, Penguin.y, target[0].obj.y-Penguin.y, lJumpCount, target[0].obj.levelId, target[0].obj.rowLevel)
    	// }
        // console.log("block hitted", target[0].obj.y, Penguin.y)
        if(Penguin.y > target[0].obj.y) return true;
        // if(Penguin.rowLevel > target[0].obj.rowLevel) { console.log("ljumpcount =2 ", Penguin.rowLevel,  target[0].obj.rowLevel, target[0].obj.y); lJumpCount=2; return true; }
        if(target[0].obj.y-Penguin.y < 40) return true; 
        // console.log("block hitted", target[0].obj.y, Penguin.y, Penguin.y-target[0].obj.y)
        Penguin.gravity=false;
        Penguin.rowLevel= target[0].obj.rowLevel
        // Penguin.stop();
        if(!Penguin.isPlaying('run')) {
        	Penguin.stop();
        	Penguin.animate('run', 10, -1) 
        }
    		
        lJumpCount=0;
    })

    bg.bind("Click", function(e)  {
    	if(lIsGamePaused) return true;
    	if(Penguin == undefined || lJumpCount==2) return true;
    	playSfxAudio("PenguinJump")
    	Penguin.up = true;
    	lJumpCount++;
    	Penguin.stop();
    	Penguin.animate('fly', 10, -1) 
    	Penguin.rowLevel=0;
    	if(lJumpTimer) clearInterval(lJumpTimer)
    	lJumpTimer = setTimeout(function(e) {
    		Penguin.up=false;
    	}, 800)
    })
}

function resetGame() {
	setGameUnPaused(); //set game is not paused
	lIsGameFallSoundPlayed = false;
	lGameBlocks.length=0;
	lJumpCount=0; lIsGameFailed=false
	readTextFile("levels/Level"+lLevelId+".txt");
}

Crafty.scene('GamePlay', function() {
    console.log("GAME PLAY SCREEN");
    // Crafty.background('rgb(0,0,0)');
    Crafty.audio.stop();
    setBgMusicPlaying();

    bg = Crafty.e("2D, DOM, Image, Mouse").image('images/inGame.png');
    bg.x = Crafty.viewport.width/2-320/2; bg.y = Crafty.viewport.height/2-480/2;
    lStartX=bg._x;
    lEndX = bg.x +50;
    lBeginX = bg._x+280
    lStartY = bg._y;

    var pauseBtnHover = Crafty.e("2D, DOM, Image").image("images/pause0002.png");
    pauseBtnHover.x = bg._x+5; pauseBtnHover.y = bg._y+20;

    var pauseBtn = Crafty.e("2D, DOM, Image, Mouse").image("images/pause0001.png");
    pauseBtn.x = bg._x+5; pauseBtn.y = bg._y+20;   
    
    resetGame()

    pauseBtn.bind("MouseDown", function(e) {
      this.alpha=0.1
    })
      pauseBtn.bind("MouseOut", function(e) {
      this.alpha=1.0
    })
     pauseBtn.bind("Click", function(e) {
    	console.log("pause button clicked")
    	lIsGamePaused=true;
    	createPauseScreen();
    })
    
    playBgMusic("GameMusic")
});



