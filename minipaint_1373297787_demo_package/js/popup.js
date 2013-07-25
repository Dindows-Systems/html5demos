/*
Usage:
var POP = new popup();
POP.add({name: "param1",	title: "Value1:",	values: ["PNG", "JPG"],	});	
POP.add({name: "param2",	title: "Value2:",	value: 92, range: [0, 100]	});
POP.add({title: 'title:', function: 'custom_function'});

POP.show('title', handler, 'preview_handler', 'onload_handler');
*/
	
function popup(WIDTH, HEIGHT){
	this.active = false;
	this.handler = '';
	this.preview = false;
	this.onload = false;
	
	var WIDTH = WIDTH;
	var HEIGHT = HEIGHT;
	var parameters = [];
	var width_mini = 195;
	var height_mini = Math.round(width_mini * HEIGHT / WIDTH);
	var tempCanvas = document.createElement("canvas");
	var tempCtx = tempCanvas.getContext("2d");
	
	this.add = function(object){
		if(this.active == true){
			parameters = [];
			this.active = false;
			}
		parameters.push(object);
		}
	this.show = function(title, handler, preview_handler, onload_handler){
		this.active = true;
		this.handler = handler;
		if(preview_handler != undefined)
			this.preview = preview_handler;
		if(onload_handler != undefined)
			this.onload = onload_handler;
		var html = '';
		var can_be_canceled = false;
		
		html += '<h2>'+title+'</h2>';
		html += '<table style="width:99%;">';
		for(var i in parameters){
			var parameter = parameters[i];
			html += '<tr>';
			html += '<td style="font-weight:bold;padding-right:3px;">'+parameter.title+'</td>';
			if(parameter.name != undefined){
				can_be_canceled = true;
				if(parameter.value != undefined){
					var colspan = 1;
					if(parameter.range != undefined)
						colspan = 2;
					html += '<td colspan="'+colspan+'"><input style="width:100%;" type="text" id="pop_data_'+parameter.name+'" value="'+parameter.value+'" onkeyup="POP.validate(this);" /></td>';
					if(parameter.range != undefined)
						html += '<td style="padding-left:10px;">'+parameter.range[0]+' - '+parameter.range[1]+'</td>';
					}
				else if(parameter.values != undefined){
					html += '<td colspan="2"><select id="pop_data_'+parameter.name+'">';
					for(var j in parameter.values)
						html += '<option name="'+parameter.values[j]+'">'+parameter.values[j]+'</option>';
					html += '</select></td>';
					}
				}
			else if(parameter.function != undefined){
				if(typeof parameter.function == 'string')
					var result = window[parameter.function]();
				else
					var result = parameter.function();
				html += '<td colspan="3">'+result+'</td>';
				}
			else	
				//locked fields
				html += '<td colspan="2"><input style="width:100%;color:#393939;padding-left:5px;" disabled="disabled" type="text" id="pop_data_'+parameter.name+'" value="'+parameter.value+'" /></td>';
			html += '</tr>';
			}
		html += '</table>';
		if(this.preview !== false){
			html += '<div style="margin-top:15px;">';
			html += '<canvas style="position:relative;float:left;margin-right:5px;border:1px solid #393939;" width="'+width_mini+'" height="'+height_mini+'" id="pop_pre"></canvas>';
			html += '<canvas style="position:relative;border:1px solid #393939;" width="'+width_mini+'" height="'+height_mini+'" id="pop_post"></canvas>';
			html += '</div>';
			}
		html += '<div style="text-align:center;margin-top:20px;">';
		html += '<input type="button" onclick="POP.save();" class="button" value="OK" />';
		if(can_be_canceled==true)
			html += '<input type="button" onclick="POP.hide();" class="button" value="Cancel" />';
		if(this.preview !== false)
			html += '<input type="button" onclick="POP.view();" class="button" value="Preview" />';	
		html += '</div>';
			
		document.getElementById("popup").innerHTML = html;
		document.getElementById("popup").style.display="block";
		
		//onload
		if(this.onload != ''){
			if(typeof this.onload == "string")
				window[this.onload]();
			else
				this.onload();
			}
		
		//load preview?
		if(this.preview !== false){
			//original
			var pop_pre = document.getElementById("pop_pre").getContext("2d");
			pop_pre.rect(0, 0, WIDTH, HEIGHT);
			pop_pre.fillStyle = "#ffffff";
			pop_pre.fill();
			draw_background(pop_pre, 5, true);
			pop_pre.drawImage(document.getElementById(LAYERS[layer_active].name), 0, 0, width_mini, height_mini);
			
			//copy
			pop_post = document.getElementById("pop_post").getContext("2d");
			pop_post.rect(0, 0, width_mini, height_mini);
			pop_post.fillStyle = "#ffffff";
			pop_post.fill();
			draw_background(pop_post, 5, true);
			pop_post.drawImage(document.getElementById(LAYERS[layer_active].name), 0, 0, width_mini, height_mini);
			
			//prepare temp canvas
			tempCanvas.width = width_mini;
			tempCanvas.height = height_mini;
			}
		}
	this.hide = function(){
		document.getElementById('popup').style.display='none';
		parameters = [];
		this.handler = '';
		this.active = false;
		this.preview = false;
		this.onload = false;
		}
	this.view = function(){
		if(this.preview !== false){
			//create mini view
			tempCtx.clearRect(0, 0, width_mini, height_mini);
			tempCtx.drawImage(document.getElementById(LAYERS[layer_active].name), 0, 0, width_mini, height_mini);
			
			//add effect
			var response={};
			inputs = document.getElementsByTagName('input');
			for (i = 0; i<inputs.length; i++) {	
				if(inputs[i].id.substr(0,9)=='pop_data_'){
					var key = inputs[i].id.substr(9);
					var value = inputs[i].value;
					response[key] = value;
					}
				}
			selects = document.getElementsByTagName('select');
			for (i = 0; i<selects.length; i++) {
				if(selects[i].id.substr(0,9)=='pop_data_'){
					var key = selects[i].id.substr(9);
					var value = selects[i].value;
					response[key] = value;
					}
				}
			this.preview(response, tempCtx, width_mini, height_mini);
			
			//show it
			var pop_post = document.getElementById("pop_post").getContext("2d");
			pop_post.rect(0, 0, width_mini, height_mini);
			pop_post.fillStyle = "#ffffff";
			pop_post.fill();
			draw_background(pop_post, 5, true);
			pop_post.drawImage(tempCanvas, 0, 0, width_mini, height_mini);
			}
		}
	this.save = function(){
		this.active = false;
		document.getElementById("popup").style.display="none";
		var response={};
		inputs = document.getElementsByTagName('input');
		for (i = 0; i<inputs.length; i++) {	
			if(inputs[i].id.substr(0,9)=='pop_data_'){
				var key = inputs[i].id.substr(9);
				var value = inputs[i].value;
				response[key] = value;
				}
			}
		selects = document.getElementsByTagName('select');
		for (i = 0; i<selects.length; i++) {
			if(selects[i].id.substr(0,9)=='pop_data_'){
				var key = selects[i].id.substr(9);
				var value = selects[i].value;
				response[key] = value;
				}
			}
		parameters = [];
		this.preview = false;
		this.onload = false;
		if(this.handler != ''){
			if(typeof this.handler == "string")
				window[this.handler](response);
			else
				this.handler(response);
			}
		this.handler = '';
		}
	this.validate = function(field){
		for(var i in parameters){
			var parameter = parameters[i];
			if("pop_data_"+parameter.name == field.id && parameter.range != undefined){
				if(field.value == '-' || field.value == '') return true;
				
				var value = parseFloat(field.value);
				if(isNaN(value) || value != field.value)
					field.value = parameter.value;	//not number
				if(value < parameter.range[0])
					field.value = parameter.range[0];	//less then min
				else if(value > parameter.range[1])
					field.value = parameter.range[1];	//more then max
				}
			}
		}
	}
