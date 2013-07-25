

function hideImages(pList, pResult) {
  if(pList) {
    for (var i=0; i < pList.length; i++) {
        pList[i].visible = pResult;
    }
  }
}

function deleteImages(pList) {
    if(pList) {
        for (var i=0; i< pList.length; i++) {
            if(pList[i]) {
                pList[i].destroy();
                // console.log("Destroyed ", i);
            }
        }
    }
}

function createHelpScreen(list) {

    if(list != undefined) {
        hideImages(list, false);    
    }
    
    var bg = Crafty.e("2D, DOM, Image, Mouse").image("images/menu_bg.png");
    bg.x = Crafty.viewport.width/2-320/2; bg.y = Crafty.viewport.height/2-480/2;

    var helpTag = Crafty.e("2D, DOM, Image").image("images/help_hover.png");
    helpTag.x = bg._x+80; helpTag.y = bg._y+80;

    var helpText = Crafty.e("2D, DOM, Image").image("images/help_text.png");
    helpText.x = bg._x+20; helpText.y = bg._y+150;

    var backBtnHover = Crafty.e("2D, DOM, Image").image("images/back0002.png");
      backBtnHover.x = bg._x+227; backBtnHover.y = bg._y+418;

    var backBtn = Crafty.e("2D, DOM, Image, Mouse").image("images/back0001.png");
    backBtn.x = bg._x+227; backBtn.y = bg._y+418;

    bg.bind("MouseDown", function(e) {
        console.log("help bg mouse down ")
        return true;
    })

    backBtn.bind("MouseDown", function(e) {
      this.alpha=0.1
    })

   
      backBtn.bind("MouseOut", function(e) {
      this.alpha=1.0
    })


    backBtn.bind("Click", function(e) { 
        console.log("back button button clicked");
       this.unbind('Click', this.backBtn);
       if(list != undefined) {
            hideImages(list, true);
       }
       
       deleteImages([bg,helpTag, helpText, backBtn, backBtnHover]);
    });

}




