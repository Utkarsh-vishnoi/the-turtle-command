(function(n) {
	if (n != null) {
		var n = parseInt(n);
		var canvas = document.getElementById('screen');
		var main = [];
		var point = function (x, y, type) {
			return {
				x: x,
				y: y,
				type: type,
				canvasX: 0,
				canvasY: 0
			}
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
		if (canvas.getContext) {
			// Canvas is supported.
			var context = canvas.getContext("2d");
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
		}
		else {
			// Canvas is not supported.
			alert("Ah! snap!");
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
	}
})(prompt("Please enter the size of the grid", 8));