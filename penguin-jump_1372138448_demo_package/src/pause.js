
function createPauseScreen(list) {

    Crafty.audio.stop();
    // console.log("pause screen created ", list.length);
    if(list != undefined ){
        hideImages(list, false);    
    }
    
    var bg = Crafty.e("2D, DOM, Image, Mouse").image("images/menu_bg.png");
    bg.x = Crafty.viewport.width/2-320/2; bg.y = Crafty.viewport.height/2-480/2;

    var resumeBase = Crafty.e("2D, DOM, Image, Mouse").image("images/long_base.png");
    resumeBase.x = bg._x+88; resumeBase.y = bg._y+160;

    var resumeBtn = Crafty.e("2D, DOM, Image, Mouse").image("images/resume.png");
    resumeBtn.x = bg._x+85; resumeBtn.y = bg._y+140;

    var resumeBtnHover = Crafty.e("2D, DOM, Image").image("images/resume_hover.png");
    resumeBtnHover.x = bg._x+85; resumeBtnHover.y = bg._y+140; resumeBtnHover.visible=false;
    
    var soundBase = Crafty.e("2D, DOM, Image").image("images/long_base.png");
        soundBase.x = bg._x+85; soundBase.y = bg._y+225;
    
      var onBtn = Crafty.e("2D, DOM, Image, Mouse").image("images/on.png");
      onBtn.x = bg._x+82; onBtn.y = bg._y+202;
      onBtn.originX = onBtn._x;
    
    var offBtn = Crafty.e("2D, DOM, Image, Mouse").image("images/off.png");
    offBtn.x = bg._x+82; offBtn.y = bg._y+202;
    offBtn.originX = offBtn._x;
    
  var helpBase = Crafty.e("2D, DOM, Image").image("images/small_base.png");
        helpBase.x = bg._x+115; helpBase.y = bg._y+279;
    
       var helpBtn = Crafty.e("2D, DOM, Image, Mouse").image("images/help.png");
         helpBtn.x = bg._x+80; helpBtn.y = bg._y+255;

     var helpBtnHover = Crafty.e("2D, DOM, Image").image("images/help_hover.png");
         helpBtnHover.x = bg._x+80; helpBtnHover.y = bg._y+255; helpBtnHover.visible=false;

   
    var leaveBase1 = Crafty.e("2D, DOM, Image").image("images/long_base.png");
          leaveBase1.x = bg._x+75; leaveBase1.y = bg._y+342;    
    
    var leaveBase2 = Crafty.e("2D, DOM, Image").image("images/long_base.png");
          leaveBase2.x = bg._x+105; leaveBase2.y = bg._y+342;    
    
     var leaveBtn = Crafty.e("2D, DOM, Image, Mouse").image("images/leave_game.png");
          leaveBtn.x = bg._x+72; leaveBtn.y = bg._y+320;     

    var leaveBtnHover = Crafty.e("2D, DOM, Image").image("images/leave_game_hover.png");
          leaveBtnHover.x = bg._x+72; leaveBtnHover.y = bg._y+320; leaveBtnHover.visible=false;    
    
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
        console.log("off btn clicked");
       setAudioIsMuted(false)
        onBtn.visible = true;
        offBtn.visible = false;
        offBtn.x = -1000;
        onBtn.x = onBtn.originX
    });

    onBtn.bind("Click", function(e) {
        console.log("on btn clicked");
       setAudioIsMuted(true)
        offBtn.visible = true;
        onBtn.visible = false;
        offBtn.x = offBtn.originX
        onBtn.x = -1000;
    });
    
    resumeBtn.bind("MouseUp", function(e) {
          console.log("resume button clicked, so resume the game ")
           this.unbind('Click', this.resumeBtn);
           if(list != undefined) {
                hideImages(list, true);
           }
          deleteImages([bg,resumeBase,resumeBtn, resumeBtnHover, soundBase,onBtn,offBtn,helpBtn, helpBtnHover, helpBase,leaveBase1,leaveBase2,leaveBtn, leaveBtnHover]);
          // Crafty.pause();
          setGameUnPaused();

          playBgMusic("GameMusic")
    });

    resumeBtn.bind("MouseDown", function(e) {
      resumeBtnHover.visible=true;
    })

    resumeBtn.bind("MouseOut", function(e) {
      resumeBtnHover.visible=false;
    })
    

    helpBtn.bind("MouseUp", function(e) {
         console.log('HELP BUTTON CLICKED');
        helpBtnHover.visible=false;
        createHelpScreen()    
    })

    helpBtn.bind("MouseDown", function(e) {
      helpBtnHover.visible=true;
    })

    helpBtn.bind("MouseOut", function(e) {
      helpBtnHover.visible=false;
    })
    

    leaveBtn.bind("MouseUp", function(e) {
        console.log('LEAVE GAME BUTTON CLICKED');
        Crafty.scene('GameMenu');
    })

    leaveBtn.bind("MouseDown", function(e) {
      leaveBtnHover.visible=true;
    })

    leaveBtn.bind("MouseOut", function(e) {
      leaveBtnHover.visible=false;
    })

    

}




