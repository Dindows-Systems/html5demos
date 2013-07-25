/**
 * Global variables
 */

// Scene sizes
var WINDOW_WIDTH						= window.innerWidth,
	WINDOW_HEIGHT						= window.innerHeight - 4;

// Camera settings
var ASPECT								= WINDOW_WIDTH / WINDOW_HEIGHT,
	VIEW_ANGLE							= 45,
	NEAR								= 0.1,
	FAR									= 1000;

ASPECT = 1.7778;	// Manually overridden in order to keep the aspect ratio, which helps making the game look uniform

var WIDTH								= WINDOW_WIDTH,
	HEIGHT								= WIDTH / ASPECT;

// Rendering variables
var renderer = "tset", camera, scene, stats;
var objects								= [];
var lights								= [];
var mouse								= {};

var defaultGameState					= 'menu',
	currentGameState					= defaultGameState,
	touchedFloor						= false;

var score								= 0,
	lives								= 2;

var gameStates							= {
	menu								: {
		transitions						: {
			play						: 'game'
		},
		run								: function() {
			init();
			start();
			render();
		},
		stateType						: 'static',
		running							: false
	},
	game								: {
		transitions						: {
			lose						: 'over',
			abandon						: 'menu',
			pause						: 'paused',
			reset						: 'reset'
		},
		run								: function() {
			update();
			render();
		},
		stateType						: 'animation',
		running							: false
	},
	paused								: {
		transitions						: {
			resume						: 'game'
		},
		run								: function() {
			freeze();
		},
		stateType						: 'static',
		running							: false
	},
	over								: {
		transitions						: {
			restart						: 'game'
		},
		run								: function() {
			lose();
		},
		stateType						: 'static',
		running							: false
	},
	reset								: {
		transitions						: {
			restart						: 'game'
		},
		run								: function() {
			reset();
		},
		stateType						: 'static',
		running							: false
	}
};

var currLevel							= 2;