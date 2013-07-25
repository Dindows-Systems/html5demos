

"use strict";
var Game = function($) {

	return {

		config : {
			width : 320,
			height : 480,
			numberOfQuestions : 1, // value set in initialize
			timeForQuestion : 1, // value set in initialize
			sound : true
		},

		/**
		 * Initializes Quiz application
		 */
		initialize : function() {
			

			// init Crafty
			// Crafty.init(this.config.width, this.config.height);
			Crafty.init();
			Crafty.canvas.init();

			Crafty.stage.fullscreen=true;
			// // set bacgroundd
			// Crafty.background("url('images/game_bg.png')");

			
			screen.mozLockOrientation("portrait");

				if(Crafty.mobile){
					console.log("MOBILE VERSION");
				}
				else {
					console.log("NOT MOBILE VERSION");
				}
				 initializeDB();

				Crafty.sprite(25, "images/flag.png", {
				    Flag: [0,0]
				});

				Crafty.sprite(48, "images/penguin.png", {
				    Penguin: [0,0]
				});

				Crafty.sprite(17, "images/number.png", {
				    number0: [0, 0],
				    number1: [1, 0],
				    number2: [2, 0],
				    number3: [3, 0],
				    number4: [4, 0],
				    number5: [5, 0],
				    number6: [6, 0],
				    number7: [7, 0],
				    number8: [8, 0],
				    number9: [9, 0]
				  });

				Crafty.load([ "images/bg_level_number.png", "images/jumper.png", "images/lock.png", "images/small_base.png", "images/long_base.png" ], 
		                function() { 
		                   console.log("***************************************")
		                   console.log(" all assets are loaded ")
		                   console.log("***************************************")
		                   
		                },
		                function(e) {
		                    console.log("progress ", e.total, e.loaded)
		                }
		               ) 

				Crafty.scene('TTSplash');
				// Crafty.scene('GameMenu');
			    loadAudio();
			
		},

	};

}($);


