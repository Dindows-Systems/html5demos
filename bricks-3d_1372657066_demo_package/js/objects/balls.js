/**
 * Balls
 */

function initBalls() {
	drawBalls();
}

function drawBalls() {
	var radius							= 0.06,
		hSegments						= 16,
		vSegments						= 16,
		startPosX						= 0,
		startPosY						= 0.75;

	objects['balls']					= {type: "balls", objects: []};

	var ballObj							= new Ball(radius, startPosX, startPosY, hSegments, vSegments);
	ballObj.draw();
	objects['balls'].objects.push(ballObj);
}

function Ball(radius, startPosX, startPosY, hSegments, vSegments) {
	this.startPosX						= startPosX;
	this.startPosY						= startPosY;
	this.baseVelX						= 0.01;
	this.baseVelY						= 0.03;
	this.velX							= this.baseVelX;
	this.velY							= this.baseVelY;
	this.radius							= radius;

	this.draw = function() {
		this.geometry					= new THREE.SphereGeometry(this.radius, hSegments, vSegments);
		this.material					= new THREE.MeshPhongMaterial({color: 0xdddddd, specular: 0xffffff, shininess: 200});
		this.mesh						= new THREE.Mesh(this.geometry, this.material);
		this.mesh.position.set(this.startPosX, this.startPosY, 0);
		scene.add(this.mesh);
	}

	this.reset = function() {
		this.mesh.position.set(this.startPosX, this.startPosY, 0);
		this.velX						= this.baseVelX;
		this.velY						= this.baseVelY;
	}

	this.update = function() {
		this.move();
	}

	this.move = function() {
		this.mesh.position.x			+= this.velX;
		this.mesh.position.y			+= this.velY;

		var collisionStatus			= {};

		// Test collision against walls
		collisionStatus					= this.testCollision(objects['walls']);
		if (collisionStatus.x) {
			this.velX					*= -1;
		} if (collisionStatus.y) {
			this.velY					*= -1;
		}

		// Test against padels
		collisionStatus					= this.testCollision(objects['paddles']);
		if (collisionStatus) {
			this.velY					*= -1;
		}

		// Test against bricks
		collisionStatus					= this.testCollision(objects['bricks']);
		switch (collisionStatus) {
			case 'top':
			case 'bottom':
				this.velY				*= -1;
				score++;
				break;

			case 'left':
			case 'right':
				this.velX				*= -1;
				score++;
				break;
		}
	}

	this.testCollision = function(obj) {
		switch (obj.type) {
			// Test against walls
			case "walls":
				var collisionStatus		= {};

				if ((this.mesh.position.x  + this.radius) > obj.objects[0].rightWall
					|| (this.mesh.position.x  - this.radius) < obj.objects[0].leftWall)
				{
					collisionStatus.x	= true;
				}

				if ((this.mesh.position.y + this.radius) > obj.objects[0].topWall) {
					collisionStatus.y	= true;
				}

				if ((this.mesh.position.y  - this.radius) < obj.objects[0].bottomWall) {
					touchedFloor = true;
				}

				return collisionStatus;
				break;

			// Test against paddles
			case "paddles":
				// Check whether the ball is below the paddle (approximate calculation, which is sufficient for the
				// current velocity
				if ((this.mesh.position.y - this.radius) < obj.objects[0].mesh.position.y

					// So that the ball doesn't get in the weird state of collisions when below the paddle but also
					// within its length
					&& this.mesh.position.y > (obj.objects[0].mesh.position.y - 0.1)

					// Check whether the ball is within the length of the paddle
					&& this.mesh.position.x > (obj.objects[0].mesh.position.x - obj.objects[0].width / 2)
					&& this.mesh.position.x < (obj.objects[0].mesh.position.x + obj.objects[0].width / 2))
				{
					var velXChange		= (this.mesh.position.x - obj.objects[0].mesh.position.x) / (obj.objects[0].width / 2);
					this.velX			= this.baseVelX * (velXChange);
					return true;
				}

				break;

			// Test agains bricks
			case "bricks":
				// Save the reference to the current ball object, since 'this' won't refer to it inside the forEach loop
				var ballObj				= this,
					updatedBricks		= [],
					collisionStatus		= {},
					collisionThreshold	= 0.05;
				obj.objects.forEach(function(brick, i){
					// Check collision with the bottom edge of the brick
					if (ballObj.mesh.position.x > brick.posXMin
						&& ballObj.mesh.position.x < brick.posXMax
						&& ballObj.mesh.position.y < brick.posYMin
						&& (ballObj.mesh.position.y + collisionThreshold) > brick.posYMin
						&& ballObj.mesh.position.y < brick.posYMax)
					{
//						collisionStatus.bottomEdge	= true;
						collisionStatus	= "bottom";
						scene.remove(brick.mesh);
					}
					// Check collision with the top edge of the brick
					else if (ballObj.mesh.position.x > brick.posXMin
						&& ballObj.mesh.position.x < brick.posXMax
						&& ballObj.mesh.position.y > brick.posYMin
						&& ballObj.mesh.position.y > brick.posYMax
						&& (ballObj.mesh.position.y - collisionThreshold) < brick.posYMax)
					{
//						collisionStatus.topEdge	= true;
						collisionStatus	= "top";
						scene.remove(brick.mesh);
					}

					// Check collision with the left edge of the brick
					else if (ballObj.mesh.position.y > brick.posYMin
						&& ballObj.mesh.position.y < brick.posYMax
						&& ballObj.mesh.position.x < brick.posXMin
						&& (ballObj.mesh.position.x + collisionThreshold) > brick.posXMin
						&& ballObj.mesh.position.x < brick.posXMax)
					{
//						collisionStatus.leftEdge	= true;
						collisionStatus	= "left";
						scene.remove(brick.mesh);
					}
					// Check collision with the right edge of the brick
					else if (ballObj.mesh.position.y > brick.posYMin
						&& ballObj.mesh.position.y < brick.posYMax
						&& ballObj.mesh.position.x > brick.posXMin
						&& ballObj.mesh.position.x > brick.posXMax
						&& (ballObj.mesh.position.x - collisionThreshold) < brick.posXMax)
					{
//						collisionStatus.rightEdge	= true;
						collisionStatus	= "right";
						scene.remove(brick.mesh);
					}
					// No collision detected - add the current brick to the updated list of bricks to be rendered
					else {
						updatedBricks.push(brick);
					}
				});

				obj.objects				= updatedBricks;
				return collisionStatus;
				break;

			default:
				break;
		}
	}
}