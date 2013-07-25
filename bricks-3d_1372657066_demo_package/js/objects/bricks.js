/**
 * Bricks
 */

function initBricks() {
	var bricks = [];

	// Use 'for' loop if performance is poor
	levels[currLevel].levelDesign.forEach(function (row, i) {
		if (row != "") {
			bricks.push(tokenise(row));
		} else {
			bricks.push("");
		}
	});

	drawBricks(bricks);
}

/* This utility function will send back a row in the following format:
 row = [
 ['', 1],
 ['a',3],	// format: 'brick type', length
 ...
 ];
 */
function tokenise(str) {
	var row = [],
		currBrickLen = 1;
	for (i = 0, len = str.length; i < len; i++) {
		if (str[i] == str[i + 1]) {
			currBrickLen++;

		} else {
			currBrickType = str[i];
			var brick = [currBrickType, currBrickLen];
			row.push(brick);
			currBrickLen = 1;
		}
	}
	return row;
}

function drawBricks(bricks) {
	var startTop						= 2.7,
		startLeft						= -3.5,

		gridWidth						= 0.22,
		gridHeight						= 0.15,
		gridBreadth						= 0.2,

		gridPaddingX					= 0.05,		// not needed right now as edge-face rendering is segregating bricks nicely
		gridPaddingY					= 0.01,		// not needed right now as edge-face rendering is segregating bricks nicely

	// to compensate for the fact that the grid's local axes are center aligned to the grid, instead of left and top
		offsetX							= gridWidth / 2,
		offsetY							= gridHeight / 2,

		totalRows						= bricks.count,
		currRow							= 0;

	objects['bricks']					= {type: "bricks", objects: []};

	bricks.forEach(function(row, i) {

		if (row == "") {
			currRow++;
		} else {
			var localStartLeft			= startLeft,
				posX					= localStartLeft,
				posY					= startTop - (gridHeight * currRow),
				currCol					= 0,
				currBrick				= 0;

			row.forEach(function(brick, j) {
				if (brick[0] != " ") {

					var brickWidth		= (brick[1] * gridWidth),
						brickHeight		= gridHeight,
						brickBreadth	= gridBreadth;

					var offsetX			= brickWidth / 2;
//						posX			= offsetX +  startLeft + (gridWidth * currCol) + (gridPaddingX * currBrick);
					// posX			= posX + offsetX + 0.3;
//						posX			= (posX / 2) + (brickWidth / 2);
					// posX			= posX + brickWidth / 2;
					posX				= localStartLeft + offsetX;

					localStartLeft		= posX + offsetX;

					var brickObj		= new Brick(brick, posX, posY, brickWidth, brickHeight, brickBreadth);
					brickObj.draw();
					objects['bricks'].objects.push(brickObj);

//					currCol				+= brick[1];
//					currBrick++;
				} else {
//					currCol++;

					var blankBrickWidth	= brick[1] * gridWidth;
					var offsetX			= blankBrickWidth / 2;
					posX				= localStartLeft + offsetX
					localStartLeft		= posX + offsetX;
				}
			});
			currRow++;
		}
	});
}

function Brick(brick, posX, posY, brickWidth, brickHeight, brickBreadth) {
	this.type							= brick[0].toLowerCase();
	this.width							= brickWidth;
	this.height							= brickHeight;
	this.breadth						= 0.2;
	this.color							= levels[currLevel].brickTypes[this.type];

	this.posXMin						= posX - this.width / 2;
	this.posXMax						= posX + this.width / 2;
	this.posYMin						= posY - this.height / 2;
	this.posYMax						= posY + this.height / 2;

	this.draw = function () {
		if (this.type != " ") {
			this.geometry				= new THREE.CubeGeometry(this.width, this.height, this.breadth);
			this.baseMaterial			= new THREE.MeshLambertMaterial({color: this.color});
			this.wireframeMaterial		= new THREE.MeshBasicMaterial({color: 0x000000, wireframe: true, transparent: true});
			this.multiMaterial			= [this.baseMaterial, this.wireframeMaterial];
			this.mesh					= THREE.SceneUtils.createMultiMaterialObject(this.geometry, this.multiMaterial);
			this.mesh.position.set(posX, posY, 0);
			scene.add(this.mesh);
		}
	};
}