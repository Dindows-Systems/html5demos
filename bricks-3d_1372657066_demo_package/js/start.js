/**
 * Actions
 */

function start() {
	$('#intro, #overlay').fadeIn(1500);
	gameStates[currentGameState].running = true;

	$('.start .button').on('click', function(e) {
		e.preventDefault();
		$('#intro, #overlay').fadeOut();
		gameStates[currentGameState].running = false;
		currentGameState = gameStates[currentGameState].transitions.play;
		gameStates[currentGameState].running = true;
	});
}

function freeze() {
	$('#paused, #overlay-small').fadeIn(500);
	gameStates[currentGameState].running = true;

	$('.continue .button').on('click', function(e) {
		e.preventDefault();
		$('#paused, #overlay-small').fadeOut();
		gameStates[currentGameState].running = false;
		currentGameState = gameStates[currentGameState].transitions.resume;
		gameStates[currentGameState].running = true;
	});
}

function lose() {
	$('#lose, #overlay').fadeIn(1500);
	gameStates[currentGameState].running = true;
}

function reset() {
	$('#reset, #overlay-small').fadeIn(1500);
	gameStates[currentGameState].running = true;

	$('.reset .button').on('click', function(e) {
		e.preventDefault();
		$('#reset, #overlay-small').fadeOut();
		objects['balls'].objects[0].reset();
		gameStates[currentGameState].running = false;
		currentGameState = gameStates[currentGameState].transitions.restart;
		gameStates[currentGameState].running = true;
	});
}

function update() {
	if (objects['bricks'].objects.length > 0) {
		if (lives > 0) {
			if (!touchedFloor) {
				objects['balls'].objects[0].update();
				objects['paddles'].objects[0].update();
				$('dd.score').html(score);
			} else {
				lives--;
				$('dd.lives').html(lives);
				gameStates[currentGameState].running = false;
				currentGameState = gameStates[currentGameState].transitions.reset;
				touchedFloor = false;
				if (lives == 0) {
					$('#lose').fadeIn();
					$('#overlay-small').fadeIn();
				}
			}
		}
		else {
			gameStates[currentGameState].running = false;
			currentGameState = gameStates[currentGameState].transitions.lose;
			console.log(lives);
		}
	} else {
		$('#win').fadeIn();
	}
	stats.update();
}

// Rendering
function render() {
	renderer.render(scene, camera);
}
