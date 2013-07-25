function draw_grid(canvas, gap_x, gap_y){;
	if(grid == false){
		canvas.clearRect(0, 0, WIDTH, HEIGHT);
		draw_background(canvas);
		return false;
		}
	gap_x = parseInt(gap_x);
	gap_y = parseInt(gap_y);
	if(gap_x<2) gap_x=2;
	if(gap_y<2) gap_y=2;
	for(var i=gap_x; i<WIDTH; i=i+gap_x){
		if(gap_x==0) break;
		if(i%(gap_x*5) == 0)	//main lines
			canvas.strokeStyle = '#808080';
		else
			canvas.strokeStyle = '#dddddd';	
		canvas.beginPath();
		canvas.moveTo(0.5 + i, 0);
		canvas.lineTo(0.5 + i, HEIGHT);
		canvas.stroke();
		}
	for(var i=gap_y; i<HEIGHT; i=i+gap_y){
		if(gap_y==0) break;
		if(i%(gap_y*5) == 0)	//main lines
			canvas.strokeStyle = '#808080';
		else
			canvas.strokeStyle = '#dddddd';
		canvas.beginPath();
		canvas.moveTo(0, 0.5 + i);
		canvas.lineTo(WIDTH, 0.5 + i);
		canvas.stroke();
		}
	}
function draw_background(canvas, gap, force){
	if(TRANSPARENCY == false && force == undefined){
		canvas.beginPath();
		canvas.rect(0, 0, WIDTH, HEIGHT);
		canvas.fillStyle = "#ffffff";
		canvas.fill();
		return false;
		}
	if(gap == undefined)
		gap = 10;
	var fill = true;
	for(var i=0; i<WIDTH; i=i+gap){		
		if(i%(gap*2) == 0)
			fill=true;
		else
			fill=false;
		for(var j=0; j<HEIGHT; j=j+gap){
			if(fill==true){
				canvas.fillStyle = '#eeeeee';
				canvas.fillRect(i, j, gap, gap);
				fill = false;
				}
			else
				fill = true;				
			}
		}
	}
//credits to Victor Haydin
function toolFiller(context, W, H, x, y, color_to, sensitivity){
	var img = context.getImageData(0, 0, W, H);
	var imgData = img.data;
	var k = ((y * (img.width * 4)) + (x * 4));
	var dx = [ 0, -1, +1,  0];
	var dy = [-1,  0,  0, +1];
	var color_from = {
		r: imgData[k+0],
		g: imgData[k+1],
		b: imgData[k+2],
		a: imgData[k+3],
		}
	if(color_from.r == color_to.r && 
	  color_from.g == color_to.g && 
	  color_from.b == color_to.b && 
	  color_from.a == color_to.a) 
		return false;
	var stack = [];
	stack.push(x);
	stack.push(y);
	while (stack.length > 0){
		var curPointY = stack.pop();
		var curPointX = stack.pop();
		for (var i = 0; i < 4; i++){
			var nextPointX = curPointX + dx[i];
			var nextPointY = curPointY + dy[i];
			if (nextPointX < 0 || nextPointY < 0 || nextPointX >= W || nextPointY >= H) 
				continue;
			var k = (nextPointY * W + nextPointX) * 4;
			//check
			if(Math.abs(imgData[k+0] - color_from.r) <= sensitivity &&
			  Math.abs(imgData[k+1] - color_from.g) <= sensitivity &&
			  Math.abs(imgData[k+2] - color_from.b) <= sensitivity &&
			  Math.abs(imgData[k+3] - color_from.a) <= sensitivity){
				//fill pixel
				imgData[k+0] = color_to.r; //r
				imgData[k+1] = color_to.g; //g
				imgData[k+2] = color_to.b; //b
				imgData[k+3] = color_to.a; //a
				
				stack.push(nextPointX);
				stack.push(nextPointY);
				}
			}
		}
	context.putImageData(img, 0, 0);
	}
function tool_magic_wand(context, W, H, x, y, sensitivity){
	var img = context.getImageData(0, 0, W, H);
	var imgData = img.data;
	var k = ((y * (img.width * 4)) + (x * 4));
	var dx = [ 0, -1, +1,  0];
	var dy = [-1,  0,  0, +1];
	var color_to = {
		r: 255,
		g: 255,
		b: 255,
		a: 0,
		}
	var color_from = {
		r: imgData[k+0],
		g: imgData[k+1],
		b: imgData[k+2],
		a: imgData[k+3],
		}
	if(color_from.r == color_to.r && 
	  color_from.g == color_to.g && 
	  color_from.b == color_to.b && 
	  color_from.a == color_to.a) 
		return false;
	var stack = [];
	stack.push(x);
	stack.push(y);
	while (stack.length > 0){
		var curPointY = stack.pop();
		var curPointX = stack.pop();
		for (var i = 0; i < 4; i++){
			var nextPointX = curPointX + dx[i];
			var nextPointY = curPointY + dy[i];
			if (nextPointX < 0 || nextPointY < 0 || nextPointX >= W || nextPointY >= H) 
				continue;
			var k = (nextPointY * W + nextPointX) * 4;
			//check
			if(Math.abs(imgData[k+0] - color_from.r) <= sensitivity &&
			  Math.abs(imgData[k+1] - color_from.g) <= sensitivity &&
			  Math.abs(imgData[k+2] - color_from.b) <= sensitivity &&
			  Math.abs(imgData[k+3] - color_from.a) <= sensitivity){
				//fill pixel
				imgData[k+0] = color_to.r; //r
				imgData[k+1] = color_to.g; //g
				imgData[k+2] = color_to.b; //b
				imgData[k+3] = color_to.a; //a
				
				stack.push(nextPointX);
				stack.push(nextPointY);
				}
			}
		}
	context.putImageData(img, 0, 0);
	}
function trim(layer){
	var all_top = HEIGHT;
	var all_left = WIDTH;
	var all_bottom = HEIGHT;
	var all_right = WIDTH;
	for(var i in LAYERS){
		if(layer != undefined && LAYERS[i].name != layer) continue;	
		
		var top = 0;
		var left = 0;
		var bottom = 0;
		var right = 0;
		var img = document.getElementById(LAYERS[i].name).getContext("2d").getImageData(0, 0, WIDTH, HEIGHT);
		var imgData = img.data;
		//check top
		main1:
		for(var y = 0; y < img.height; y++){
			for(var x = 0; x < img.width; x++){
				var k = ((y * (img.width * 4)) + (x * 4));
				if(imgData[k+3]>0 && (imgData[k]<255 || imgData[k+1]<255 || imgData[k+2]<255) )
					break main1;
				}
			top++;
			}
		//check left
		main2:
	      	for(var x = 0; x < img.width; x++){
			for(var y = 0; y < img.height; y++){
				var k = ((y * (img.width * 4)) + (x * 4));
				if(imgData[k+3]>0 && (imgData[k]<255 || imgData[k+1]<255 || imgData[k+2]<255) )
					break main2;
				}
			left++;
			}
		//check bottom
		main3:
		for(var y = img.height-1; y >= 0; y--){
			for(var x = img.width-1; x >= 0; x--){
				var k = ((y * (img.width * 4)) + (x * 4));
				if(imgData[k+3]>0 && (imgData[k]<255 || imgData[k+1]<255 || imgData[k+2]<255) )
					break main3;
				}
			bottom++;
			}
		//check right
		main4:
		for(var x = img.width-1; x >= 0; x--){
			for(var y = img.height-1; y >= 0; y--){
				var k = ((y * (img.width * 4)) + (x * 4));
				if(imgData[k+3]>0 && (imgData[k]<255 || imgData[k+1]<255 || imgData[k+2]<255) )
					break main4;
				}
			right++;
			}
		all_top = Math.min(all_top, top);
		all_left = Math.min(all_left, left);
		all_bottom = Math.min(all_bottom, bottom);
		all_right = Math.min(all_right, right);
		}
	//resize
	for(var i in LAYERS){
		if(layer != undefined && LAYERS[i].name != layer) continue;	
		
		tmp_data = document.getElementById(LAYERS[i].name).getContext("2d").getImageData(0, 0, WIDTH, HEIGHT);
		document.getElementById(LAYERS[i].name).getContext("2d").clearRect(0, 0, WIDTH, HEIGHT);
		document.getElementById(LAYERS[i].name).getContext("2d").putImageData(tmp_data, -all_left, -all_top);
		var canvas_name = LAYERS[i].name;
		}
	if(layer != undefined){
		var W = round(WIDTH - all_left - all_right);
		var H = round(HEIGHT - all_top - all_bottom);
		
		var imageData = document.getElementById(layer).getContext("2d").getImageData(0, 0, W, H);
		document.getElementById(layer).width = W;
		document.getElementById(layer).height = H;
		document.getElementById(layer).getContext("2d").clearRect(0, 0, W, H);
		document.getElementById(layer).getContext("2d").putImageData(imageData, 0, 0);
		
		return {
			top: all_top,
			left: all_left,
			bottom: all_bottom,
			right: all_right,
			};
		}
	else{
		WIDTH = WIDTH - all_left - all_right;
		HEIGHT = HEIGHT - all_top - all_bottom;
		if(WIDTH<1) WIDTH = 1;
		if(HEIGHT<1) HEIGHT = 1;
		RATIO = WIDTH/HEIGHT;
		LAYER.set_canvas_size();
		}
	}
function effect_bw(context, W, H){
	var threshold = 200;
	var img = context.getImageData(0, 0, W, H);
	var imgData = img.data;
        for(var i = 0; i < imgData.length; i += 4) {
		var c = imgData[i] > threshold ? 255 : 0;
		imgData[i] = c;
		imgData[i+1] = c;
		imgData[i+2] = c;
		}	
	context.putImageData(img, 0, 0);
	}
//returns a function that calculates lanczos weight
function lanczosCreate(lobes){
	return function(x){
		if (x > lobes) 
		return 0;
			x *= Math.PI;
		if (Math.abs(x) < 1e-16) 
			return 1
		var xx = x / lobes;
		return Math.sin(x) * Math.sin(xx) / x / xx;
		}
	}
//elem: canvas element, img: image element, sx: scaled width, lobes: kernel radius
function thumbnailer(elem, sx, lobes){
	var img = elem.getContext("2d").getImageData(0, 0, elem.width, elem.height);
	this.canvas = elem;	
	this.ctx = elem.getContext("2d");
	this.ctx.putImageData(img, 0, 0);
	this.img = img;
	this.src = this.ctx.getImageData(0, 0, img.width, img.height);
	this.dest = {
		width: sx,
		height: Math.round(img.height * sx / img.width),		
		};
	this.dest.data = new Array(this.dest.width * this.dest.height * 3);
	this.lanczos = lanczosCreate(lobes);
	this.ratio = img.width / sx;
	this.rcp_ratio = 2 / this.ratio;
	this.range2 = Math.ceil(this.ratio * lobes / 2);
	this.cacheLanc = {};
	this.center = {};
	this.icenter = {};
	this.date = Date.now();		
	//setTimeout(this.process1, 0, this, 0);	//setTimeout is slow
	this.process1(this, 0);
	}
thumbnailer.prototype.process1 = function(self, u){
	//continue	
	self.center.x = (u + 0.5) * self.ratio;
	self.icenter.x = Math.floor(self.center.x);
	for (var v = 0; v < self.dest.height; v++) {
		self.center.y = (v + 0.5) * self.ratio;
		self.icenter.y = Math.floor(self.center.y);
		var a, r, g, b, x;
		a = r = g = b = x = 0;
		for (var i = self.icenter.x - self.range2; i <= self.icenter.x + self.range2; i++) {
			if (i < 0 || i >= self.src.width) 
				continue;
			var f_x = Math.floor(1000 * Math.abs(i - self.center.x));
			if (!self.cacheLanc[f_x]) 
				self.cacheLanc[f_x] = {};
			for (var j = self.icenter.y - self.range2; j <= self.icenter.y + self.range2; j++) {
				if (j < 0 || j >= self.src.height) 
					continue;
				var f_y = Math.floor(1000 * Math.abs(j - self.center.y));
				if (self.cacheLanc[f_x][f_y] == undefined) 
					self.cacheLanc[f_x][f_y] = self.lanczos(Math.sqrt(Math.pow(f_x * self.rcp_ratio, 2) + Math.pow(f_y * self.rcp_ratio, 2)) / 1000);
				weight = self.cacheLanc[f_x][f_y];
				if (weight > 0) {
					var idx = (j * self.src.width + i) * 4;
					a += weight;
					r += weight * self.src.data[idx];
					g += weight * self.src.data[idx + 1];
					b += weight * self.src.data[idx + 2];
					x += weight * self.src.data[idx + 3]; //transparency
					}
				}
			}
		var idx = (v * self.dest.width + u) * 4;
		self.dest.data[idx] = r / a;
		self.dest.data[idx + 1] = g / a;
		self.dest.data[idx + 2] = b / a;
		self.dest.data[idx + 3] = x / a ; //transparency
		}
	if (++u < self.dest.width){
		//setTimeout(self.process1, 0, self, u);		//setTimeout is slow
		this.process1(self, u);
		}
	else 
		setTimeout(self.process2, 0, self);
	};
thumbnailer.prototype.process2 = function(self){
	self.ctx.putImageData(self.img, 0, 0);
	self.src = self.ctx.getImageData(0, 0, self.dest.width, self.dest.height);
	var idx, idx2;
	for (var i = 0; i < self.dest.width; i++) {
		for (var j = 0; j < self.dest.height; j++) {
			idx = (j * self.dest.width + i) * 4;
			idx2 = (j * self.dest.width + i) * 4;
			self.src.data[idx2] = self.dest.data[idx];
			self.src.data[idx2 + 1] = self.dest.data[idx + 1];
			self.src.data[idx2 + 2] = self.dest.data[idx + 2];
			self.src.data[idx2 + 3] = self.dest.data[idx + 3];	//transparency
			}
		}
	//var time = Date.now() - self.date;alert(time/1000+"s");
	self.ctx.clearRect(0, 0, WIDTH, HEIGHT);
	self.ctx.putImageData(self.src, 0, 0);
	
	LAYER.resize_canvas(LAYERS[layer_active].name, true);
	zoom();
	if(POP.active == true)
		POP.hide();
	}
function zoom(recalc, scroll){
	if(recalc != undefined){
		var step = 100;
		if(ZOOM <= 100 && recalc < 0)
			step = 10;
		if(ZOOM <100 && recalc > 0)
			step = 10;
		if(recalc*step + ZOOM > 0){
			ZOOM = ZOOM + recalc*step;
			if(ZOOM > 100 && ZOOM < 200)
				ZOOM = 100;
			}
		calc_preview_auto();
		}
	document.getElementById("zoom_nr").innerHTML = ZOOM;
	
	//change scale and repaint
	document.getElementById('canvas_back').style.width = round(WIDTH * ZOOM / 100)+"px";
	document.getElementById('canvas_back').style.height = round(HEIGHT * ZOOM / 100)+"px";
	for(var i in LAYERS){
		document.getElementById(LAYERS[i].name).style.width = round(WIDTH * ZOOM / 100)+"px";
		document.getElementById(LAYERS[i].name).style.height = round(HEIGHT * ZOOM / 100)+"px";
		}
	document.getElementById('canvas_front').style.width = round(WIDTH * ZOOM / 100)+"px";
	document.getElementById('canvas_front').style.height = round(HEIGHT * ZOOM / 100)+"px";

	//check main resize corners
	if(ZOOM != 100){
		document.getElementById('resize-w').style.display = "none";
		document.getElementById('resize-h').style.display = "none";
		document.getElementById('resize-wh').style.display = "none";
		}
	else{
		document.getElementById('resize-w').style.display = "block";
		document.getElementById('resize-h').style.display = "block";
		document.getElementById('resize-wh').style.display = "block";
		}
	
	if(scroll != undefined)
		scroll_window();
	redraw_preview();
	}
function redraw_preview(){
	canvas_preview.beginPath();
	canvas_preview.rect(0, 0, PREVIEW_SIZE.w, PREVIEW_SIZE.h);
	canvas_preview.fillStyle = "#ffffff";
	canvas_preview.fill();
	draw_background(canvas_preview, 5);
	
	//redraw preview area
	canvas_preview.save();
	canvas_preview.scale(PREVIEW_SIZE.w/WIDTH, PREVIEW_SIZE.h/HEIGHT);
	for(var i in LAYERS){
		if(LAYERS[i].visible == false) continue;
		canvas_preview.drawImage(document.getElementById(LAYERS[i].name), 0, 0, WIDTH, HEIGHT);
		}
	canvas_preview.restore();
	
	//active zone
	z_x = ZOOM_X;
	z_y = ZOOM_Y;
	if(z_x > PREVIEW_SIZE.w - mini_rect_data.w) 
		z_x = PREVIEW_SIZE.w - mini_rect_data.w;
	if(z_y > PREVIEW_SIZE.h - mini_rect_data.h) 
		z_y = PREVIEW_SIZE.h - mini_rect_data.h;
	
	canvas_preview.beginPath();
	canvas_preview.rect(round(z_x) + 0.5, round(z_y) + 0.5, mini_rect_data.w, mini_rect_data.h);
	canvas_preview.fillStyle = "rgba(0, 0, 0, 0.2)";
	canvas_preview.strokeStyle = "#393939";
	canvas_preview.fill();
	canvas_preview.stroke();
	}
