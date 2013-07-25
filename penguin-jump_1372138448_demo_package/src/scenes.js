
var lStartLevel = 1;
var lEndLevel = 9;

Crafty.scene('TTSplash', function() {
     console.log("TTSplash SCREEN");
    var bg = Crafty.e("2D, DOM, Image").attr({w: 500, h:500}).image("images/tt_Logo.png");
    bg.x = Crafty.viewport.width/2-100; bg.y = Crafty.viewport.height/2-35;
    
    setTimeout(function(){
    	
    	Crafty.scene('GameSplash');
       
    },3000);
});

Crafty.scene('GameSplash', function() {
	console.log("GAME SPLASH SCREEN");
    var game_Logo = Crafty.e("2D, DOM, Image").image("images/splash_screen.png");
    game_Logo.x = Crafty.viewport.width/2-320/2; game_Logo.y = Crafty.viewport.height/2-480/2;
    game_Logo.attr({w: Crafty.viewport.width, h: Crafty.viewport.height});
    game_Logo.w = 1000;
    console.log("logo width height ", game_Logo._w, game_Logo._h, game_Logo._x, game_Logo._y);
    setTimeout(function(){
    	
    	Crafty.scene('GameMenu'); game_Logo.destroy();
    },3000);
});

Crafty.scene('GameMenu', function() {
	    console.log("GAME MENU SCREEN");
      var bg = Crafty.e("2D, DOM, Image").image("images/menu_bg.png");
      bg.attr({w:Crafty.viewport.width, h:Crafty.viewport.height})
      bg.x = Crafty.viewport.width/2-320/2; bg.y = Crafty.viewport.height/2-480/2;

      var bAddY=30;
      var playBase = Crafty.e("2D, DOM, Image").image("images/small_base.png");
      playBase.x = bg._x+111; playBase.y = bg._y+97+bAddY;

      var playBtnHover = Crafty.e("2D, DOM, Image").image("images/play_hover.png");
      playBtnHover.x = bg._x+80; playBtnHover.y = bg._y+73+bAddY;
    
      var playBtn = Crafty.e("2D, DOM, Image, Mouse").image("images/play.png");
      playBtn.x = bg._x+80; playBtn.y = bg._y+73+bAddY;
    
      var soundBase = Crafty.e("2D, DOM, Image").image("images/long_base.png");
      soundBase.x = bg._x+85; soundBase.y = bg._y+168+bAddY;
    
      var onBtn = Crafty.e("2D, DOM, Image, Mouse").image("images/on.png");
      onBtn.x = bg._x+83; onBtn.y = bg._y+147+bAddY;
      onBtn.originX = onBtn._x;
    
      var offBtn = Crafty.e("2D, DOM, Image, Mouse").image("images/off.png");
      offBtn.x = bg._x+83; offBtn.y = bg._y+147+bAddY;
      offBtn.originX = offBtn._x;

     
      var aboutusBase = Crafty.e("2D, DOM, Image").image("images/long_base.png");
        aboutusBase.x = bg._x+85; aboutusBase.y = bg._y+328+bAddY;
        // aboutusBase.x = bg._x+85; aboutusBase.y = bg._y+248+bAddY;

       var aboutUsBtnHover = Crafty.e("2D, DOM, Image").image("images/about_us_hover.png");
        aboutUsBtnHover.x = bg._x+80; aboutUsBtnHover.y = bg._y+308+bAddY; //aboutUsBtnHover.visible=false;
    
      var aboutUsBtn = Crafty.e("2D, DOM, Image, Mouse").image("images/about_us_button.png");
        aboutUsBtn.x = bg._x+80; aboutUsBtn.y = bg._y+308+bAddY;
        // aboutUsBtn.x = bg._x+90; aboutUsBtn.y = bg._y+230+bAddY;
    
      var helpBase = Crafty.e("2D, DOM, Image").image("images/small_base.png");
        helpBase.x = bg._x+115; helpBase.y = bg._y+248+bAddY;

        var helpBtnHover = Crafty.e("2D, DOM, Image").image("images/help_hover.png");
         helpBtnHover.x = bg._x+82; helpBtnHover.y = bg._y+225+bAddY; //helpBtnHover.visible=false;
    
       var helpBtn = Crafty.e("2D, DOM, Image, Mouse").image("images/help.png");
         helpBtn.x = bg._x+82; helpBtn.y = bg._y+225+bAddY;

 
     if(getAudioIsMuted()) {
        offBtn.visible = true;
        onBtn.visible = false;
        onBtn.x = -1000;
    } else {
        offBtn.visible = false;
        onBtn.visible = true;
        offBtn.x = -1000;
    }
    
    offBtn.bind("Click", function(e) {
        console.log("menu off btn clicked");
        
       setAudioIsMuted(false)
        onBtn.visible = true;
        offBtn.visible = false;
        offBtn.x = -1000;
        onBtn.x = onBtn.originX
        playBgMusic("BgmMenu");
    });

    onBtn.bind("Click", function(e) {
        console.log("menu on btn clicked");
      
        offBtn.visible = true;
        onBtn.visible = false;
        offBtn.x = offBtn.originX
        onBtn.x = -1000;
        Crafty.audio.stop();
        setBgMusicPlaying();
    });
    

    playBtn.bind("MouseDown", function(e) {
      this.alpha=0.1
      console.log("mouse DOWN")
    })

    playBtn.bind("MouseOut", function(e) {
      this.alpha=1.0
      console.log("mouse out")
    })

    playBtn.bind("Click", function(e) { 
        console.log("play button clicked");
        lStartLevel=1; lEndLevel=9;
        Crafty.scene('GameLevels');
    });

    helpBtn.bind("MouseDown", function(e) {
     this.alpha=0.1
    })

    helpBtn.bind("MouseOut", function(e) {
      this.alpha=1.0
    })

   helpBtn.bind("Click", function(e) { 
        console.log("helpBtn button clicked")
        this.alpha=1.0
        createHelpScreen([playBtn, bg, helpBtn, aboutUsBtn, soundBase, helpBase, aboutusBase ]);
    });

   aboutUsBtn.bind("MouseDown", function(e) {
      this.alpha=0.1
    })

    aboutUsBtn.bind("MouseOut", function(e) {
      this.alpha=1.0
    })


    aboutUsBtn.bind("Click", function(e) { 
        console.log("aboutUsBtn button clicked");
        
        Crafty.scene('AboutUsMode');
    });

    playBgMusic("BgmMenu")
    
});


Crafty.scene('LoadingSplash', function() {
   var bg = Crafty.e("2D, DOM, Image").image("images/menu_bg.png");
        bg.x = Crafty.viewport.width/2-320/2; bg.y = Crafty.viewport.height/2-480/2;  
     
    var loadTag = Crafty.e("2D, DOM, Image").image("images/loading.png");
        loadTag.x = bg._x+70; loadTag.y = bg._y+220;
    setTimeout(function(){
    	
    	Crafty.scene('GameMenu');
        loadTag.destroy();
    },3000);
});



Crafty.scene('GameLevels', function() {
    console.log("GAME LEVELS SCREEN");
    // Crafty.background('rgb(0,0,0)');
    var bg = Crafty.e("2D, DOM, Image").image('images/menu_bg.png');
    bg.x = Crafty.viewport.width/2-320/2; bg.y = Crafty.viewport.height/2-480/2;
    // console.log("crafty width ",Crafty.viewport.width, Crafty.viewport.height, Crafty.viewport.x);

    var levelTag = Crafty.e("2D, DOM, Image").image("images/levels.png");
    levelTag.x = bg._x+100; levelTag.y = bg._y+60;

    var levelLocked
    
   
    var bBeginX = bg._x + 23; var bBeginY = bg._y+120;
    var bLevels =  new Array();
   
    var bKey1
    for(var i=lStartLevel; i<=lEndLevel; i++) {
      console.log("level id is ", i)
         console.log("penguinjump level id is ", getStorageItem("PenguinJump_LevelId"+i))
         if(getStorageItem("PenguinJump_LevelId"+i)==1) {
            bLevels[i-1] = Crafty.e("2D, DOM, Image, Mouse").image('images/bg_level_number.png');
            bLevels[i-1].islocked = false;
            createNumber(i, bBeginX, bBeginY)
          } 
         else {
			bLevels[i-1] = Crafty.e("2D, DOM, Image, Mouse").image('images/bg_level_number.png');
		bLevels[i-1].islocked = true
		createNumber(i, bBeginX, bBeginY)
		
             var overImage= Crafty.e("2D, DOM, Lock");
             overImage.x = bBeginX; overImage.y = bBeginY;

          }
        bLevels[i-1].levelId = i;
        bLevels[i-1].x= bBeginX; bLevels[i-1].y= bBeginY;
        bBeginX+=100;
        if(i%3==0 && i!=1 ) { bBeginY += 100; bBeginX = bg._x+23; console.log("i value ", i)
        }

        bLevels[i-1].bind("Click", function(e) { 
             
              console.log("levels button clicked", this.levelId, this.islocked);
              if(this.islocked == false) {
// 
                setGameLevelId(parseInt(this.levelId))
                Crafty.scene('GamePlay');
              }
               // 
           });
        }

    //    levelLocked = Crafty.e("2D, DOM, Image").image("images/level_locked.png");
    // levelLocked.x = bg._x+10; levelLocked.y = bg._y+210;

      var backBtnHover = Crafty.e("2D, DOM, Image").image("images/back0002.png");
      backBtnHover.x = bg._x+227; backBtnHover.y = bg._y+418; 
    
      var backBtn = Crafty.e("2D, DOM, Image, Mouse").image("images/back0001.png");
      backBtn.x = bg._x+227; backBtn.y = bg._y+418; 

      var nextBtnHover = Crafty.e("2D, DOM, Image").image("images/next0002.png");
      nextBtnHover.x = bg._x+5; nextBtnHover.y = bg._y+418;

      var nextBtn = Crafty.e("2D, DOM, Image, Mouse").image("images/next0001.png");
      nextBtn.x = bg._x+5; nextBtn.y = bg._y+418; 
     
      backBtn.bind("MouseDown", function(e) {
      this.alpha=0.1
    })

   
      backBtn.bind("MouseOut", function(e) {
      this.alpha=1.0
    })
   
        backBtn.bind("Click", function(e) { 
           console.log("backBtn button clicked");
           if(lStartLevel==1) {
              Crafty.scene('GameMenu'); 
           } else if(lStartLevel==10) {
              lStartLevel=1; lEndLevel=9
              Crafty.scene('GameLevels'); 
           } else if(lStartLevel == 19) {
              lStartLevel=10; lEndLevel=18;
              Crafty.scene('GameLevels'); 
           }
           
      });


    nextBtn.bind("MouseDown", function(e) {
      this.alpha=0.1
    })

   
      nextBtn.bind("MouseOut", function(e) {
      this.alpha=1.0
    })

        nextBtn.bind("Click", function(e)  {
            console.log("next button clicked ")
            if(lStartLevel==1) {
                lStartLevel=10; lEndLevel=18;
                Crafty.scene('GameLevels'); 
            } else if(lStartLevel==10) {
                lStartLevel=19; lEndLevel=25;
                Crafty.scene('GameLevels'); 
            }
        });

        if(lStartLevel==19) { 
          nextBtn.visible=false; 
          nextBtnHover.visible=false; 
       }
    
});


    
Crafty.scene('LevelLost', function() {
    console.log("LEVEL LOST SCREEN");
    Crafty.audio.stop();
     var bg = Crafty.e("2D, DOM, Image").image('images/menu_bg.png');
       bg.x = Crafty.viewport.width/2-320/2; bg.y = Crafty.viewport.height/2-480/2;

      var bAddY=30;

    var lostTag = Crafty.e("2D, DOM, Image").image("images/level_lost.png");
         lostTag.x = bg._x+55; lostTag.y = bg._y+120+bAddY;
    
    var leaveBase1 = Crafty.e("2D, DOM, Image").image("images/long_base.png");
          leaveBase1.x = bg._x+75; leaveBase1.y = bg._y+227+bAddY;    
    
    var leaveBase2 = Crafty.e("2D, DOM, Image").image("images/long_base.png");
          leaveBase2.x = bg._x+105; leaveBase2.y = bg._y+227+bAddY;    

    var leaveBtnHover = Crafty.e("2D, DOM, Image").image("images/leave_game_hover.png");
          leaveBtnHover.x = bg._x+73; leaveBtnHover.y = bg._y+205+bAddY; 
    
     var leaveBtn = Crafty.e("2D, DOM, Image, Mouse").image("images/leave_game.png");
          leaveBtn.x = bg._x+73; leaveBtn.y = bg._y+205+bAddY;        
    
    
    var tryAgainBase = Crafty.e("2D, DOM, Image").image("images/long_base.png");
          tryAgainBase.x = bg._x+90; tryAgainBase.y = bg._y+292+bAddY;   

    var tryagainBtnHover = Crafty.e("2D, DOM, Image").image("images/tryagain_hover.png");
    tryagainBtnHover.x = bg._x+85; tryagainBtnHover.y = bg._y+270+bAddY;  

    var tryAgainBtn = Crafty.e("2D, DOM, Image, Mouse").image("images/tryagain.png");
          tryAgainBtn.x = bg._x+85; tryAgainBtn.y = bg._y+270+bAddY;    

    
    leaveBtn.bind("MouseDown", function(e) {
      this.alpha=0.1
    })

    leaveBtn.bind("MouseOut", function(e) {
      this.alpha=1.0
    })

    leaveBtn.bind("Click", function(e) { 
    console.log("leaveBtn button clicked");
    Crafty.scene('GameMenu');
    }); 

    tryAgainBtn.bind("MouseDown", function(e) {
      this.alpha=0.1
    })

    tryAgainBtn.bind("MouseOut", function(e) {
      this.alpha=1.0
    })
    
      tryAgainBtn.bind("Click", function(e) { 
        console.log("tryagainBtn button clicked");
        Crafty.scene('GamePlay');
        });    
    
});
       

Crafty.scene('LevelCleared', function() {
    console.log("LEVEL CLEARED SCREEN");
    Crafty.audio.stop(); playSfxAudio("GameWin")
     var bg = Crafty.e("2D, DOM, Image").image('images/menu_bg.png');
     bg.x = Crafty.viewport.width/2-320/2; bg.y = Crafty.viewport.height/2-480/2;

     var bAddY=30

    var clearedTag = Crafty.e("2D, DOM, Image").image("images/level_cleared.png");
         clearedTag.x = bg._x+19; clearedTag.y = bg._y+120+bAddY;
    
    var leaveBase1 = Crafty.e("2D, DOM, Image").image("images/long_base.png");
          leaveBase1.x = bg._x+75; leaveBase1.y = bg._y+227+bAddY;    
    
    var leaveBase2 = Crafty.e("2D, DOM, Image").image("images/long_base.png");
          leaveBase2.x = bg._x+105; leaveBase2.y = bg._y+227+bAddY;    

     var leaveBtnHover = Crafty.e("2D, DOM, Image").image("images/leave_game_hover.png");
     leaveBtnHover.x = bg._x+72; leaveBtnHover.y = bg._y+205+bAddY;  //leaveBtnHover.visible=false;   
    
    var leaveBtn = Crafty.e("2D, DOM, Image, Mouse").image("images/leave_game.png");
    leaveBtn.x = bg._x+72; leaveBtn.y = bg._y+205+bAddY;       
    
    var nextBtnBase = Crafty.e("2D, DOM, Image").image("images/small_base.png");
          nextBtnBase.x = bg._x+112; nextBtnBase.y = bg._y+291+bAddY;    

    var nextBtnHover = Crafty.e("2D, DOM, Image").image("images/next_hover.png");
    nextBtnHover.x = bg._x+82; nextBtnHover.y = bg._y+270+bAddY; //nextBtnHover.visible=false;


    var nextBtn = Crafty.e("2D, DOM, Image, Mouse").image("images/next.png");
          nextBtn.x = bg._x+82; nextBtn.y = bg._y+270+bAddY;  

    
    
     

    leaveBtn.bind("MouseDown", function(e) {
      this.alpha=0.1
    })

    leaveBtn.bind("MouseOut", function(e) {
      this.alpha=1.0
    })

    leaveBtn.bind("Click", function(e) { 
        console.log("leaveBtn button clicked");
        Crafty.scene('GameMenu');
    });
    
         

    nextBtn.bind("MouseDown", function(e) {
      // nextBtnHover.visible=true;
      nextBtn.alpha=0.1
    })

    nextBtn.bind("MouseOut", function(e) {
      // nextBtnHover.visible=false;
      nextBtn.alpha=1.0
    }) 

    nextBtn.bind("Click", function(e) { 
        console.log("nextBtn button clicked");
        
        Crafty.scene('GamePlay');
    });
    
    
});

 
  Crafty.scene('AboutUsMode', function() {
    console.log("ABOUT US SCREEN");
    // Crafty.background('rgb(0,0,0)');
    var bg = Crafty.e("2D, DOM, Image").image('images/menu_bg.png');
    bg.x = Crafty.viewport.width/2-320/2; bg.y = Crafty.viewport.height/2-480/2;
   
     var aboutUsTag=Crafty.e('2D,DOM,Image').image('images/about_us_hover.png');
     aboutUsTag.x= bg._x+87; aboutUsTag.y = bg._y+80;   
       
      var aboutUsText=Crafty.e('2D,DOM,Image').image('images/about_us_text.png');
     aboutUsText.x= bg._x; aboutUsText.y = bg._y+130;   

     var backBtnHover = Crafty.e("2D, DOM, Image").image("images/back0002.png");
      backBtnHover.x = bg._x+227; backBtnHover.y = bg._y+418;
      
     var backBtn = Crafty.e("2D, DOM, Image, Mouse").image("images/back0001.png");
    backBtn.x = bg._x+227; backBtn.y = bg._y+418;    

    backBtn.bind("MouseDown", function(e) {
      this.alpha=0.1
    })

   
      backBtn.bind("MouseOut", function(e) {
      this.alpha=1.0
    })
        
        backBtn.bind("Click", function(e) { 
        console.log("backBtn button clicked");
        Crafty.scene('GameMenu');
    });
    
});



Crafty.scene('GameOver', function() {
    console.log("GAME OVER SCREEN");
    Crafty.audio.stop(); playSfxAudio("GameWin")
     var bg = Crafty.e("2D, DOM, Image").image('images/menu_bg.png');
       bg.x = Crafty.viewport.width/2-320/2; bg.y = Crafty.viewport.height/2-480/2;

    var gameOverTag = Crafty.e("2D, DOM, Image").image("images/game_over.png");
         gameOverTag.x = bg._x+27; gameOverTag.y = bg._y+180;


    var leaveBase1 = Crafty.e("2D, DOM, Image").image("images/long_base.png");
          leaveBase1.x = bg._x+75; leaveBase1.y = bg._y+227+70;

    var leaveBase2 = Crafty.e("2D, DOM, Image").image("images/long_base.png");
          leaveBase2.x = bg._x+105; leaveBase2.y = bg._y+227+70;    

     var leaveBtnHover = Crafty.e("2D, DOM, Image").image("images/leave_game_hover.png");
     leaveBtnHover.x = bg._x+72; leaveBtnHover.y = bg._y+205+70;  //leaveBtnHover.visible=false;   
    
    var leaveBtn = Crafty.e("2D, DOM, Image, Mouse").image("images/leave_game.png");
    leaveBtn.x = bg._x+72; leaveBtn.y = bg._y+205+70;  

    leaveBtn.bind("MouseDown", function(e) {
      this.alpha=0.1
    })

    leaveBtn.bind("MouseOut", function(e) {
      this.alpha=1.0
    })

    leaveBtn.bind("Click", function(e) { 
        console.log("leaveBtn button clicked");
        Crafty.scene('GameMenu');
    });
});

       

