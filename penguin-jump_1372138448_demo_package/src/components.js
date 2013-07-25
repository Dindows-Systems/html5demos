
Crafty.c("Lock", {
  init: function() {
  this.requires("2D, DOM, Image").image("images/lock.png");
 
  },
});

Crafty.c("BG1", {
  init: function() {
  this.requires("2D, DOM, Image, Mouse").image("images/menu_bg.png");
 
  },
});


Crafty.c("Block", {
	init:function() {
		this.requires("2D, DOM, Image, Tween").image("images/jumper.png")
	},
	
});