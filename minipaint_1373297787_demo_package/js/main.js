/*
TODO:
	<input=range> html5 support (wait firefox 23)
		color select Lumi
		popup range
		zoom
		layer opacity
*/

var AUTHOR = 'Vilius';
var EMAIL = 'www.viliusl@gmail.com';
var VERSION = '1.5';

//canvas
var canvas_back = document.getElementById("canvas_back").getContext("2d");		//layer for grid/transparency
var canvas_main = document.getElementById("Background").getContext("2d");		//background
var canvas_front = document.getElementById("canvas_front").getContext("2d");		//tmp layer
var canvas_preview = document.getElementById("canvas_preview").getContext("2d");	//mini preview

//settings
var WIDTH=800;				//canvas midth
var HEIGHT=500;				//canvas height
var RATIO = WIDTH/HEIGHT;
var grid = false;
var background = false;
var ACTION = 'select_tool';
var COLOUR = '#000000';
var TO_RADIANS = Math.PI/180;
var LAYERS = [];
var LAYERS_ARCHIVE = {};
var PASTE_DATA = false;
var ZOOM = 100;
var ZOOM_X = 0;
var ZOOM_Y = 0;
var TRANSPARENCY = true;
var PREVIEW_SIZE = {w: 148, h: 100 };
var LAYERS = [];
var layer_active = 0;

//keyboard handlers
document.onkeydown = function(e) {return on_keyboard_action(e); }
document.onkeyup = function(e) {return on_keyboardup_action(e); }
//mouse
window.ondrop = function(e){ upload_drop(e); }
window.ondragover = function(e){e.preventDefault();  }
document.onmousedown = mouse_click;
document.onmousemove = mouse_move;
document.onmouseup = mouse_release;
document.addEventListener("mousewheel", mouse_wheel_handler, false);
document.addEventListener("DOMMouseScroll", mouse_wheel_handler, false);
window.onresize = calc_preview_auto;

var ACTION_DATA = [
	{name: 'select_tool', 	title: 'Select object tool',	icon: ['all.png', 0+7, 2],	attributes: {}		},
	{name: 'select_square', title: 'Select area tool', 	icon: ['all.png', -50+4, 5],	attributes: {}		},
	{name: 'magic_wand', 	title: 'Magic Wand Tool', 	icon: ['all.png', -150+1, -50+2],	attributes: {sensitivity: 40}		},
	{name: 'erase', 	title: 'Erase',			icon: ['all.png', -100+3, 4],	attributes: {size: 20, circle: true}	},
	{name: 'fill', 		title: 'Fill',			icon: ['all.png', -150+3, 3],	attributes: {sensitivity: 0}	},
	{name: 'get_color', 	title: 'Find Color',		icon: ['all.png', -200+3, 3],	attributes: {}		},
	{name: 'pencil', 	title: 'Pencil',		icon: ['all.png', -250+3, 3],	attributes: {}		},
	{name: 'line', 		title: 'Draw line',		icon: ['all.png', -300+3, 3],	attributes: {size: 1}	},
	{name: 'letters', 	title: 'Draw letters',		icon: ['all.png', -350+3, 4],	attributes: {size: 12}	},
	{name: 'draw_square', 	title: 'Draw rectangle',		icon: ['all.png', -400+3, 5],	attributes: {fill: false, square: false}	},
	{name: 'draw_circle', 	title: 'Draw circle',		icon: ['all.png', -450+3, 5],	attributes: {fill: false, circle: false}	},
	{name: 'brush', 	title: 'Brush',			icon: ['all.png', -500+6, 3],	attributes: {size: 5}	},
	{name: 'blur', 		title: 'Blur tool',		icon: ['all.png', -250+5, -50+2],	attributes: {size: 30, strength: 1}	},
	{name: 'sharpen', 	title: 'Sharpen tool',		icon: ['all.png', -300+5, -50+2],	attributes: {size: 30, strength: 1}	},
	];

var POP = new popup(WIDTH, HEIGHT);
var MENU = new MENU_CLASS();
var TOOLS = new TOOLS_CLASS();
var LAYER = new LAYER_CLASS();

function init(first_load){
	if(first_load===true)
		TOOLS.draw_helpers();
	select_square = false;
	for(i=1; i<LAYERS.length; i++)
		LAYER.layer_remove(i);
	LAYERS = [];
	canvas_main.clearRect(0, 0, WIDTH, HEIGHT);
	LAYER.layer_add("Background");
	LAYER.set_canvas_size();
	draw_background(canvas_back);
	document.getElementById("main_colour").style.backgroundColor = COLOUR;
	document.getElementById("canvas_preview").width = PREVIEW_SIZE.w;
	document.getElementById("canvas_preview").height = PREVIEW_SIZE.h;
	redraw_preview();
	}
function save_state(){
	LAYERS_ARCHIVE = {};
	LAYERS_ARCHIVE.width = WIDTH;
	LAYERS_ARCHIVE.height = HEIGHT;
	LAYERS_ARCHIVE.data = {};
	for(var i in LAYERS)
		LAYERS_ARCHIVE.data[LAYERS[i].name] = document.getElementById(LAYERS[i].name).getContext("2d").getImageData(0, 0, WIDTH, HEIGHT);
	}
function undo(){
	if(WIDTH != LAYERS_ARCHIVE.width || HEIGHT != LAYERS_ARCHIVE.height){
		WIDTH = LAYERS_ARCHIVE.width;
		HEIGHT = LAYERS_ARCHIVE.height;
		RATIO = WIDTH/HEIGHT;
		LAYER.set_canvas_size(true);
		return true;
		}
	for(var i in LAYERS){
		if(LAYERS_ARCHIVE.data[LAYERS[i].name] != undefined)
			document.getElementById(LAYERS[i].name).getContext("2d").putImageData(LAYERS_ARCHIVE.data[LAYERS[i].name], 0, 0);
		}
	zoom();
	}
