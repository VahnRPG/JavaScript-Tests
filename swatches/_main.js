const cells_x = 9;
const cells_y = 8;
const tile_size = 40;

const canvas_width = cells_x * tile_size;
const canvas_height = cells_y * tile_size;

const MIN_HUE = 275;
const MIN_SAT = 20;
const MIN_BRI = 15;

const HUE_STEP = 20;
const HUE_RAMP = 45;
const SAT_STEP = [ 20, 20, 20, 10, 5, -15, -15, -15, -15 ];
const BRI_STEP = [ 15, 15, 15, 15, 10, 10, 10, 5, 5 ];

let cells = [];

function setup() {
	colorMode(HSB, 360, 100, 100);
	
	canvas = createCanvas(canvas_width, canvas_height);
	background(0, 0, 75);
	
	cells = [];
	let hue = MIN_HUE;
	for(let y=0; y<cells_y; y++) {
		cells[y] = [];
		let sat = MIN_SAT;
		let bri = MIN_BRI;
		for(let x=0; x<cells_x; x++) {
			let col = color(hue, sat, bri);
			console.log("Here: " + y, { hue, sat, bri });
			cells[y][x] = new Cell(x, y, col);
			console.log("  Here2: r", red(col));
			console.log("  Here2: g", green(col));
			console.log("  Here2: b", blue(col));
			hue += HUE_STEP;
			hue = hue % 360;
			sat += SAT_STEP[x + 1];
			bri += BRI_STEP[x + 1];
		}
		
		hue = MIN_HUE + (HUE_RAMP * (y + 1));
		hue = hue % 360;
	}
}

function keyPressed() {
	if (keyCode === ESCAPE) {
		console.log("Stopping!");
		noLoop();
	}
	else if (keyCode === ENTER) {
	}
	else if (keyCode === 80) {
		saveCanvas(canvas, "swatch-" + cells_x + "x" + cells_y, "png");
	}
}

function draw() {
	for(let y=0; y<cells_y; y++) {
		for(let x=0; x<cells_x; x++) {
			cells[y][x].draw();
		}
	}
}