const planet_size = 200;

let seed = new Date().getTime() / 1000;
seed = 1594225083;

let canvas = null;
let planet_gen = null;

function setup() {
	let display_size = planet_size * 4;
	canvas = createCanvas(display_size, display_size);

	randomSeed(seed);
	
	planet_gen = new PlanetGen(display_size);
	background(75);
}

function keyPressed() {
	if (keyCode === ENTER) {
		generate();
	}
	else if (keyCode === ESCAPE) {
		console.log("Stopping!");
		noLoop();
	}
	else if (keyCode === 80) {
		saveCanvas(canvas, "planet-" + planet_size + "-" + seed, "png");
	}
}

function draw() {
	update();
	
	if (planet_gen) {
		planet_gen.draw();
	}
}

const update = () => {
	if (planet_gen) {
		planet_gen.update();
	}
	//console.log("Updating!");
}

const generate = () => {
	console.log("Starting!");
	loop();
	background(75);
	planet_gen.build();
	
	console.log("Stopping!");
	noLoop();
}