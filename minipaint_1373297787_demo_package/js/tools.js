function TOOLS_CLASS(){
	this.draw_helpers = function(){
		//left menu
		var html = '';
		for(var i in ACTION_DATA){
			html += '<a title="'+ACTION_DATA[i].title+'"';
			html += ' style="background: #989898 url(\'img/'+ACTION_DATA[i].icon[0]+'\') no-repeat '+ACTION_DATA[i].icon[1]+'px '+ACTION_DATA[i].icon[2]+'px;"';
			if(ACTION_DATA[i].name==ACTION)
				html += ' class="active"';
			html += ' onclick="return TOOLS.action(\''+ACTION_DATA[i].name+'\');"';
			html += ' id="'+ACTION_DATA[i].name+'"';
			html += ' href="#"></a>'+"\n";
			}
		document.getElementById("menu_left_container").innerHTML = html;
		
		//draw colors
		var html = '';
		var colors_data = [
			['#ff0000', '#ff5b31', '#ffa500', '#ff007f', '#ff00ff'],	//red
			['#00ff00', '#008000', '#7fff00', '#00ff7f', '#8ac273'],	//green
			['#0000ff', '#007fff', '#37629c', '#000080', '#8000ff'],	//blue
			['#ffff00', '#ffff80', '#ddd06a', '#808000', '#bcb88a'],	//yellow
			['#ffffff', '#c0c0c0', '#808080', '#404040', '#000000'],	//grey
			];
		for(var i in colors_data){
			for(var j in colors_data[i]){
				html += '<div style="background-color:'+colors_data[i][j]+';" class="mini-color" onclick="TOOLS.set_color(this);"></div>'+"\n";
				}
			html += '<div style="clear:both;"></div>'+"\n";
			}
		document.getElementById("all_colors").innerHTML = html;
		}
	this.update_attribute = function(object, next_value){
		var max_value = 500;
		for(var k in this.action_data().attributes){
			if(k != object.id) continue;
			if(this.action_data().attributes[k]===true || this.action_data().attributes[k]===false){
				var value;
				if(next_value == 0)
					value=true;
				else
					value=false;
				//save
				this.action_data().attributes[k] = value;
				this.show_action_attributes();
				}
			else{
				if(next_value != undefined){
					object.value = parseInt(this.action_data().attributes[k]) + next_value;
					if(object.value < 0) object.value = 0;
					if(object.value > max_value) object.value = max_value;
					}
				else{
					if(object.value.length==0) return false;
					object.value = parseInt(object.value);
					object.value = Math.abs(object.value);
					if(object.value==0 || isNaN(object.value) || value > max_value)
						object.value = this.action_data().attributes[k];
					}
						
				//save
				this.action_data().attributes[k] = object.value;
				document.getElementById("main_colour").value = object.value;
				document.getElementById(k).value = object.value;
				}
			if(this.action_data().on_update != undefined)
				window[this.action_data().on_update](object.value);
			}
		}
	this.action = function(key){
		if(ACTION == key) return false;
		
		//change
		if(ACTION != '')
			document.getElementById(ACTION).className = "";
		ACTION = key;
		document.getElementById(key).className = "active";
		this.show_action_attributes();
	
		return false;
		}
	this.action_data = function(){	
		for(var i in ACTION_DATA){
			if(ACTION_DATA[i].name == ACTION)
				return ACTION_DATA[i];
			}
		}
	this.show_action_attributes = function(){
		html = '';
		var step = 5;
		for(var k in this.action_data().attributes){
			var title = k[0].toUpperCase() + k.slice(1);
			if(this.action_data().attributes[k]===true || this.action_data().attributes[k]===false){
				//select mode
				if(this.action_data().attributes[k]==true)
					html += '<div onclick="TOOLS.update_attribute(this, 1)" style="background-color:#5680c1;" class="attribute-area" id="'+k+'">'+title+'</div>';
				else
					html += '<div onclick="TOOLS.update_attribute(this, 0)" class="attribute-area" id="'+k+'">'+title+'</div>';
				}
			else{
				//number mode
				html += '<table style="width:100%;">';
				html += '<tr>';
				html += '<td style="font-weight:bold;padding-right:3px;">'+title+':</td>';
				html += '<td><input onKeyUp="TOOLS.update_attribute(this);" type="text" id="'+k+'" value="'+TOOLS.action_data().attributes[k]+'" /></td>';
				html += '</tr>';
				html += '</table>';
				html += '<div onclick="TOOLS.update_attribute(this, '+(step)+')" class="attribute-area" id="'+k+'">+</div>';
				html += '<div onclick="TOOLS.update_attribute(this, '+(-step)+')" class="attribute-area" id="'+k+'">-</div>';
				}
			}
		document.getElementById("action_attributes").innerHTML = html;
		}
	this.set_color = function(object){
		COLOUR = rgb2hex_all(object.style.backgroundColor);
		document.getElementById("main_colour").style.backgroundColor = COLOUR;
		document.getElementById("color_hex").value = COLOUR;
		var colours = hex2rgb(COLOUR);
		document.getElementById("rgb_r").value = colours.r;
		document.getElementById("rgb_g").value = colours.g;
		document.getElementById("rgb_b").value = colours.b;
		}
	this.set_color_manual = function(object){
		if(object.value.length == 7){
			COLOUR = object.value;
			this.sync_colors();
			}
		else if(object.value.length > 7)
			object.value = COLOUR;
		}
	this.set_color_rgb = function(object, c){
		var colours = hex2rgb(COLOUR);
		if(object.value.length > 3){
			object.value = colours[c];
			}
		else if(object.value.length > 0){
			value = object.value;
			value = parseInt(value);
			if(isNaN(value) || value != object.value || value > 255 || value < 0){
				object.value = colours[c];
				return false;
				}
			COLOUR = "#" + ("000000" + rgbToHex(document.getElementById("rgb_r").value, document.getElementById("rgb_g").value, document.getElementById("rgb_b").value)).slice(-6);
			this.sync_colors();
			}
		}
	this.sync_colors = function(){
		document.getElementById("color_hex").value = COLOUR;
		document.getElementById("main_colour").style.backgroundColor = COLOUR;
		var colours = hex2rgb(COLOUR);
		document.getElementById("rgb_r").value = colours.r;
		document.getElementById("rgb_g").value = colours.g;
		document.getElementById("rgb_b").value = colours.b;
		}
	this.toggle_color_select = function(){
		if(POP.active == false){
			POP.add({title: 'Colour:', function: function(){
				return '<canvas style="position:relative;" id="c_all" width="175" height="187"></canvas>';
				},});
			POP.show('Select colour', function(user_response){
				var param1 = parseInt(user_response.param1);
				}, undefined, this.toggle_color_select_onload);
			}
		else
			POP.hide();
		}
	this.toggle_color_select_onload = function(){
		var img = new Image();
		img.onload = function(){
			document.getElementById("c_all").getContext("2d").drawImage(img, 0, 0);
			document.getElementById("c_all").onmousedown = function(event){
				if(event.offsetX) {
					mouse_x = event.offsetX;
					mouse_y = event.offsetY;
					}
				else if(event.layerX) {
					mouse_x = event.layerX;
					mouse_y = event.layerY;
					}
				var c = document.getElementById("c_all").getContext("2d").getImageData(mouse_x, mouse_y, 1, 1).data;
				COLOUR = "#" + ("000000" + rgbToHex(c[0], c[1], c[2])).slice(-6);
				TOOLS.sync_colors();
				};
			}
		img.src = 'img/colors.png';
		}
	}
