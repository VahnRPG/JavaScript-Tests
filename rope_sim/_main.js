let canvas = null;
let gravity = 1.5;
const numIterations = 20;
let vec_down = null;
let old_mouse_pos = null;

let points = [];
let sticks = [];

function setup() {
	function getIndex(x, y) {
		return y * numPoints.x + x;
	}
	
	vec_down = createVector(0, 1);
	
	const numPoints = createVector(16, 8);
	for(let y=0; y < numPoints.y; y++) {
		for(let x=0; x < numPoints.x; x++) {
			let locked = y == 0 && x % 5 == 0;
			let position = createVector(x * 50 + 15, y * 50 + 15);
			points.push(new Point(position, locked, 15));
		}
	}
	
	for(let y=0; y < numPoints.y; y++) {
		for(let x=0; x < numPoints.x; x++) {
			if (x < numPoints.x - 1) {
				sticks.push(new Stick(points[getIndex(x, y)], points[getIndex(x + 1, y)]));
			}
			if (y < numPoints.y - 1) {
				sticks.push(new Stick(points[getIndex(x, y)], points[getIndex(x, y + 1)]));
			}
		}
	}
	
	canvas = createCanvas(800, 800);
	background(75);
	frameRate(30);
}

function keyPressed() {
	if (keyCode === ENTER) {
		//generate();
	}
	else if (keyCode === ESCAPE) {
		console.log("Stopping!");
		noLoop();
	}
	else if (keyCode === 80) {
		saveCanvas(canvas, "rope-" + planet_size + "-" + seed, "png");
	}
}

function mousePressed() {
	old_mouse_pos = createVector(mouseX, mouseY);
}

function mouseDragged() {
	const mouse_pos = createVector(mouseX, mouseY);
	
	cutStick(old_mouse_pos, mouse_pos);
	
	old_mouse_pos = mouse_pos;
}

function update() {
	const delta = (deltaTime / 50);
	
	for (point of points) {
		if (point.dead || point.locked) {
			continue;
		}
		
		const positionBeforeUpdate = point.position.copy();
		point.position.add(p5.Vector.sub(point.position, point.prevPosition));
		point.position.add(p5.Vector.mult(vec_down, gravity * delta * delta));
		point.prevPosition = positionBeforeUpdate.copy();
		
		if (point.position.y > height * 2.0) {
			point.dead = true;
		}
	}
	
	for (let i=0; i<numIterations; i++) {
		for (stick of sticks) {
			if (stick.dead) {
				continue;
			}
			
			//console.log("Here: ", stick);
			const stickCenter = p5.Vector.div(p5.Vector.add(stick.pointA.position, stick.pointB.position), 2);
			const stickDir = p5.Vector.sub(stick.pointA.position, stick.pointB.position).normalize();
			const length = p5.Vector.sub(stick.pointA.position, stick.pointB.position).mag();
			
			if (length > stick.length) {
				if (!stick.pointA.locked) {
					stick.pointA.position = p5.Vector.add(stickCenter, p5.Vector.mult(stickDir, stick.length / 2));
				}
				if (!stick.pointB.locked) {
					stick.pointB.position = p5.Vector.sub(stickCenter, p5.Vector.mult(stickDir, stick.length / 2));
				}
			}
		}
	}
}

function draw() {
	update();
	
	background(75);
	for (point of points) {
		point.draw();
	}
	
	for (stick of sticks) {
		stick.draw();
	}
}

function cutStick(start, end) {
	for (let i = sticks.length - 1; i >= 0; i--) {
		if (LineSegmentsIntersect(start, end, sticks[i].pointA.position, sticks[i].pointB.position)) {
			sticks[i].dead = true;
		}
	}
}

function LineSegmentsIntersect(a1, a2, b1, b2) {
	const d = (b2.x - b1.x) * (a1.y - a2.y) - (a1.x - a2.x) * (b2.y - b1.y);
	if (d == 0) {
		return false;
	}
	const t = ((b1.y - b2.y) * (a1.x - b1.x) + (b2.x - b1.x) * (a1.y - b1.y)) / d;
	const u = ((a1.y - a2.y) * (a1.x - b1.x) + (a2.x - a1.x) * (a1.y - b1.y)) / d;

	return t >= 0 && t <= 1 && u >= 0 && u <= 1;
}