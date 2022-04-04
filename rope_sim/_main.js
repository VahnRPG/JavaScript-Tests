let canvas = null;
let gravity = 1.5;
const numIterations = 20;
let vec_down = null;

let points = [];
let sticks = [];

function setup() {
	vec_down = createVector(0, 1);
	
	let display_size = 200 * 4;
	
	let pointA = new Point(display_size - 50, 50, true);
	let pointB = new Point(display_size / 2, 100, false);
	let pointC = new Point(display_size / 8, 150, false);
	let pointD = new Point(display_size / 4, 150, false);
	let pointE = new Point(display_size - 500, 100, true);
	points.push(pointA);
	points.push(pointB);
	points.push(pointC);
	points.push(pointD);
	points.push(pointE);
	
	let stickA = new Stick(pointA, pointB);
	let stickB = new Stick(pointB, pointC);
	let stickC = new Stick(pointC, pointD);
	let stickD = new Stick(pointD, pointE);
	sticks.push(stickA);
	sticks.push(stickB);
	sticks.push(stickC);
	sticks.push(stickD);
	
	canvas = createCanvas(display_size, display_size);
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

function update() {
	const delta = (deltaTime / 50);
	
	for (point of points) {
		if (!point.locked) {
			const positionBeforeUpdate = point.position.copy();
			point.position.add(p5.Vector.sub(point.position, point.prevPosition));
			point.position.add(p5.Vector.mult(vec_down, gravity * delta * delta));
			point.prevPosition = positionBeforeUpdate.copy();
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

const generate = () => {
	console.log("Starting!");
	loop();
	background(75);
	
	console.log("Stopping!");
	noLoop();
}