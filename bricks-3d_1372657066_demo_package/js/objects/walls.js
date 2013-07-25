/**
 * Walls
 */
console.log(renderer);
function initWalls() {
	drawWalls();
}

function drawWalls() {
	var width							= 7.2,
		height							= 4,
		breadth							= 2,
		startPosX						= 0,
		startPosY						= 1;

	objects['walls']					= {type: "walls", objects: []};

	var wallsObj						= new Walls(startPosX, startPosY, width, height, breadth);
	wallsObj.draw();
	objects['walls'].objects.push(wallsObj);
}

function Walls(startPosX, startPosY, width, height, breadth) {
	this.leftWall						= startPosX - width / 2;
	this.rightWall						= startPosX + width / 2;
	this.topWall						= startPosY + height / 2;
	this.bottomWall						= startPosY - height / 2;

//	console.log(this.leftWall + " : " + this.rightWall + " : " + this.topWall);

	this.draw = function() {
		this.geometry					= new THREE.CubeGeometry(width, height, breadth);
		this.material					= new THREE.MeshLambertMaterial({color: 0x449911, side: THREE.BackSide});
		this.mesh						= new THREE.Mesh(this.geometry, this.material);
		this.mesh.position.set(startPosX, startPosY, 0);
		scene.add(this.mesh);
	}
}