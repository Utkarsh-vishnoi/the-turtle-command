$(document).ready(function() {
	var canvas = document.getElementById('screen');
	if (!canvas.getContext) {
		logger("Warning: Canvas not supported. Upgrade your browser.");
	}
	var context = canvas.getContext("2d");
	var direction =  'N';
	var radius = 8;
	var main = [];
	var hotspots = [];
	var markedPoint, curPos;
	var directionset = 'NESW';
	$('#movement_left').on("click", function() {
		left();
	});
	$('#movement_top').on("click", function() {
		front();
	});

	function left() {
		logger("Left Turn: ");
		logger("Current Direction: " + direction);
		direction = findLeft(direction);
		logger("New Direction: " + direction, true);
		output();
	}

	function front() {
		logger("Move front: ");
		logger("Current Position: " + (curPos.x + 1) + ',' + (curPos.y + 1));
		switch(direction) {
			case "N":
				if (curPos.x < n - 1) {
					if(!main[curPos.x + 1][curPos.y].obstacle == true)
						markPoint(context, main[curPos.x + 1][curPos.y]);
					else
						logger("Move not possible: Obstacle Ahead.");
				}
				else {
					logger("Move not possible: Reached the end of the Y - Axis.");
				}
				break;

			case "S":
				if (curPos.x - 1 >= 0) {
					if(!main[curPos.x - 1][curPos.y].obstacle == true)
						markPoint(context, main[curPos.x - 1][curPos.y]);
					else
						logger("Move not possible: Obstacle Ahead.");
				}
				else
					logger("Move not possible: Reached the end of the Y - Axis.");
				break;

			case "E":
				if (curPos.y < n - 1) {
					if(!main[curPos.x][curPos.y + 1].obstacle == true)
						markPoint(context, main[curPos.x][curPos.y + 1]);
					else
						logger("Move not possible: Obstacle Ahead.");
				}
				else
					logger("Move not possible: Reached the end of the X - Axis.");
				break;

			case "W":
				if (curPos.y - 1 >= 0) {
					if(!main[curPos.x][curPos.y - 1].obstacle == true)
						markPoint(context, main[curPos.x][curPos.y - 1]);
					else
						logger("Move not possible: Obstacle Ahead.");
				}
				else
					logger("Move not possible: Reached the end of the X - Axis.");
				break;
		}
		logger("New Position: " + (curPos.x + 1) + ',' + (curPos.y + 1), true);
		output();
	}

	function right() {
		logger("Right Turn: ");
		logger("Current Direction: " + direction);
		direction = findRight(direction);
		logger("New Direction: " + direction, true);
		output();
	}

	$('#movement_right').on("click", function() {
		right();
	});
	function output() {
		outputs.innerHTML = (curPos.x + 1) + "," + (curPos.y + 1) + " " + direction;
	}
	function render() {
		n = $('#grid_size').val();
		context.clearRect(0, 0, canvas.width, canvas.height);
		if(n < 3) {
			context.fillStyle = "red";
			context.fillText("Note: Atleast 3 elements must be present in each side of the grid.", 0, 10);
		}
		var point = function (x, y, type) {
			return {
				x: x,
				y: y,
				type: type,
				canvasX: 0,
				canvasY: 0,
				obstacle: false
			};
		};
		var spot = function (x, y) {
			return {
				x: x,
				y: y
			};
		};
		for(var i = 0; i < n; i++) {
			main[i] = [];
			for (var j = 0; j < n; j++) {
				if(i > 0 && i < n-1 && j > 0 && j < n-1) {
					// Inner point
					main[i][j] = point(i, j, "I");
				}
				else {
					// Outer point
					main[i][j] = point(i, j, "O");
				}
			}
		}
		var x = 20;
		var y = canvas.height + 30;
		// Draw circles for grids
		for(var i = 0; i < n; i++) {
			y -= 50;
			x = 20;
			for (var j = 0; j < n; j++) {
				drawCircle(context, x, y);
				main[i][j].canvasX = x;
				main[i][j].canvasY = y;
				hotspots[hotspots.length] = spot(x, y);
				x+=50;
			}
		}
		// Draw lines to connect circles and form grids
		for(var i = 0; i < n; i++) {
			for (var j = 0; j < n; j++) {
				drawLine(context, main[i][j].canvasX, main[i][j].canvasY, main[i][j].type, i, j);
			}
		}
		// Mark the turtle's starting point
		markPoint(context, main[0][0]);

		// Draw random n obstacles
		var obstacles= [{x:0,y:0}];
		for (var i = 0; i < n; i++) {
			var coords = getRandomCoords(0, n - 1);
			var match = searchObstacles(coords, obstacles);
			if (match) {
				i--;
			}
			else
			{
				obstacles[obstacles.length] = coords;
				drawObstacles(context, coords.x, coords.y, main);
			}
		}
		output();
	}

	function searchObstacles(searchKey, obstacleArray) {
		for (var i = 0; i < obstacleArray.length; i++) {
			if(obstacleArray[i].x == searchKey.x && obstacleArray[i].y == searchKey.y)
				return true;
		}
		return false;
	}

	function drawObstacles(context, i, j, main) {
		var x = main[i][j].canvasX;
		var y = main[i][j].canvasY;
		main[i][j].obstacle = true;
		context.beginPath();
		context.moveTo(x, y);
		context.strokeStyle = "green";
		context.fillStyle = "green";
		context.arc(x, y, 6, 0, 2 * Math.PI);
		context.stroke();
		context.fill();
		context.closePath();
	}

	function getRandomCoords(min, max) {
		return {
			x: Math.floor(Math.random() * (max - min + 1)) + min,
			y: Math.floor(Math.random() * (max - min + 1)) + min
		};
	}

	
	var outputs = document.getElementById("output");
	function markPoint(context, mainObj) {
		if(typeof(markedPoint) != "undefined") {
			context.beginPath();
			context.moveTo(markedPoint.canvasX, markedPoint.canvasY);
			context.strokeStyle = "white";
			context.fillStyle = "white";
			context.arc(markedPoint.canvasX, markedPoint.canvasY, 6, 0, 2 * Math.PI);
			context.stroke();
			context.fill();
			context.closePath();
			markedPoint = undefined;
		}
		var x = mainObj.canvasX;
		var y = mainObj.canvasY;
		context.beginPath();
		context.moveTo(x, y);
		context.strokeStyle = "red";
		context.fillStyle = "red";
		context.arc(x, y, 6, 0, 2 * Math.PI);
		context.stroke();
		context.fill();
		context.closePath();
		markedPoint = mainObj;
		curPos = mainObj;
	}

	function drawLine(context, x, y, type, i, j) {
		context.beginPath();
		context.strokeStyle = "blue";
		if (type == "O") {
			if (i == 0 || i == n-1) {
				if (j != n-1) {
					context.moveTo(x+8,y);
					context.lineTo(x+42,y);
				}
			}
			else {
				context.moveTo(x,y-8);
				context.lineTo(x,y-42);
				context.moveTo(x,y+8);
				context.lineTo(x,y+42);
			}
		} else {
			context.moveTo(x+8,y);
			context.lineTo(x+42,y);
			context.moveTo(x-8,y);
			context.lineTo(x-42,y);
			context.moveTo(x,y-8);
			context.lineTo(x,y-42);
			context.moveTo(x,y+8);
			context.lineTo(x,y+42);
		}
		context.stroke();
		context.closePath();
	}

	function drawCircle(context, x, y) {
		context.beginPath();
		context.lineWidth = 2;
		context.strokeStyle = "black";
		context.arc(x, y, radius, 0, 2*Math.PI);
		context.stroke();
		context.closePath();
	}

	render();
	$('#grid_size').on("change", function() {
		render();
		logger("Created new grid of " + $('#grid_size').val() + " X " + $('#grid_size').val(), true);
	});
	
	function findLeft(alpha) {
		var pos = directionset.search(alpha);
		if (pos == 0) 
			return directionset[directionset.length - 1];
		else
			return directionset[pos - 1];
	}
	
	function findRight(alpha) {
		var pos = directionset.search(alpha);
		if (pos == directionset.length - 1) 
			return directionset[0];
		else
			return directionset[pos + 1];
	}

	$("#go").on("click", function() {
		var inputs = $("#input").val().toUpperCase();
		var input = [];
		for (i=0;i<inputs.length;i++) {
			input[input.length] = inputs[i];
		}
		$.each(input, function(index, value) {
			switch(value) {
				case "F": front();
					break;
				case "R": right();
					break;
				case "L": left();
					break;
			}
		});
	});
	$("#reset").on("click", function() {
		markPoint(context, main[0][0]);
		direction = 'N';
		logger("Grid reset successfull.", true);
		output();
	});
	function logger(data, EOL=false) {
		var console = $("#console");
		if (console.length) {
			console.scrollTop(console[0].scrollHeight - console.height());
		}
		console.append(data + (EOL ? '\n': ' '));
	}

	canvas.onmousemove = function(e) {
		// Tell the browser we are handling the event
		e.preventDefault();
		e.stopPropagation();

		var rect = canvas.getBoundingClientRect();

		var mouseX = parseInt(e.clientX - rect.left);
		var mouseY = parseInt(e.clientY - rect.top);

		for (var i = 0; i < hotspots.length; i++) {
			var h = hotspots[i];
			var dx = mouseX - h.x;
			var dy = mouseY - h.y;
			var distance = Math.sqrt(dx * dx + dy * dy);
			if (distance < radius) {
				showTip();
			}
			else{
				hideTip();
			}
		}
	}

	function showTip() {
		// body...
	}

	function hideTip() {
		// body...
	}
});