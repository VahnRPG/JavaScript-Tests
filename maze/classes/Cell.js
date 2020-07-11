const MIN_HUE = 10;
const MAX_HUE = 360;
const MIN_BRI = 45;
const MAX_BRI = 99;

const HUE_STEP = 1;
const BRI_STEP = 2;

class Cell {
	constructor(grid, x, y) {
		this.grid = grid;
		this.id = y * tile_width + x;
		this.x = x;
		this.y = y;
		
		this.update = true;
		
		this.visited = false;
		this.color = null;
		this.forced = false;
		
		this.walls = {};
		_.each(DIRECTIONS, (dir) => {
			this.walls[dir] = true;
		});
	}
	
	draw() {
		if (!this.update) {
			return;
		}
		
		let x = this.x * tile_size + (border_size / 2);
		let y = this.y * tile_size + (border_size / 2);
		
		noStroke();
		if (this.hasColor()) {
			fill(this.color);
		}
		else {
			fill(color(0, 0, 100));
		}
		rect(x, y, tile_size, tile_size);
		
		stroke(0);
		strokeWeight(1);
		if (this.walls[NORTH]) {
			line(x, y, x + tile_size, y);
		}
		if (this.walls[EAST]) {
			line(x + tile_size, y, x + tile_size, y + tile_size);
		}
		if (this.walls[SOUTH]) {
			line(x + tile_size, y + tile_size, x, y + tile_size);
		}
		if (this.walls[WEST]) {
			line(x, y + tile_size, x, y);
		}
		
		this.update = false;
	}
	
	hasColor() {
		return !_.isNil(this.color);
	}
	
	setColor(color) {
		this.update = true;
		//console.log("    Setting Color: " + this + " - " + this.color + " -> " + color);
		this.color = color;
	}
	
	mutateColor() {
		//console.log("Mutate: " + this + " -> " + this.color);
		let new_hue = int(hue(this.color));
		let new_sat = int(saturation(this.color));
		let new_bri = int(brightness(this.color));
		//console.log("Here " + this + ": " + new_hue + " - " + new_sat + " - " + new_bri + " -> " + this.color);
		
		if (new_bri + BRI_STEP > MAX_BRI) {
			//console.log("   Reset: " + this + "!");
			new_bri = MIN_BRI;
			new_hue += HUE_STEP;
			if (new_hue >= MAX_HUE) {
				//console.log("    Reset2: " + this + "!");
				new_hue = MIN_HUE;
			}
			//new_hue = new_hue % 360;
		}
		else {
			new_bri += BRI_STEP;
		}
		//console.log(" Here: " + new_hue + " - " + new_sat + " - " + new_bri + " -> " + color(new_hue, new_sat, new_bri));
		
		return color(new_hue, new_sat, new_bri);
	}
	
	setVisited(dir) {
		this.update = true;
		this.visited = true;
		this.removeWall(dir);
	}
	
	removeWall(dir) {
		if (!_.isNil(this.walls[dir])) {
			this.walls[dir] = false;
		}
	}
	
	getUnvisitedNeighbors() {
		let neighbors = {};
		_.each(this.walls, (wall, dir) => {
			let neighbor = this._getNeighbor(dir);
			if (!_.isNil(neighbor) && !neighbor.visited) {
				neighbors[dir] = neighbor;
			}
		});
		
		if (_.size(neighbors) > 0) {
			return neighbors;
		}
		
		return null;
	}
	
	getUncoloredNeighbors() {
		let neighbors = {};
		_.each(this.walls, (wall, dir) => {
			if (wall) {
				return;
			}
			
			let neighbor = this._getNeighbor(dir);
			if (!_.isNil(neighbor) && !neighbor.hasColor()) {
				neighbors[dir] = neighbor;
			}
		});
		
		if (_.size(neighbors) > 0) {
			return neighbors;
		}
		
		return null;
	}
	
	getWalls() {
		return this.walls;
	}
	
	getWallString() {
		let total = 0;
		_.each(this.walls, (wall, dir) => {
			if (wall) {
				total += dir;
			}
		});
		
		let output = "";//str_pad(decbin(total), 4, "0", STR_PAD_LEFT);
		
		return output;
	}
	
	_getNeighbor(dir) {
		if (dir == NORTH) {
			return this.grid.getCell(this.x, this.y - 1);
		}
		else if (dir == EAST) {
			return this.grid.getCell(this.x + 1, this.y);
		}
		else if (dir == SOUTH) {
			return this.grid.getCell(this.x, this.y + 1);
		}
		else if (dir == WEST) {
			return this.grid.getCell(this.x - 1, this.y);
		}
	}
	
	toString() {
		return "(" + this.x + "," + this.y + ")";
	}
}