$(document).ready(function() {
	render();
	$('#grid_size').on("change", function() {
		render();
	});

	var direction =  'N';
	var directionset = 'NESW';
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
	$('#movement_left').on("click", function() {
		direction = findLeft(direction);
	});
	$('#movement_top').on("click", function() {
		
	});
	$('#movement_right').on("click", function() {
		direction = findRight(direction);
		console.log(direction);
	});
});
function render() {
	n = $('#grid_size').val();
	var canvas = document.getElementById('screen');
	if (!canvas.getContext) {
		alert("Oh, snap!");
	}
	var context = canvas.getContext("2d");
	context.clearRect(0, 0, canvas.width, canvas.height);
	if(n < 3) {
		context.fillStyle = "red";
		context.fillText("Note: Atleast 3 elements must be present in each side of the grid.", 0, 10);
	}
	var main = [];
	var point = function (x, y, type) {
		return {
			x: x,
			y: y,
			type: type,
			canvasX: 0,
			canvasY: 0,
			obstacle: true
		};
	};
	for(var i = 0; i < n; i++) {
		main[i] = [];
		for (var j = 0; j < n; j++) {
			if(i > 0 && i < n-1 && j > 0 && j < n-1) {
				// Inner point
				main[i][j] = point(i + 1, j + 1, "I");
			}
			else {
				// Outer point
				main[i][j] = point(i + 1, j + 1, "O");
			}
		}
	}
	var output = document.getElementById("output");
	var x = 10;
	var y = canvas.height + 40;
	// Draw circles for grids
	for(var i = 0; i < n; i++) {
		y -= 50;
		x = 10;
		for (var j = 0; j < n; j++) {
			drawCircle(context, x, y);
			main[i][j].canvasX = x;
			main[i][j].canvasY = y;
			x+=50;
		}
	}
	// Draw lines to connect circles and form grids
	for(var i = 0; i < n; i++) {
		for (var j = 0; j < n; j++) {
			drawLine(context, main[i][j].canvasX, main[i][j].canvasY, main[i][j].type);
		}
	}
	// Mark the turtle's starting point
	markPoint(main[0][0]);

	// Draw random n obstacles
	var obstacles= [];
	for (var i = 0; i < n; i++) {
		var coords = getRandomCoords(1, n - 1);
		var match = searchObstacles(coords, obstacles);
		if (match) {
			i--;
		}
		obstacles[obstacles.length] = coords;
		drawObstacles(context, coords.x, coords.y);
	}

	function drawCircle(context, x, y) {
		context.beginPath();
		var radius = 8;
		context.lineWidth = 2;
		context.strokeStyle = "black";
		context.arc(x, y, radius, 0, 2*Math.PI);
		context.stroke();
		context.closePath();
	}

	function drawLine(context, x, y, type) {
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

	var markedPoint;
	function markPoint(mainObj) {
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
	}

	function getRandomCoords(min, max) {
		return {
			x: Math.floor(Math.random() * (max - min + 1)) + min,
			y: Math.floor(Math.random() * (max - min + 1)) + min
		};
	}

	function drawObstacles(context, i, j) {
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

	function searchObstacles(searchKey, obstacleArray) {
		for (var i = 0; i < obstacleArray.length; i++) {
			if(obstacleArray[i].x == searchKey.x && obstacleArray[i].y == searchKey.y)
				return true;
		}
		return false;
	}
}