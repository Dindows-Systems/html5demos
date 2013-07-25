var progress = document.getElementById('uploadprogress');
var isDrag = false;
var mouse_x_click = false;
var mouse_y_click = false;
var mouse_x_move_last = false;
var mouse_y_move_last = false;
var ctrl_pressed = false; //17
var alt_pressed = false; //18
var shift_pressed = false; //16
var select_square = false;
var select_square_action = '';
var mouse_pos = [0, 0];
var resize_all = false;

//keyboard actions
function on_keyboard_action(event){
	k = event.keyCode;	//log(k);
	
	if(POP != undefined && POP.active==true && k != 27) return true;
	if(document.activeElement.type == 'text') return true;
	
	//up
	if(k == 38){
		if(ACTION=='select_tool'){
			LAYER.layer_move_active(0, -1);
			return false;
			}
		}
	//down
	else if(k == 40){
		if(ACTION=='select_tool'){
			LAYER.layer_move_active(0, 1)
			return false;
			}
		}
	//left
	else if(k == 39){
		if(ACTION=='select_tool'){
			LAYER.layer_move_active(1, 0);
			return false;
			}
		}
	//right
	else if(k == 37){
		if(ACTION=='select_tool'){
			LAYER.layer_move_active(-1, 0);
			return false;
			}
		}
	//esc
	else if(k == 27){		
		if(POP != undefined && POP.active == true)
			POP.hide();
		}
	//z
	else if(k == 90){
		//undo
		if(ctrl_pressed==true)
			undo();
		}
	//t
	else if(k == 84){
		trim();
		}
	//o
	else if(k == 79){	}		
	//s
	else if(k == 83){
		if(POP != undefined){
			POP.add({name: "type",		title: "Save as type:",	values: ["PNG", "JPG"]	});	
			POP.add({name: "quality",	title: "Quality (1-100) (optional):",	value: 92, range: [1, 100]	});
			POP.show('Save', MENU.save_quick);
			}
		}
	//grid
	else if(k==71){
		if(grid == false)
			grid = true;
		else
			grid = false;
		draw_grid(canvas_back, 50, 50);
		}
	//del
	else if(k==46){
		if(select_square != false){
			canvas_active().clearRect(select_square.x, select_square.y, select_square.w, select_square.h);
			select_square = false;
			canvas_front.clearRect(0, 0, WIDTH, HEIGHT);
			}
		}
	//shift
	else if(k==16)
		shift_pressed = true; 
	//ctrl
	else if(k==17){
		ctrl_pressed = true; 
		if (!window.Clipboard)
			pasteCatcher.focus();
		}
	//alt
	else if(k==18)
		alt_pressed = true;
	//a
	else if(k==65){
		if(ctrl_pressed == true){
			select_square = {
				x: 	0,
				y: 	0,
				w: 	WIDTH,
				h: 	HEIGHT
				};
			draw_selected_area();
			return false;
			}
		}
	//x
	else if(k==88){
		if(ctrl_pressed == true && select_square != false){
			MENU.copy_to_clipboard();
			canvas_active().clearRect(select_square.x, select_square.y, select_square.w, select_square.h);
			select_square = false;
			canvas_front.clearRect(0, 0, WIDTH, HEIGHT);
			}
		}
	//c
	else if(k==67){
		if(ctrl_pressed == true && select_square != false)
			MENU.copy_to_clipboard();
		}
	//v
	else if(k==86){
		MENU.paste();
		}
		
	zoom();
	return true;
	}
//keyboard release
function on_keyboardup_action(event){
	k = event.keyCode;
	//shift
	if(k==16)
		shift_pressed = false;
	//ctrl
	else if(k==17)
		ctrl_pressed = false;
	//alt
	else if(k==18)
		alt_pressed = false;
	}
function get_mouse_position(event){
	var valid = true;
	if(event.offsetX) {
		mouse_x = event.offsetX;
		mouse_y = event.offsetY;
		}
	else if(event.layerX) {
		mouse_x = event.layerX;
		mouse_y = event.layerY;
		}
	else
		return false;
	if(event.target.id != "canvas_preview"){
		if((mouse_x < 200 || mouse_y < 200) && event.target.id != "canvas_front"){
			mouse_x = mouse_x - 109;
			mouse_y = mouse_y - 34;
			valid = false;
			}
		else if((mouse_x > WIDTH+1 || mouse_y > HEIGHT+1) && event.target.id != "canvas_front"){
			mouse_x = mouse_x - 109;
			mouse_y = mouse_y - 34;	
			valid = false;
			}
		if(ZOOM != 100 ){
			mouse_x = Math.floor(mouse_x / ZOOM * 100);
			mouse_y =  Math.floor(mouse_y / ZOOM * 100);
			}
		}
	else
		valid = false;
	return {
		x: mouse_x, 
		y: mouse_y, 
		valid: valid
		};
	}
//mouse click
function mouse_click(event){
	if(POP != undefined && POP.active==true) return true;
	var mouse = get_mouse_position(event);
	if(mouse.valid == true)
		save_state();
	mouse_x = mouse.x;
	mouse_y = mouse.y;
	
	mouse_x_click = mouse_x;
	mouse_y_click = mouse_y;
	if(mouse.valid == false)
		mouse_x_click = mouse_y_click = false;
	
	isDrag = true;
	
	resize_all = false;
	if(ZOOM == 100){
		if(event.target.id == "resize-w")
			resize_all = "w";
		else if(event.target.id == "resize-h")
			resize_all = "h";
		else if(event.target.id == "resize-wh")
			resize_all = "wh";
		}
	
	//preview
	if(event.target.id == "canvas_preview") 
		calc_preview_by_mouse(mouse_x, mouse_y);
	
	//move
	if(ACTION == 'erase'){
		var size = TOOLS.action_data().attributes.size;
		var is_circle = TOOLS.action_data().attributes.circle;
		
		if(is_circle == false)
			canvas_active().clearRect(mouse_x-size/2, mouse_y-size/2, size, size);
		else{
			//set Composite
			canvas_active().save();
			canvas_active().globalCompositeOperation = 'destination-out';
			canvas_active().fillStyle = "#ffffff";
			canvas_active().beginPath();
			canvas_active().arc(mouse_x, mouse_y, size/2, 0,Math.PI*2,true);
			canvas_active().fill();
			canvas_active().restore();
			}
		}
	else if(ACTION == 'blur'){
		if(mouse.valid == true){
			var size = TOOLS.action_data().attributes.size;
			var xx = mouse_x - size/2;
			var yy = mouse_y - size/2;
			var param1 = TOOLS.action_data().attributes.strength;
			var imageData = canvas_active().getImageData(xx, yy, size, size);
			var filtered = ImageFilters.StackBlur(imageData, param1);	//add effect
			canvas_active().putImageData(filtered, xx, yy);
			zoom();
			}
		}
	else if(ACTION == 'sharpen'){
		if(mouse.valid == true){
			var size = TOOLS.action_data().attributes.size;
			var xx = mouse_x - size/2;
			var yy = mouse_y - size/2;
			var param1 = TOOLS.action_data().attributes.strength;
			var imageData = canvas_active().getImageData(xx, yy, size, size);
			var filtered = ImageFilters.Sharpen(imageData, param1);	//add effect
			canvas_active().putImageData(filtered, xx, yy);
			zoom();
			}
		}
	else if(ACTION == 'magic_wand'){
		if(mouse.valid == true)
			tool_magic_wand(canvas_active(), WIDTH, HEIGHT, mouse_x, mouse_y, TOOLS.action_data().attributes.sensitivity);
		}	
	else if(ACTION == 'fill'){
		var color_to = hex2rgb(COLOUR);
		if(mouse.valid == true)
			toolFiller(canvas_active(), WIDTH, HEIGHT, mouse_x, mouse_y, color_to, TOOLS.action_data().attributes.sensitivity);
		}
	else if(ACTION == 'get_color'){
		if(mouse.valid == false) return true;
		var c = canvas_active().getImageData(mouse_x, mouse_y, 1, 1).data;
		COLOUR = "#" + ("000000" + rgbToHex(c[0], c[1], c[2])).slice(-6);
		TOOLS.sync_colors();
		}
	else if(ACTION == 'letters'){
		if(mouse.valid == false) return false;
		var text = prompt("Enter text", '');
		if(text != null){
			canvas_active().beginPath();
			canvas_active().fillStyle = COLOUR;
			canvas_active().font = "normal "+TOOLS.action_data().attributes.size+"px Arial";
			canvas_active().fillText(text, mouse_x, mouse_y+font_pixel_to_height(TOOLS.action_data().attributes.size));
			zoom();
			}
		isDrag = false;
		}
	}
//mouse move
function mouse_move(event){
	if(POP != undefined && POP.active==true) return true;
	var mouse = get_mouse_position(event);
	var mouse_x = mouse.x;
	var mouse_y = mouse.y;
	
	mouse_pos = [mouse_x, mouse_y];
	LAYER.update_info_block();
	if(ACTION != 'select_square')
		select_square_action = '';
		
	//preview
	if(event.target.id == "canvas_preview" && isDrag==true)
		calc_preview_by_mouse(mouse_x, mouse_y);
	
	if(ZOOM == 100){
		if(event.target.id == "resize-w")
			document.body.style.cursor = "w-resize";
		else if(event.target.id == "resize-h")
			document.body.style.cursor = "n-resize";
		else if(event.target.id == "resize-wh")
			document.body.style.cursor = "nw-resize";
		else
			document.body.style.cursor = "auto";
		if(resize_all != false && isDrag==true){
			document.body.style.cursor = "auto";
			if(resize_all == "w"){
				new_w = mouse_x;
				new_h = HEIGHT;
				}
			else if(resize_all == "h"){
				new_w = WIDTH;
				new_h = mouse_y;
				}
			else if(resize_all == "wh"){
				new_w = mouse_x;
				new_h = mouse_y;
				}
			canvas_front.clearRect(0, 0, WIDTH, HEIGHT);
			canvas_front.dashedRect(0, 0, new_w-1, new_h-1);
			event.preventDefault();
			remove_selection();
			return false;
			}
		}
	
	if(ACTION == 'erase' && resize_all==false && mouse.valid == true){
		var size = TOOLS.action_data().attributes.size;
		var is_circle = TOOLS.action_data().attributes.circle;
		var size_half = round(size/2);
		
		//show size
		canvas_front.clearRect(0, 0, WIDTH, HEIGHT);
		canvas_front.lineWidth = 1;
		if(is_circle == false)
			canvas_front.dashedRect(mouse_x-size_half, mouse_y-size_half, mouse_x+size_half, mouse_y+size_half, 1, '#000000');
		else{
			canvas_front.beginPath();
			canvas_front.arc(mouse_x, mouse_y, size/2, 0,Math.PI*2,true);
			canvas_front.stroke();
			}
		}
	else if(ACTION == 'blur' && resize_all==false && mouse.valid == true){
		var size = TOOLS.action_data().attributes.size;
		var size_half = round(size/2);
		//show size
		canvas_front.clearRect(0, 0, WIDTH, HEIGHT);
		canvas_front.lineWidth = 1;
		canvas_front.dashedRect(mouse_x-size_half, mouse_y-size_half, mouse_x+size_half, mouse_y+size_half, 1, '#000000');
		}
	else if(ACTION == 'sharpen' && resize_all==false && mouse.valid == true){
		var size = TOOLS.action_data().attributes.size;
		var size_half = round(size/2);
		//show size
		canvas_front.clearRect(0, 0, WIDTH, HEIGHT);
		canvas_front.lineWidth = 1;
		canvas_front.dashedRect(mouse_x-size_half, mouse_y-size_half, mouse_x+size_half, mouse_y+size_half, 1, '#000000');
		}	
	else if(ACTION == 'select_square' && resize_all==false && mouse.valid == true){
		canvas_front.lineWidth = 1;
		if(select_square != false && isDrag == false){
			border_size=5;
			select_square_action = '';
			var is_left = false;
			var is_right = false;
			var is_top = false;
			var is_bottom = false;
			//left
			if(check_mouse_pos(select_square.x, select_square.y+select_square.h/2, 4, mouse_x, mouse_y)==true){
				document.body.style.cursor = "w-resize";
				select_square_action = 'resize-left';
				is_left = true;
				}
			//top
			else if(check_mouse_pos(select_square.x+select_square.w/2, select_square.y, 4, mouse_x, mouse_y)==true){
				document.body.style.cursor = "n-resize";
				select_square_action = 'resize-top';
				is_top = true;
				}
			//right
			else if(check_mouse_pos(select_square.x+select_square.w, select_square.y+select_square.h/2, 4, mouse_x, mouse_y)==true){
				document.body.style.cursor = "w-resize";
				select_square_action = 'resize-right';
				is_right = true;
				}
			//bottom
			else if(check_mouse_pos(select_square.x+select_square.w/2, select_square.y+select_square.h, 4, mouse_x, mouse_y)==true){
				document.body.style.cursor = "n-resize";
				select_square_action = 'resize-bottom';
				is_bottom = true;
				}
			
			//corner 1
			if(check_mouse_pos(select_square.x, select_square.y, 4, mouse_x, mouse_y)==true){
				document.body.style.cursor = "nw-resize";
				select_square_action = 'resize-1';
				}
			//corner 2
			else if(check_mouse_pos(select_square.x+select_square.w, select_square.y, 4, mouse_x, mouse_y)==true){
				document.body.style.cursor = "ne-resize";
				select_square_action = 'resize-2';
				}
			//corner 3
			else if(check_mouse_pos(select_square.x+select_square.w, select_square.y+select_square.h, 4, mouse_x, mouse_y)==true){
				document.body.style.cursor = "nw-resize";
				select_square_action = 'resize-3';
				}
			//corner 4
			else if(check_mouse_pos(select_square.x, select_square.y+select_square.h, 4, mouse_x, mouse_y)==true){
				document.body.style.cursor = "ne-resize";
				select_square_action = 'resize-4';
				}
	
			if(select_square_action == '' 
			  && mouse_x > select_square.x && mouse_y > select_square.y
			  && mouse_x < select_square.x+select_square.w && mouse_y < select_square.y+select_square.h){
			  	select_square_action = 'move';
				document.body.style.cursor = "move";
				}
			if(select_square_action == '' && mouse.valid == true)
				document.body.style.cursor = "auto";	
			}
		}
		
	if(isDrag === false) return false;	//only drag now

	if(ACTION == 'erase'){
		var size = TOOLS.action_data().attributes.size;
		var is_circle = TOOLS.action_data().attributes.circle;
		if(is_circle == false)
			canvas_active().clearRect(mouse_x - size/2, mouse_y - size/2, size, size);
		else{
			//set Composite
			canvas_active().save();
			canvas_active().globalCompositeOperation = 'destination-out';
			canvas_active().fillStyle = "#ffffff";
			canvas_active().beginPath();
			canvas_active().arc(mouse_x, mouse_y, size/2, 0,Math.PI*2,true);
			canvas_active().fill();
			canvas_active().restore();
			}
		zoom(undefined, false);
		}
	else if(ACTION == 'blur'){
		if(mouse.valid == true){
			var xx = mouse_x - size/2;
			var yy = mouse_y - size/2;
			var size = TOOLS.action_data().attributes.size;
			var param1 = TOOLS.action_data().attributes.strength;
			var imageData = canvas_active().getImageData(xx, yy, size, size);
			var filtered = ImageFilters.StackBlur(imageData, param1);	//add effect
			canvas_active().putImageData(filtered, xx, yy);
			zoom();
			}
		}
	else if(ACTION == 'sharpen'){
		if(mouse.valid == true){
			var xx = mouse_x - size/2;
			var yy = mouse_y - size/2;
			var size = TOOLS.action_data().attributes.size;
			var param1 = TOOLS.action_data().attributes.strength;
			var imageData = canvas_active().getImageData(xx, yy, size, size);
			var filtered = ImageFilters.Sharpen(imageData, param1);	//add effect
			canvas_active().putImageData(filtered, xx, yy);
			zoom();
			}
		}
	else if(ACTION == 'select_tool'){
		if(mouse.valid == false || mouse_x_click === false) return false;
		canvas_front.clearRect(0, 0, WIDTH, HEIGHT);
		canvas_front.drawImage(canvas_active(true), mouse_x - mouse_x_click, mouse_y - mouse_y_click);
		}
	else if(ACTION == 'brush'){
		if(mouse_x_move_last != false && mouse_y_move_last != false){
			canvas_active().beginPath();
			canvas_active().moveTo(mouse_x_move_last, mouse_y_move_last);
			canvas_active().lineTo(mouse_x, mouse_y);
			canvas_active().lineWidth = TOOLS.action_data().attributes.size;
			canvas_active().strokeStyle = COLOUR;
			canvas_active().stroke();
			}
		}	
	else if(ACTION == 'line'){
		document.body.style.cursor = "crosshair";
		canvas_front.clearRect(0, 0, WIDTH, HEIGHT);
		canvas_front.beginPath();
		canvas_front.moveTo(mouse_x_click + 0.5, mouse_y_click + 0.5);
		if(ctrl_pressed == true){
			if(Math.abs(mouse_x_click - mouse_x) < Math.abs(mouse_y_click - mouse_y) )
				canvas_front.lineTo(mouse_x_click + 0.5, mouse_y + 0.5);
			else
				canvas_front.lineTo(mouse_x + 0.5, mouse_y_click + 0.5);
			}
		else
			canvas_front.lineTo(mouse_x + 0.5, mouse_y + 0.5);
		canvas_front.lineWidth = TOOLS.action_data().attributes.size;
		canvas_front.strokeStyle = COLOUR;
		canvas_front.stroke();
		}
	else if(ACTION == 'draw_square'){
		canvas_front.clearRect(0, 0, WIDTH, HEIGHT);
		canvas_front.beginPath();
		var dx = mouse_x-mouse_x_click;
		var dy = mouse_y-mouse_y_click;
		if(TOOLS.action_data().attributes.square==true)
			dx = dy = Math.min(dx, dy);
		if(TOOLS.action_data().attributes.fill==false)
			canvas_front.rect(mouse_x_click + 0.5, mouse_y_click + 0.5, dx, dy);
		else
			canvas_front.rect(mouse_x_click, mouse_y_click, dx, dy);
		canvas_front.fillStyle = COLOUR;
		canvas_front.strokeStyle = COLOUR;
		canvas_front.lineWidth = 1;
		if(TOOLS.action_data().attributes.fill==true)
			canvas_front.fill();
		else
			canvas_front.stroke();
		}
	else if(ACTION == 'draw_circle'){
		dist_x = mouse_x - mouse_x_click;
		dist_y = mouse_y - mouse_y_click;
		canvas_front.clearRect(0, 0, WIDTH, HEIGHT);
		if(TOOLS.action_data().attributes.circle==true)
			dist_x = dist_y = Math.min(dist_x, dist_y);
		if(TOOLS.action_data().attributes.fill==true)
			drawEllipseByCenter(canvas_front, mouse_x_click, mouse_y_click, dist_x*2, dist_y*2, COLOUR, true);
		else
			drawEllipseByCenter(canvas_front, mouse_x_click, mouse_y_click, dist_x*2, dist_y*2, COLOUR);
		}
	else if(ACTION == 'pencil'){
		//why no simple lines? this way turns off aliasing
		if(mouse_x_move_last != false && mouse_y_move_last != false){
			//saving
			dist_x = mouse_x_move_last - mouse_x;
			dist_y = mouse_y_move_last - mouse_y;
			distance = Math.sqrt((dist_x*dist_x)+(dist_y*dist_y));
			radiance = Math.atan2(dist_y, dist_x);
			for(var i=0; i<distance; i++){
				x_tmp = mouse_x + Math.cos(radiance)*i;
				y_tmp = mouse_y + Math.sin(radiance)*i;
				
				x_tmp = Math.round(x_tmp);
				y_tmp = Math.round(y_tmp);
				canvas_active().fillStyle = COLOUR;
				canvas_active().fillRect(x_tmp, y_tmp, 1, 1);
				}
			}
		}
	else if(ACTION == 'select_square'){
		if(mouse_x < 0) mouse_x = 0;
		if(mouse_y< 0) mouse_y = 0;
		if(mouse_x_click < 0) mouse_x_click = 0;
		if(mouse_y_click < 0) mouse_y_click = 0;
		if(mouse_x >= WIDTH) mouse_x = WIDTH-1;
		if(mouse_y >= HEIGHT) mouse_y = HEIGHT-1;
		if(mouse_x_click >= WIDTH) mouse_x_click = WIDTH-1;
		if(mouse_y_click >= HEIGHT) mouse_y_click = HEIGHT-1;
		if(select_square_action == ''){
			document.body.style.cursor = "crosshair";
			canvas_front.clearRect(0, 0, WIDTH, HEIGHT);
			canvas_front.dashedRect(mouse_x_click, mouse_y_click, mouse_x, mouse_y);
			}
		else{
			if(select_square_action=='move'){
				try{
					canvas_front.clearRect(0, 0, WIDTH, HEIGHT);	
					canvas_front.drawImage(	canvas_active(true), 
						select_square.x, select_square.y, select_square.w, select_square.h,
						mouse_x - mouse_x_click + select_square.x, 
						mouse_y - mouse_y_click + select_square.y,
						select_square.w, 
						select_square.h );
					canvas_front.restore();
					}
				catch(err){
					console.log("Error: "+err.message);
					}
				}
			else{
				var s_x = select_square.x;
				var s_y = select_square.y;
				var d_x = select_square.w;
				var d_y = select_square.h;
				if(select_square_action=='resize-left'){
					s_x += mouse_x - mouse_x_click;
					d_x -= mouse_x - mouse_x_click;
					}
				else if(select_square_action=='resize-right')
					d_x += mouse_x - mouse_x_click;
				else if(select_square_action=='resize-top'){
					s_y += mouse_y - mouse_y_click;
					d_y -= mouse_y - mouse_y_click;
					}
				else if(select_square_action=='resize-bottom')
					d_y += mouse_y - mouse_y_click;
				else if(select_square_action=='resize-1'){
					s_x += mouse_x - mouse_x_click;
					s_y += mouse_y - mouse_y_click;
					d_x -= mouse_x - mouse_x_click;
					d_y -= mouse_y - mouse_y_click;
					}
				else if(select_square_action=='resize-2'){
					d_x += mouse_x - mouse_x_click;
					s_y += mouse_y -  mouse_y_click;
					d_y -= mouse_y - mouse_y_click;
					}
				else if(select_square_action=='resize-3'){
					d_x += mouse_x - mouse_x_click;
					d_y += mouse_y - mouse_y_click;
					}
				else if(select_square_action=='resize-4'){
					s_x += mouse_x - mouse_x_click;
					d_x -= mouse_x - mouse_x_click;
					d_y += mouse_y - mouse_y_click;
					}
				var s_x = Math.max(s_x, 0);
				var s_y = Math.max(s_y, 0);
				var d_x = Math.max(d_x, 0);
				var d_y = Math.max(d_y, 0);
				
				canvas_front.save();	
				canvas_front.clearRect(0, 0, WIDTH, HEIGHT);
				canvas_front.mozImageSmoothingEnabled = false;
				canvas_front.drawImage(canvas_active(true), 
					select_square.x, select_square.y, select_square.w, select_square.h, 
					s_x, s_y, d_x, d_y);
				canvas_front.restore();
				}
			}
		}
	mouse_x_move_last = mouse_x;
	mouse_y_move_last = mouse_y;
	}
//release mouse click
function mouse_release(event){
	if(POP != undefined && POP.active==true) return true;
	isDrag = false;		
	
	mouse_x_move_last = false
	mouse_y_move_last = false;
	var mouse = get_mouse_position(event);
	if(select_square_action == '' && mouse.valid != false)
		select_square = false;		
	var mouse_x = mouse.x;
	var mouse_y = mouse.y;
	//document.body.style.cursor = "wait";
	
	if(resize_all != false && ZOOM == 100){
		document.body.style.cursor = "auto";
		if(resize_all == "w"){
			WIDTH = mouse_x;
			}
		else if(resize_all == "h"){
			HEIGHT = mouse_y;
			}
		else if(resize_all == "wh"){
			WIDTH = mouse_x;
			HEIGHT = mouse_y;
			}
		RATIO = WIDTH/HEIGHT;
		LAYER.set_canvas_size();
		zoom();
		}
	if(mouse.valid == false) return false;
	
	canvas_front.clearRect(0, 0, WIDTH, HEIGHT);
	if(ACTION == 'line'){
		canvas_active().beginPath();
		canvas_active().moveTo(mouse_x_click + 0.5, mouse_y_click + 0.5);
		if(ctrl_pressed == true){
			if(Math.abs(mouse_x_click-mouse_x) < Math.abs(mouse_y_click-mouse_y) )
				canvas_active().lineTo(mouse_x_click + 0.5, mouse_y + 0.5);
			else
				canvas_active().lineTo(mouse_x + 0.5, mouse_y_click + 0.5);
			}
		else
			canvas_active().lineTo(mouse_x + 0.5, mouse_y + 0.5);
		canvas_active().lineWidth = TOOLS.action_data().attributes.size;
		canvas_active().strokeStyle = COLOUR;
		canvas_active().stroke();
		} 
	else if(ACTION == 'select_tool' && event.target.id != "canvas_preview"){
		if(mouse.valid == false || mouse_x_click === false) return false;
		var tmp = canvas_active().getImageData(0, 0, WIDTH, HEIGHT);
		canvas_active().clearRect(0, 0, WIDTH, HEIGHT);
		canvas_active().putImageData(tmp, 
			mouse_x - mouse_x_click, mouse_y - mouse_y_click);
		}
	else if(ACTION == 'draw_square'){
		canvas_active().beginPath();
		var dx = mouse_x-mouse_x_click;
		var dy = mouse_y-mouse_y_click;
		if(TOOLS.action_data().attributes.square==true)
			dx = dy = Math.min(dx, dy);
		canvas_front.rect(mouse_x_click, mouse_y_click, dx, dy);
		if(TOOLS.action_data().attributes.fill==false)
			canvas_active().rect(mouse_x_click + 0.5, mouse_y_click + 0.5, dx, dy);
		else
			canvas_active().rect(mouse_x_click, mouse_y_click, dx, dy);
		canvas_active().fillStyle = COLOUR;
		canvas_active().strokeStyle = COLOUR;
		canvas_active().lineWidth = 1;
		if(TOOLS.action_data().attributes.fill==true)
			canvas_active().fill();
		else
			canvas_active().stroke();
		}
	else if(ACTION == 'draw_circle'){
		dist_x = mouse_x - mouse_x_click;
		dist_y = mouse_y - mouse_y_click;
		if(TOOLS.action_data().attributes.circle==true)
			dist_x = dist_y = Math.min(dist_x, dist_y);
		canvas_active().lineWidth = 1;
		if(TOOLS.action_data().attributes.fill==true)
			drawEllipseByCenter(canvas_active(), mouse_x_click, mouse_y_click, dist_x*2, dist_y*2, COLOUR, true);
		else
			drawEllipseByCenter(canvas_active(), mouse_x_click, mouse_y_click, dist_x*2, dist_y*2, COLOUR);
		}
	else if(ACTION == 'pencil'){
		canvas_active().fillStyle = COLOUR;
		canvas_active().fillRect (mouse_x, mouse_y, 1, 1);
		}
	else if(ACTION == 'select_square'){
		if(mouse_x < 0) mouse_x = 0;
		if(mouse_y < 0) mouse_y = 0;
		if(mouse_x_click < 0) mouse_x_click = 0;
		if(mouse_y_click < 0) mouse_y_click = 0;
		if(mouse_x >= WIDTH) mouse_x = WIDTH-1;
		if(mouse_y >= HEIGHT) mouse_y = HEIGHT-1;
		if(mouse_x_click >= WIDTH) mouse_x_click = WIDTH-1;
		if(mouse_y_click >= HEIGHT) mouse_y_click = HEIGHT-1;

		if(select_square_action == ''){
			if(mouse_x != mouse_x_click && mouse_y != mouse_y_click){
				select_square = {
					x: 	Math.min(mouse_x, mouse_x_click),
					y: 	Math.min(mouse_y, mouse_y_click),
					w: 	Math.abs(mouse_x - mouse_x_click),
					h: 	Math.abs(mouse_y - mouse_y_click)
					};
				}
			}
		else{	
			if(select_square_action=='move'){
				try{
					select_data_tmp = canvas_active().getImageData(select_square.x, select_square.y, select_square.w, select_square.h);
					canvas_active().clearRect(select_square.x, select_square.y, select_square.w, select_square.h);
					canvas_active().putImageData(select_data_tmp, mouse_x-mouse_x_click+select_square.x, mouse_y-mouse_y_click+select_square.y);
					}
				catch(err){
					console.log("Error: "+err.message);
					}
				select_square.x += mouse_x - mouse_x_click;
				select_square.y += mouse_y - mouse_y_click;
				}
			else{
				var s_x = select_square.x;
				var s_y = select_square.y;
				var d_x = select_square.w;
				var d_y = select_square.h;
				
				if(select_square_action=='resize-left'){
					s_x += mouse_x - mouse_x_click;
					d_x -= mouse_x - mouse_x_click;
					}
				else if(select_square_action=='resize-right')
					d_x += mouse_x - mouse_x_click;
				else if(select_square_action=='resize-top'){
					s_y += mouse_y - mouse_y_click;
					d_y -= mouse_y - mouse_y_click;
					}
				else if(select_square_action=='resize-bottom')
					d_y += mouse_y - mouse_y_click;
				else if(select_square_action=='resize-1'){
					s_x += mouse_x - mouse_x_click;
					s_y += mouse_y - mouse_y_click;
					d_x -= mouse_x - mouse_x_click;
					d_y -= mouse_y - mouse_y_click;
					}
				else if(select_square_action=='resize-2'){
					d_x += mouse_x - mouse_x_click;
					s_y += mouse_y - mouse_y_click;
					d_y -= mouse_y - mouse_y_click;
					}
				else if(select_square_action=='resize-3'){
					d_x += mouse_x - mouse_x_click;
					d_y += mouse_y - mouse_y_click;
					}
				else if(select_square_action=='resize-4'){
					s_x += mouse_x - mouse_x_click;
					d_x -= mouse_x - mouse_x_click;
					d_y += mouse_y - mouse_y_click;
					}
				var s_x = Math.max(s_x, 0);
				var s_y = Math.max(s_y, 0);
				var d_x = Math.max(d_x, 0);
				var d_y = Math.max(d_y, 0);
			
				var tempCanvas = document.createElement("canvas");
				var tempCtx = tempCanvas.getContext("2d");
				tempCanvas.width = Math.max(d_x, select_square.w);
				tempCanvas.height = Math.max(d_y, select_square.h);
				tempCtx.drawImage(canvas_active(true), select_square.x, select_square.y, select_square.w, select_square.h, 0, 0, select_square.w, select_square.h);
				
				canvas_active().clearRect(s_x, s_y, d_x, d_y);
				canvas_active().drawImage(tempCanvas, 0, 0, select_square.w, select_square.h, s_x, s_y, d_x, d_y);
			
				select_square.x = s_x;
				select_square.y = s_y;
				select_square.w = d_x;
				select_square.h = d_y;
				}
			}
		draw_selected_area();
		LAYER.update_info_block();
		}
	resize_all = false;
	document.body.style.cursor = "auto";
	zoom();
	}
//upload drop zone
function upload_drop(e){
	e.preventDefault();
	var acceptedTypes = {
		'image/png': true,
		'image/jpeg': true,
		'image/gif': true,
		'text/plain': true,
		};
	document.getElementById("uploadprogress").style.display='block';
	progress.value = progress.innerHTML = 0;
	for (var i = 0, f; f = e.dataTransfer.files[i]; i++){
		var file = e.dataTransfer.files[i];
		var FR = new FileReader();	
		FR.file = e.dataTransfer.files[i];			
		FR.onload = function(event){
			if (acceptedTypes[this.file.type] === true){
				LAYER.layer_add(this.file.name, event.target.result, this.file.type);
				}
			//finish progress
			progress.value = progress.innerHTML = 100;
			document.getElementById("uploadprogress").style.display='none';
			};		
		FR.onprogress  = (function(e){
			return function(e){
			 	var complete = (e.loaded / e.total * 100 | 0);
				progress.value = progress.innerHTML = complete;
				};
			})(f);
		if(file.type == "text/plain")
			FR.readAsText(f);	
		else
			FR.readAsDataURL(f);
		}
	document.getElementById("drop_zone").style.display='none';
	}
function mouse_wheel_handler(e){	//return true;
	var step = 100;
	//zoom
	if(ctrl_pressed==true){
		var delta = Math.max(-1, Math.min(1, (e.wheelDelta || -e.detail)));
		if(ZOOM <=100 && delta < 0)
			step = 10;
		if(ZOOM <100 && delta > 0)
			step = 10;
		delta = delta * step;
		if(ZOOM + delta > 0){
			ZOOM = ZOOM + delta;
			calc_preview_auto();
			zoom();
			}
		if(TOOLS.action_data().name == 'zoom'){
			TOOLS.action_data().attributes.zoom = ZOOM;
			show_action_attributes();
			}
			
		//disable page scroll if ctrl pressed
		e.preventDefault()
		return false;
		}
	}
	
//=== Clipboard ================================================================

//firefox
var pasteCatcher;
if (!window.Clipboard){
	pasteCatcher = document.createElement("div");
	pasteCatcher.setAttribute("id", "paste_ff");
	pasteCatcher.setAttribute("contenteditable", "");
	pasteCatcher.style.opacity = 0;
	pasteCatcher.style.marginLeft = "-20px";
	document.body.appendChild(pasteCatcher);
	pasteCatcher.focus();
	document.addEventListener("click", function(){
		//pasteCatcher.focus();
		});
	document.getElementById('paste_ff').addEventListener('DOMSubtreeModified',function(){
		if(pasteCatcher.children.length == 1){
			img = pasteCatcher.firstElementChild.src;
			LAYER.layer_add('Paste', img);
			pasteCatcher.innerHTML = '';
			}
		},false);
	}
//chrome
window.addEventListener("paste", pasteHandler);
function pasteHandler(e){
	if(e.clipboardData) {
		var items = e.clipboardData.items;
		if (items){
			for (var i = 0; i < items.length; i++) {
				if (items[i].type.indexOf("image") !== -1) {
					var blob = items[i].getAsFile();
					var URLObj = window.URL || window.webkitURL;
					var source = URLObj.createObjectURL(blob);
					createImage(source);
					}
				}
			}
		// If we can't handle clipboard data directly (Firefox),
		// we need to read what was pasted from the contenteditable element
		else{
			}
		}
	else{
		setTimeout(checkInput, 1);
		}
	}
function checkInput(){
	var child = pasteCatcher.childNodes[0];
	pasteCatcher.innerHTML = "";
	if (child){
		if (cild.tagName === "IMG"){
			createImage(child.src);
			}
		}
	}
function createImage(source){
	var pastedImage = new Image();
	pastedImage.onload = function() {
		LAYER.layer_add('Paste', source);
		}
	pastedImage.src = source;
	}

//=== /Clipboard ===============================================================

function draw_selected_area(){
	//draw area
	canvas_front.clearRect(0, 0, WIDTH, HEIGHT);
	var x = select_square.x;
	var y = select_square.y;
	var w = select_square.w;
	var h = select_square.h;
	if(ZOOM != 100){
		x = round(x);
		y = round(y);
		w = round(w);
		h = round(h);
		}
	
	var x2 = Math.min(x + w, WIDTH-1);
	var y2 = Math.min(y + h, HEIGHT-1);
	canvas_front.dashedRect(x, y, x2, y2);
	
	//draw carners
	square(x, y, 4);
	square(x+w, y, 4);
	square(x, y+h, 4);
	square(x+w, y+h, 4);
	
	//draw centers
	square(x+w/2, y, 4);
	square(x, y+h/2, 4);
	square(x+w/2, y+h, 4);
	square(x+w, y+h/2, 4);
	
	function square(x, y, size){
		canvas_front.beginPath();
		canvas_front.rect(x-round(size/2), y-round(size/2), size, size);
		canvas_front.fillStyle = "#000000";
		canvas_front.fill();
		}
	}
function check_mouse_pos(x, y, size, mouse_x, mouse_y){
	if(mouse_x > x-round(size) && mouse_x < x+round(size))
		if(mouse_y > y-round(size) && mouse_y < y+round(size))
		return true;
	return false;
	}
function scroll_window(){
	var pad_left = 109;
	var pad_top = 34;
	var dim = get_dimensions();
	var page_w = dim[0];
	var page_h = dim[1];
	var total_w = (WIDTH * ZOOM/100)  + pad_left;
	var total_h = (HEIGHT * ZOOM/100) + pad_top;
	var visible_w = page_w - 60;
	var visible_h = page_h - 60;
	
	var scrollbar_w = page_w * visible_w / total_w;
	var scrollbar_h = page_h * visible_h / total_h;

	xx = total_w * ZOOM_X / (PREVIEW_SIZE.w);
	yy = total_h * ZOOM_Y / (PREVIEW_SIZE.h );
	
	//minuus scrollbar size
	xx = xx - scrollbar_w/2;
	yy = yy - scrollbar_h/2;
	
	scrollTo(xx, yy);
	}
function calc_preview_by_mouse(mouse_x, mouse_y){
	ZOOM_X = mouse_x - mini_rect_data.w/2;
	ZOOM_Y = mouse_y - mini_rect_data.h/2;
	if(ZOOM_X < 0) ZOOM_X = 0;
	if(ZOOM_Y < 0) ZOOM_Y = 0;

	zoom(undefined, true);
	return true;
	}
var mini_rect_data = { w: 0, h:0 };
function calc_preview_auto(){
	var pad_left = 109;
	var pad_top = 34;
	var dim = get_dimensions();
	var page_w = dim[0];
	var page_h = dim[1];
	var total_w = (WIDTH * ZOOM/100)  + pad_left;
	var total_h = (HEIGHT * ZOOM/100) + pad_top;
	var visible_w = page_w - 60;
	var visible_h = page_h - 60;		
	
	mini_rect_data.w = round(visible_w * PREVIEW_SIZE.w / total_w);	
	mini_rect_data.h = round(visible_h * PREVIEW_SIZE.h / total_h);
	
	redraw_preview();
	}
