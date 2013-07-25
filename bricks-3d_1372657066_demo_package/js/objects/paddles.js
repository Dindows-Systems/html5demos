/**
 * Paddles
 */

function initPaddles() {
	drawPaddles();
}

function drawPaddles() {
	var width							= 0.6,
		height							= 0.05,
		breadth							= 0.2,
		startPosX						= -1,
		startPosY						= -0.25,
//		color							= 0xffaa55;
//		color							= 0xcccccc;
		color							= 0xFF9F80;

	objects['paddles']					= {type: "paddles", objects: []};

	var paddleObj						= new Paddle(startPosX, startPosY, width, height, breadth, color);
	paddleObj.draw();
	objects['paddles'].objects.push(paddleObj);
}

function Paddle(startPosX, startPosY, width, height, breadth, color) {
	this.width							= width;
	this.height							= height;
	this.breadth						= breadth;
	this.color							= color;

	this.draw = function() {
		this.geometry					= new THREE.CubeGeometry(this.width, this.height, this.breadth);
		this.baseMaterial				= new THREE.MeshLambertMaterial({color: this.color});
		this.wireframeMaterial			= new THREE.MeshBasicMaterial({color: 0x000000, wireframe: true, transparent: true});
		this.multiMaterial				= [this.baseMaterial, this.wireframeMaterial];
		this.mesh						= THREE.SceneUtils.createMultiMaterialObject(this.geometry, this.multiMaterial);
//		this.material					= new THREE.MeshPhongMaterial({color: this.color});
//		this.mesh						= new THREE.Mesh(this.geometry, this.material);
		this.mesh.position.set(startPosX, startPosY, 0);
		scene.add(this.mesh);
	}

	this.update = function() {
		this.move();
	}

	this.move = function() {
		// Move with mouse
		if (mouse.x && mouse.y) {
			this.mesh.position.x		= mouse.x;
		}
	}
}