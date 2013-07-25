function MENU_CLASS(){
	this.do_menu = function(name){

		//===== File ===========================================================
		
		if(name == 'file_new'){
			ZOOM = 100;
			init();
			}
		else if(name == 'file_open'){
			POP.add({title: "Description:",	value: "use drag-and-drop",	});
			POP.show('Open file', '');
			}
		else if(name == 'file_save'){
			POP.add({name: "type",		title: "Save as type:",	values: ["PNG", "JPG"],	});	
			POP.add({name: "quality",	title: "Quality (1-100) (optional):",	value: 92, range: [1, 100],	});
			POP.show('Save', this.save_quick);
			}
		else if(name == 'file_save_as'){
			POP.add({name: "name",		title: "Enter name:",	value: ["example"],	});
			POP.add({name: "type",		title: "Save as type:",	values: ["PNG", "JPG"],	});	
			POP.add({name: "quality",	title: "Quality (1-100) (optional):",	value: 92, range: [1, 100],	});
			POP.show('Save as ...', this.save_full);
			}
		
		//===== Edit ===========================================================
		
		else if(name == 'edit_undo'){
			undo();
			}
		else if(name == 'edit_cut'){
			if(select_square != false){
				this.copy_to_clipboard();
				canvas_active().clearRect(select_square.x, select_square.y, select_square.w, select_square.h);
				select_square = false;
				canvas_front.clearRect(0, 0, WIDTH, HEIGHT);
				}
			}
		else if(name == 'edit_copy'){
			if(select_square != false)
				this.copy_to_clipboard();
			}
		else if(name == 'edit_paste'){
			this.paste('menu');
			}
		else if(name == 'edit_select'){
			select_square = {
				x: 	0,
				y: 	0,
				w: 	WIDTH,
				h: 	HEIGHT,
				};
			canvas_front.clearRect(0, 0, WIDTH, HEIGHT);
			canvas_front.dashedRect(0, 0, WIDTH, HEIGHT);
			}
		else if(name == 'edit_clear'){
			select_square = false;
			canvas_front.clearRect(0, 0, WIDTH, HEIGHT);
			}
		
		//===== Image ==========================================================
		
		//trim
		else if(name == 'image_trim'){
			trim();
			LAYER.update_info_block();
			}
		//cflip
		else if(name == 'image_vflip'){
			save_state();
			var tempCanvas = document.createElement("canvas");
			var tempCtx = tempCanvas.getContext("2d");
			tempCanvas.width = WIDTH;
			tempCanvas.height = HEIGHT;
			tempCtx.drawImage(canvas_active(true), 0, 0, WIDTH, HEIGHT);
			//flip
			canvas_active().clearRect(0, 0, WIDTH, HEIGHT);
			canvas_active().save();
			canvas_active().scale(-1, 1);
			canvas_active().drawImage(tempCanvas, -WIDTH, 0);
			canvas_active().restore();
			}
		//hflip
		else if(name == 'image_hflip'){
			save_state();
			var tempCanvas = document.createElement("canvas");
			var tempCtx = tempCanvas.getContext("2d");
			tempCanvas.width = WIDTH;
			tempCanvas.height = HEIGHT;
			tempCtx.drawImage(canvas_active(true), 0, 0, WIDTH, HEIGHT);
			//flip
			canvas_active().clearRect(0, 0, WIDTH, HEIGHT);
			canvas_active().save();
			canvas_active().scale(1, -1);
			canvas_active().drawImage(tempCanvas, 0, -HEIGHT);
			canvas_active().restore();
			}
		//rotate
		else if(name == 'image_rotate'){
			save_state();
			POP.add({name: "angle",	title: "Enter angle (0-360):",	value: 90, range: [0, 360],	});
			POP.show('Rotate', function(response){
					MENU.rotate_layer(response, canvas_active(), WIDTH, HEIGHT); 
					},
				function(response, canvas_preview, w, h){
					MENU.rotate_layer(response, canvas_preview, w, h); 
					});
			}
		//resize
		else if(name == 'image_resize'){
			save_state();
			POP.add({name: "width",	title: "Enter new width:",	value: WIDTH,});
			POP.add({name: "height",title: "Enter new height:",	value: HEIGHT});
			POP.add({name: "mode",	title: "Mode:",	values: ["Resample - Lanczos", "Resize"],});
			POP.show('Resize', this.resize_layer);
			}	
		//invert
		else if(name == 'image_invert'){
			save_state();
			if(select_square == false)
				var imageData = canvas_active().getImageData(0, 0, WIDTH, HEIGHT);
			else
				var imageData = canvas_active().getImageData(select_square.x, select_square.y, select_square.w, select_square.h);
			var pixels = imageData.data;
			for (var i = 0; i < pixels.length; i += 4){
				pixels[i]   = 255 - pixels[i];   // red
				pixels[i+1] = 255 - pixels[i+1]; // green
				pixels[i+2] = 255 - pixels[i+2]; // blue
				}
			//save
			if(select_square == false)
				canvas_active().putImageData(imageData, 0, 0);
			else
				canvas_active().putImageData(imageData, select_square.x, select_square.y)
			}
		//attributes
		else if(name == 'image_attributes'){
			save_state();
			
			POP.add({name: "width",		title: "Enter width:",	value: WIDTH,	});
			POP.add({name: "height",	title: "Enter height:",	value: HEIGHT,	});	
			POP.add({name: "transparency",	title: "Transparent:",	values: ['Yes', 'No'],});
			POP.show('Attributes', this.resize_custom);
			}
		//Grid
		else if(name == 'image_grid'){
			if(grid == false){
				POP.add({name: "gap_x",		title: "Horizontal gap:",	value: "50",	});
				POP.add({name: "gap_y",		title: "Vertical gap:",	value: "50",	});	
				POP.show('Grid', function(response){
					gap_x = response.gap_x;
					gap_y = response.gap_y;
					grid = true;
					draw_grid(canvas_back, gap_x, gap_y);
					zoom();
					});
				}
			else{
				grid = false;
				canvas_back.clearRect(0, 0, WIDTH, HEIGHT);
				draw_background(canvas_back);
				}
			}
		else if(name == 'image_clear'){
			save_state();
			canvas_active().clearRect(0, 0, WIDTH, HEIGHT);
			}
			
		//===== Effects ========================================================
		
		else if(name == 'effects_bw'){
			save_state();
			effect_bw(canvas_active(), WIDTH, HEIGHT);
			}
		else if(name == 'effects_BoxBlur'){
			save_state();
			POP.add({name: "param1",	title: "H Radius:",	value: "3",	range: [1, 20], });
			POP.add({name: "param2",	title: "V Radius:",	value: "3",	range: [1, 20], });
			POP.add({name: "param3",	title: "Quality:",	value: "2",	range: [1, 10], });
			POP.show('Blur-Box', function(user_response){
					var param1 = parseInt(user_response.param1);
					var param2 = parseInt(user_response.param2);
					var param3 = parseInt(user_response.param3);
					
					var imageData = canvas_active().getImageData(0, 0, WIDTH, HEIGHT);
					var filtered = ImageFilters.BoxBlur(imageData, param1, param2, param3);	//add effect
					canvas_active().putImageData(filtered, 0, 0);
					zoom();
					},
				function(user_response, canvas_preview, w, h){
					var param1 = parseInt(user_response.param1);
					var param2 = parseInt(user_response.param2);
					var param3 = parseInt(user_response.param3);
					var imageData = canvas_preview.getImageData(0, 0, w, h);
					var filtered = ImageFilters.BoxBlur(imageData, param1, param2, param3);	//add effect
					canvas_preview.putImageData(filtered, 0, 0);
					});
			}
		else if(name == 'effects_GaussianBlur'){
			save_state();
			POP.add({name: "param1",	title: "Strength:",	value: "2",	range: [1, 4], });
			POP.show('Blur-Gaussian', function(user_response){
					var param1 = parseInt(user_response.param1);
					
					var imageData = canvas_active().getImageData(0, 0, WIDTH, HEIGHT);
					var filtered = ImageFilters.GaussianBlur(imageData, param1);	//add effect
					canvas_active().putImageData(filtered, 0, 0);
					zoom();
					},
				function(user_response, canvas_preview, w, h){
					var param1 = parseInt(user_response.param1);
					var imageData = canvas_preview.getImageData(0, 0, w, h);
					var filtered = ImageFilters.GaussianBlur(imageData, param1);	//add effect
					canvas_preview.putImageData(filtered, 0, 0);
					});
			}
		else if(name == 'effects_StackBlur'){
			save_state();
			POP.add({name: "param1",	title: "Radius:",	value: "6",	range: [1, 40], });
			POP.show('Blur-Stack', function(user_response){
					var param1 = parseInt(user_response.param1);
					
					var imageData = canvas_active().getImageData(0, 0, WIDTH, HEIGHT);
					var filtered = ImageFilters.StackBlur(imageData, param1);	//add effect
					canvas_active().putImageData(filtered, 0, 0);
					zoom();
					},
				function(user_response, canvas_preview, w, h){
					var param1 = parseInt(user_response.param1);
					var imageData = canvas_preview.getImageData(0, 0, w, h);
					var filtered = ImageFilters.StackBlur(imageData, param1);	//add effect
					canvas_preview.putImageData(filtered, 0, 0);
					});
			}
		else if(name == 'effects_BrightnessContrast'){
			save_state();
			POP.add({name: "param1",	title: "Brightness:",	value: "0",	range: [-100, 100], });
			POP.add({name: "param2",	title: "Contrast:",	value: "0",	range: [-100, 100], });
			POP.show('Brightness Contrast', function(user_response){
					var param1 = parseInt(user_response.param1);
					var param2 = parseInt(user_response.param2);
					
					var imageData = canvas_active().getImageData(0, 0, WIDTH, HEIGHT);
					var filtered = ImageFilters.BrightnessContrastPhotoshop(imageData, param1, param2);	//add effect
					canvas_active().putImageData(filtered, 0, 0);
					zoom();
					},
				function(user_response, canvas_preview, w, h){
					var param1 = parseInt(user_response.param1);
					var param2 = parseInt(user_response.param2);
					var imageData = canvas_preview.getImageData(0, 0, w, h);
					var filtered = ImageFilters.BrightnessContrastPhotoshop(imageData, param1, param2);	//add effect

					canvas_preview.putImageData(filtered, 0, 0);
					});
			}
		else if(name == 'effects_Channels'){
			save_state();
			POP.add({name: "param1",	title: "Red:",	value: "1",	range: [0, 1], });
			POP.add({name: "param2",	title: "Green:",	value: "0",	range: [0, 1], });
			POP.add({name: "param3",	title: "Blue:",	value: "0",	range: [0, 1], });
			POP.show('Channels', function(user_response){
					var param1 = parseInt(user_response.param1);
					var param2 = parseInt(user_response.param2);
					var param3 = parseInt(user_response.param3);
					var channel = 1;
					if(param2 == 1) channel = 2;
					if(param3 == 1) channel = 3;	
		
					var imageData = canvas_active().getImageData(0, 0, WIDTH, HEIGHT);
					var filtered = ImageFilters.Channels(imageData, channel);	//add effect
					canvas_active().putImageData(filtered, 0, 0);
					zoom();
					},
				function(user_response, canvas_preview, w, h){
					var param1 = parseInt(user_response.param1);
					var param2 = parseInt(user_response.param2);
					var param3 = parseInt(user_response.param3);
					var channel = 1;
					if(param2 == 1) channel = 2;
					if(param3 == 1) channel = 3;
					var imageData = canvas_preview.getImageData(0, 0, w, h);
					var filtered = ImageFilters.Channels(imageData, channel);	//add effect
					canvas_preview.putImageData(filtered, 0, 0);
					});
			}
		else if(name == 'effects_ColorTransformFilter'){
			save_state();
			POP.add({name: "param1",	title: "Red multiplier:",	value: "1",	range: [0, 5], });
			POP.add({name: "param2",	title: "Green multiplier:",	value: "1",	range: [0, 5], });
			POP.add({name: "param3",	title: "Blue multiplier:",	value: "1",	range: [0, 5], });
			POP.add({name: "param4",	title: "Alpha multiplier:",	value: "1",	range: [0, 5], });
			POP.add({name: "param5",	title: "Red offset:",	value: "0",	range: [-255, 255], });
			POP.add({name: "param6",	title: "Green offset:",	value: "0",	range: [-255, 255], });
			POP.add({name: "param7",	title: "Blue offset:",	value: "0",	range: [-255, 255], });
			POP.add({name: "param8",	title: "Alpha offset:",	value: "0",	range: [-255, 255], });
			POP.show('Color Transform', function(user_response){
					var param1 = parseInt(user_response.param1);
					var param2 = parseInt(user_response.param2);
					var param3 = parseInt(user_response.param3);
					var param4 = parseInt(user_response.param4);
					var param5 = parseInt(user_response.param5);
					var param6 = parseInt(user_response.param6);
					var param7 = parseInt(user_response.param7);
					var param8 = parseInt(user_response.param8);
		
					var imageData = canvas_active().getImageData(0, 0, WIDTH, HEIGHT);
					var filtered = ImageFilters.ColorTransformFilter(imageData, param1, param2, param3, param4, param5, param6, param7, param8);	//add effect
					canvas_active().putImageData(filtered, 0, 0);
					zoom();
					},
				function(user_response, canvas_preview, w, h){
					var param1 = parseInt(user_response.param1);
					var param2 = parseInt(user_response.param2);
					var param3 = parseInt(user_response.param3);
					var param4 = parseInt(user_response.param4);
					var param5 = parseInt(user_response.param5);
					var param6 = parseInt(user_response.param6);
					var param7 = parseInt(user_response.param7);
					var param8 = parseInt(user_response.param8);
					var imageData = canvas_preview.getImageData(0, 0, w, h);
					var filtered = ImageFilters.ColorTransformFilter(imageData, param1, param2, param3, param4, param5, param6, param7, param8);	//add effect
					canvas_preview.putImageData(filtered, 0, 0);
					});
			}
		else if(name == 'effects_Desaturate'){
			save_state();
			var imageData = canvas_active().getImageData(0, 0, WIDTH, HEIGHT);
			var filtered = ImageFilters.Desaturate(imageData);	//add effect
			canvas_active().putImageData(filtered, 0, 0);
			}
		else if(name == 'effects_Dither'){
			save_state();
			POP.add({name: "param1",	title: "Levels:",	value: "8",	range: [2, 32], });
			POP.show('Dither', function(user_response){
					var param1 = parseInt(user_response.param1);
					
					var imageData = canvas_active().getImageData(0, 0, WIDTH, HEIGHT);
					var filtered = ImageFilters.Dither(imageData, param1);	//add effect
					canvas_active().putImageData(filtered, 0, 0);
					zoom();
					},
				function(user_response, canvas_preview, w, h){
					var param1 = parseInt(user_response.param1);
					var imageData = canvas_preview.getImageData(0, 0, w, h);
					var filtered = ImageFilters.Dither(imageData, param1);	//add effect
					canvas_preview.putImageData(filtered, 0, 0);
					});
			}
		else if(name == 'effects_Edge'){
			save_state();
			var imageData = canvas_active().getImageData(0, 0, WIDTH, HEIGHT);
			var filtered = ImageFilters.Edge(imageData);	//add effect
			canvas_active().putImageData(filtered, 0, 0);
			}
		else if(name == 'effects_Emboss'){
			save_state();
			var imageData = canvas_active().getImageData(0, 0, WIDTH, HEIGHT);
			var filtered = ImageFilters.Emboss(imageData);	//add effect
			canvas_active().putImageData(filtered, 0, 0);
			}
		else if(name == 'effects_Enrich'){
			save_state();
			var imageData = canvas_active().getImageData(0, 0, WIDTH, HEIGHT);
			var filtered = ImageFilters.Enrich(imageData);	//add effect
			canvas_active().putImageData(filtered, 0, 0);
			}
		else if(name == 'effects_Gamma'){
			save_state();
			POP.add({name: "param1",	title: "Gamma:",	value: "1",	range: [0, 3], });
			POP.show('Gamma', function(user_response){
					var param1 = parseInt(user_response.param1);
					
					var imageData = canvas_active().getImageData(0, 0, WIDTH, HEIGHT);
					var filtered = ImageFilters.Gamma(imageData, param1);	//add effect
					canvas_active().putImageData(filtered, 0, 0);
					zoom();
					},
				function(user_response, canvas_preview, w, h){
					var param1 = parseInt(user_response.param1);
					var imageData = canvas_preview.getImageData(0, 0, w, h);
					var filtered = ImageFilters.Gamma(imageData, param1);	//add effect
					canvas_preview.putImageData(filtered, 0, 0);
					});
			}
		else if(name == 'effects_GrayScale'){
			save_state();
			var imageData = canvas_active().getImageData(0, 0, WIDTH, HEIGHT);
			var filtered = ImageFilters.GrayScale(imageData);	//add effect
			canvas_active().putImageData(filtered, 0, 0);
			}
		else if(name == 'effects_HSLAdjustment'){
			save_state();
			POP.add({name: "param1",	title: "Hue:",	value: "0",	range: [-180, 180], });
			POP.add({name: "param2",	title: "Saturation:",	value: "0",	range: [-100, 100], });
			POP.add({name: "param3",	title: "Luminance:",	value: "0",	range: [-100, 100], });
			POP.show('HSL Adjustment', function(user_response){
					var param1 = parseInt(user_response.param1);
					var param2 = parseInt(user_response.param2);
					var param3 = parseInt(user_response.param3);
					
					var imageData = canvas_active().getImageData(0, 0, WIDTH, HEIGHT);
					var filtered = ImageFilters.HSLAdjustment(imageData, param1, param2, param3);	//add effect
					canvas_active().putImageData(filtered, 0, 0);
					zoom();
					},
				function(user_response, canvas_preview, w, h){
					var param1 = parseInt(user_response.param1);
					var param2 = parseInt(user_response.param2);
					var param3 = parseInt(user_response.param3);
					var imageData = canvas_preview.getImageData(0, 0, w, h);
					var filtered = ImageFilters.HSLAdjustment(imageData, param1, param2, param3);	//add effect
					canvas_preview.putImageData(filtered, 0, 0);
					});
			}
		else if(name == 'effects_Mosaic'){
			save_state();
			POP.add({name: "param1",	title: "Size:",	value: "10",	range: [1, 100], });
			POP.show('Mosaic', function(user_response){
					var param1 = parseInt(user_response.param1);
					
					var imageData = canvas_active().getImageData(0, 0, WIDTH, HEIGHT);
					var filtered = ImageFilters.Mosaic(imageData, param1);	//add effect
					canvas_active().putImageData(filtered, 0, 0);
					zoom();
					},
				function(user_response, canvas_preview, w, h){
					var param1 = parseInt(user_response.param1);
					var imageData = canvas_preview.getImageData(0, 0, w, h);
					var filtered = ImageFilters.Mosaic(imageData, param1);	//add effect
					canvas_preview.putImageData(filtered, 0, 0);
					});
			}
		else if(name == 'effects_Oil'){
			save_state();
			POP.add({name: "param1",	title: "Range:",	value: "2",	range: [1, 5], });
			POP.add({name: "param2",	title: "Levels:",	value: "32",	range: [1, 256], });
			POP.show('Oil', function(user_response){
					var param1 = parseInt(user_response.param1);
					var param2 = parseInt(user_response.param2);
					
					var imageData = canvas_active().getImageData(0, 0, WIDTH, HEIGHT);
					var filtered = ImageFilters.Oil(imageData, param1, param2);	//add effect
					canvas_active().putImageData(filtered, 0, 0);
					zoom();
					},
				function(user_response, canvas_preview, w, h){
					var param1 = parseInt(user_response.param1);
					var param2 = parseInt(user_response.param2);
					var imageData = canvas_preview.getImageData(0, 0, w, h);
					var filtered = ImageFilters.Oil(imageData, param1, param2);	//add effect
					canvas_preview.putImageData(filtered, 0, 0);
					});
			}
		else if(name == 'effects_Posterize'){
			save_state();
			POP.add({name: "param1",	title: "Levels:",	value: "8",	range: [2, 32], });
			POP.show('Posterize', function(user_response){
					var param1 = parseInt(user_response.param1);
					
					var imageData = canvas_active().getImageData(0, 0, WIDTH, HEIGHT);
					var filtered = ImageFilters.Posterize(imageData, param1);	//add effect
					canvas_active().putImageData(filtered, 0, 0);
					zoom();
					},
				function(user_response, canvas_preview, w, h){
					var param1 = parseInt(user_response.param1);
					var imageData = canvas_preview.getImageData(0, 0, w, h);
					var filtered = ImageFilters.Posterize(imageData, param1);	//add effect
					canvas_preview.putImageData(filtered, 0, 0);
					});
			}
		else if(name == 'effects_Sepia'){
			save_state();
			var imageData = canvas_active().getImageData(0, 0, WIDTH, HEIGHT);
			var filtered = ImageFilters.Sepia(imageData);	//add effect
			canvas_active().putImageData(filtered, 0, 0);
			}
		else if(name == 'effects_Sharpen'){
			save_state();
			POP.add({name: "param1",	title: "Factor:",	value: "3",	range: [1, 10], });
			POP.show('Sharpen', function(user_response){
					var param1 = parseInt(user_response.param1);
					var imageData = canvas_active().getImageData(0, 0, WIDTH, HEIGHT);
					var filtered = ImageFilters.Sharpen(imageData, param1);	//add effect
					canvas_active().putImageData(filtered, 0, 0);
					zoom();
					},
				function(user_response, canvas_preview, w, h){
					var param1 = parseInt(user_response.param1);
					var imageData = canvas_preview.getImageData(0, 0, w, h);
					var filtered = ImageFilters.Sharpen(imageData, param1);	//add effect
					canvas_preview.putImageData(filtered, 0, 0);
					});
			}
		else if(name == 'effects_Solarize'){
			save_state();
			var imageData = canvas_active().getImageData(0, 0, WIDTH, HEIGHT);
			var filtered = ImageFilters.Solarize(imageData);	//add effect
			canvas_active().putImageData(filtered, 0, 0);
			}
		
		//===== Help ===========================================================
		
		else if(name == 'help_shortcuts'){
			POP.add({title: "Del:",		value: 'Delete',	});
			POP.add({title: "G:",		value: 'Grid',	});
			POP.add({title: "S:",		value: 'Save',	});
			POP.add({title: "T:",		value: 'Trim',	});
			POP.add({title: "CTRL + Z:",	value: 'Undo',	});
			POP.add({title: "CTRL + A:",	value: 'Select all',	});
			POP.add({title: "CTRL + X:",	value: 'Cut',	});
			POP.add({title: "CTRL + C:",	value: 'Copy',	});
			POP.add({title: "CTRL + V:",	value: 'Paste',	});
			POP.add({title: "Arrow keys:",	value: 'Move active layer by 10px',	});
			POP.add({title: "CTRL + Arrow keys:",	value: 'Move active layer by 50px',	});
			POP.add({title: "SHIFT + Arrow keys:",value: 'Move active layer by 1px',	});
			POP.add({title: "Drag image(s):",	value: 'Insert images',	});
			POP.show('Keyboard Shortcuts', '');
			}	
		else if(name == 'help_about'){
			POP.add({title: "Name:",	value: "miniPaint",	});
			POP.add({title: "Author:",	value: AUTHOR,	});
			POP.add({title: "Email:",	value: EMAIL,	});
			POP.add({title: "License:",	value: "GPL",	});
			POP.add({title: "Version:",	value: VERSION,	});
			POP.show('About', '');
			}
		
		//======================================================================
		
		//close menu
		$('.menu').find('.active').removeClass('active');
		zoom();
		}
	this.resize_custom = function(user_response){
		if(user_response.width != WIDTH || user_response.height != HEIGHT){
			WIDTH = user_response.width;
			HEIGHT = user_response.height;
			RATIO = WIDTH/HEIGHT;
			LAYER.set_canvas_size();
			}
		else{
			if(user_response.transparency == 'Yes')
				TRANSPARENCY = true;
			else
				TRANSPARENCY = false;
			draw_background(canvas_back);
			}
		}
	this.rotate_layer = function(user_response, canvas, w, h){
		angle = user_response.angle;
		var tempCanvas = document.createElement("canvas");
		var tempCtx = tempCanvas.getContext("2d");
		tempCanvas.width = w;
		tempCanvas.height = h;
		var imageData = canvas.getImageData(0, 0, w, h);
		tempCtx.putImageData(imageData, 0, 0);
		
		//rotate
		canvas.clearRect(0, 0, w, h);
		canvas.save();
		canvas.translate(w/2, h/2);
		canvas.rotate(angle * TO_RADIANS);
		canvas.drawImage(tempCanvas, -(w/2), -(h/2));
		canvas.restore();
		if(w == WIDTH)	//if main canvas
			zoom();
		}
	this.copy_to_clipboard = function(){
		PASTE_DATA = false;
		PASTE_DATA = document.createElement("canvas");
		PASTE_DATA.width = select_square.w;
		PASTE_DATA.height = select_square.h;
		PASTE_DATA.getContext("2d").drawImage(canvas_active(true), select_square.x, select_square.y, select_square.w, select_square.h, 0, 0, select_square.w, select_square.h);
		}
	this.paste = function(type){
		if(PASTE_DATA == false){
			if(type == 'menu'){
				POP.add({title: "Notice:",	value: 'To paste from clipboard, use Ctrl-V.',	});
				POP.show('Notice', '');
				}
			return false;
			}
		
		tmp = new Array();
		var new_name = 'Layer #'+(LAYERS.length+1);
		LAYER.create_canvas(new_name);
		LAYERS.push({name: new_name, visible: true});
		layer_active = LAYERS.length-1;
		canvas_active().drawImage(PASTE_DATA, 0, 0);
		LAYER.layer_renew();
		}
	this.save_quick = function(user_response){
		var tempCanvas = document.createElement("canvas");
		var tempCtx = tempCanvas.getContext("2d");
		tempCanvas.width = WIDTH;
		tempCanvas.height = HEIGHT;
		if(TRANSPARENCY == false){
			tempCtx.beginPath();
			tempCtx.rect(0, 0, WIDTH, HEIGHT);
			tempCtx.fillStyle = "#ffffff";
			tempCtx.fill();
			}
		for(var i in LAYERS){
			if(LAYERS[i].visible == false) continue;
			tempCtx.drawImage(document.getElementById(LAYERS[i].name), 0, 0, WIDTH, HEIGHT);
			}
		if(user_response.type == 'PNG')
			window.open(tempCanvas.toDataURL('image/png'));
		else if(user_response.type == 'JPG'){
			var quality = parseInt(user_response.quality);
			if(quality>100 || quality < 1 || isNaN(quality)==true)
				quality = 92;
			quality = quality/100;
			window.open(tempCanvas.toDataURL('image/jpeg', quality));
			}
		}
	this.save_full = function(user_response){
		var url = 'save.php'
		fname = user_response.name;
		var tempCanvas = document.createElement("canvas");
		var tempCtx = tempCanvas.getContext("2d");
		tempCanvas.width = WIDTH;
		tempCanvas.height = HEIGHT;
		if(TRANSPARENCY == false){
			tempCtx.beginPath();
			tempCtx.rect(0, 0, WIDTH, HEIGHT);
			tempCtx.fillStyle = "#ffffff";
			tempCtx.fill();
			}
		for(var i in LAYERS){
			if(LAYERS[i].visible == false) continue;
			tempCtx.drawImage(document.getElementById(LAYERS[i].name), 0, 0, WIDTH, HEIGHT);
			}
		if(user_response.type == 'PNG')	
			var data = tempCanvas.toDataURL("image/png");
		else if(user_response.type == 'JPG'){
			var quality = parseInt(user_response.quality);
			if(quality>100 || quality < 1 || isNaN(quality)==true)
				quality = 92;
			quality = quality/100;
			var data = tempCanvas.toDataURL('image/jpeg', quality);
			}
		else
			return false;
		data = data.substr(data.indexOf(',') + 1).toString();
		var dataInput = document.createElement("input");
		dataInput.setAttribute("name", 'imgdata') ;
		dataInput.setAttribute("value", data);
		var nameInput = document.createElement("input");
		nameInput.setAttribute("name", 'name') ;
		nameInput.setAttribute("value", fname + '.png');
		var myForm = document.createElement("form");
		myForm.method = 'post';
		myForm.action = url;
		myForm.appendChild(dataInput);
		myForm.appendChild(nameInput);
		document.body.appendChild(myForm);
		myForm.submit() ;
		document.body.removeChild(myForm);
		}
	this.resize_layer = function(user_response){
		var width = parseInt(user_response.width);
		var height = parseInt(user_response.height);
		if(isNaN(width) || width<1) return false;
		if(isNaN(height) || height<1) return false;
		
		if(user_response.mode == "Resample - Lanczos"){
			var trim_details = trim(LAYERS[layer_active].name);	//trim
		
			var new_w = WIDTH - trim_details.left - trim_details.right;
			var new_h = HEIGHT - trim_details.top - trim_details.bottom;
			var ratio_new = new_w/new_h;
			if(width / height > RATIO)
				width = round(height * ratio_new);
			else
				height = round(width / ratio_new);
			if(width >= new_w){
				LAYER.resize_canvas(LAYERS[layer_active].name, true);
				zoom();
				return false;
				}
			
			POP.hide();
			POP.add({title: "Status:",	value: 'Resizing...',	});
			POP.show('Status', '');
			
			//resample using lanczos-2
			new thumbnailer(canvas_active(true), width, 3);
			}
		else{
			//simple resize - FAST
			if(width / height > RATIO)
				width = height * RATIO;	
			else
				height = width / RATIO;			
			
			tmp_data = document.createElement("canvas");
			tmp_data.width = WIDTH;
			tmp_data.height = HEIGHT;
			tmp_data.getContext("2d").drawImage(canvas_active(true), 0, 0);
		
			canvas_active().clearRect(0, 0, WIDTH, HEIGHT);
			if(width <= WIDTH){
				canvas_active().drawImage(tmp_data, 0, 0, width, height);
				}
			else{
				WIDTH = round(width);
				HEIGHT = round(height);	
				RATIO = WIDTH/HEIGHT;
				LAYER.set_canvas_size();
				canvas_active().drawImage(tmp_data, 0, 0, width, height);
				}
			zoom();
			}
		}
	}
