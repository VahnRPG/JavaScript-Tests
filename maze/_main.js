const canvas_width = 1980;
const canvas_height = 1200;
const border_size = 10;
const tile_size = 5;

let tile_width = 0;
let tile_height = 0;
/*
const tile_width = 382;
const tile_height = 238;
//*/
const colorize_start = true;
const distinct_colors = !true;

let seed = 0;
let canvas = null;
let maze = null;

function setup() {
	colorMode(HSB, 360, 100, 100);
	
	canvas = createCanvas(canvas_width, canvas_height);
	
	tile_width = int((canvas_width - border_size) / tile_size);
	//tile_width = 16;
	tile_height = int((canvas_height - border_size) / tile_size);
	//tile_height = 16;
	
	seed = int(new Date().getTime() / 1000);
	//seed = 1594225083;
	
	let color_points = 50;
	color_points = int(random(1, 100));
	maze = new Maze(tile_width, tile_height, seed, color_points, colorize_start, distinct_colors);
	background(0, 0, 75);
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
		saveCanvas(canvas, "maze-" + tile_width + "x" + tile_height + "-" + seed, "png");
	}
}

function draw() {
	update();
	
	if (maze) {
		maze.draw();
	}
}

const update = () => {
	if (maze) {
		maze.update();
	}
	//console.log("Updating!");
}

const generate = () => {
	console.log("Starting!");
	loop();
	background(0, 0, 75);
	maze.build();
}