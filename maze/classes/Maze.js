const UPDATE_LOOPS = 500;

class Maze {
	constructor(tile_width, tile_height, seed, color_points=10, colorize_start=true, distinct_colors=true) {
		this.tile_width = tile_width;
		this.tile_height = tile_height;
		this.color_points = color_points;
		this.colorize_start = colorize_start;
		this.distinct_colors = distinct_colors;
		
		if (seed == "") {
			seed = new Date().getTime() / 1000;
		}
		this.seed = seed;
		console.log("Seed: " + this.seed);
		randomSeed(this.seed);
		
		this.grid = null;
		this.start_cell = null;
		this.end_cell = null;
		this.current_cell = null;
		this.stack = [];
		this.color_cells = [];
		this.processing = false;
		
		this.START_COLOR = color(128, 95, 100);
		this.END_COLOR = color(360, 95, 100);
		this.FORCED_COLOR = color(0, 0, 0);
	}
	
	build() {
		console.log("Rebuild!");
		this.grid = new Grid(this.tile_width, this.tile_height);
		this.stack = [];
		this.color_cells = [];
		
		this.start_cell = this._getBorderCell(true);
		this.current_cell = this.start_cell;
		do {
			this.end_cell = this._getBorderCell(false);
		} while(this.end_cell == this.start_cell);
		
		this.processing = true;
	}
	
	update() {
		if (this.processing) {
			for(let i=0; i<UPDATE_LOOPS; i++) {
				this._processCells(this.current_cell);
			}
		}
		else if (this.color_cells.length > 0) {
			for(let i=0; i<UPDATE_LOOPS; i++) {
				this._colorCells();
			}
		}
		else if (this.grid) {
			console.log("Stopping!");
			noLoop();
		}
	}
	
	draw() {
		if (this.grid) {
			this.grid.draw();
			//this.start_cell.draw();
		}
	}
	
	_getBorderCell(set_visited) {
		let cell = null;
		
		let x = -1;
		let y = -1;
		do {
			if (int(random(100)) % 2 == 0) {
				x = int(random(this.tile_width));
				if (int(random(100)) % 2 == 0) {
					y = 0;
				}
				else {
					y = this.tile_height - 1;
				}
			}
			else {
				y = int(random(this.tile_height));
				if (int(random(100)) % 2 == 0) {
					x = 0;
				}
				else {
					x = this.tile_width - 1;
				}
			}
			cell = this.grid.getCell(x, y);
		} while(_.isNil(cell));
		console.log("Border Cell: " + x + ", " + y + "!");
		
		if (set_visited) {
			if (y == 0) {
				cell.setVisited(NORTH);
			}
			else if (x == this.width - 1) {
				cell.setVisited(EAST);
			}
			else if (y == this.tile_height - 1) {
				cell.setVisited(SOUTH);
			}
			else if (x == 0) {
				cell.setVisited(WEST);
			}
		}
		else {
			if (y == 0) {
				cell.removeWall(NORTH);
			}
			else if (x == this.width - 1) {
				cell.removeWall(EAST);
			}
			else if (y == this.tile_height - 1) {
				cell.removeWall(SOUTH);
			}
			else if (x == 0) {
				cell.removeWall(WEST);
			}
		}
		
		return cell;
	}
	
	_processCells(current_cell) {
		if (!this.processing) {
			return;
		}
		
		let next_cell = null;
		let neighbors = current_cell.getUnvisitedNeighbors();
		if (!_.isNil(neighbors)) {
			let directions = _.keys(neighbors);
			let dir = random(directions);
			next_cell = neighbors[dir];
			
			current_cell.setVisited(dir);
			next_cell.setVisited(turnAround(dir));
			
			this.stack.push(current_cell);
			this.last_cell = current_cell;
		}
		else if (this.stack.length > 0) {
			next_cell = this.stack.pop();
		}
		
		if (!_.isNil(next_cell)) {
			this.current_cell = next_cell;
		}
		else {
			this.processing = false;
			console.log("Finsihed build");
			this._initColors();
		}
	}
	
	_colorCells() {
		if (this.color_cells.length <= 0) {
			return;
		}
		
		const cell = this.color_cells.shift();
		const neighbors = cell.getUncoloredNeighbors();
		if (!_.isNil(neighbors)) {
			let new_color = cell.mutateColor();
			if (cell.color == this.START_COLOR || cell.color == this.END_COLOR) {
				new_color = this._getRandomColor();
			}
			//console.log("  Here: " + cell + " - " + cell.color + " -> " + color);
			_.each(neighbors, (neighbor, dir) => {
				//console.log("   Neighbor: " + neighbor);
				neighbor.setColor(new_color);
				this.color_cells.push(neighbor);
			});
		}
		
		if (cell.forced && !(cell.color == this.START_COLOR || cell.color == this.END_COLOR)) {
			cell.setColor(this.FORCED_COLOR);
		}
	}
	
	_initColors() {
		console.log("Init colors: " + this.color_points + "!");
		let total_points = this.color_points;
		
		this.color_cells = [];
		if (this.colorize_start) {
			//this._initColorPoint(this.start_cell);
			console.log("  Setting starting cell: " + this.START_COLOR);
			this.start_cell.setColor(this.START_COLOR);
			this.start_cell.forced = true;
			this.color_cells.push(this.start_cell);
			total_points--;
			
			console.log("  Setting end cell: " + this.END_COLOR);
			this.end_cell.setColor(this.END_COLOR);
			this.end_cell.forced = true;
			this.color_cells.push(this.end_cell);
			total_points--;
		}
		
		const cells = this.grid.getCells();
		for(let i=0; i<total_points; i++) {
			let cell = null;
			let nearby_points = false;
			do {
				nearby_points = false;
				do {
					let x = int(random(this.tile_width));
					let y = int(random(this.tile_height));
					//console.log("Checking: " + x + " - " + y + " (" + this.tile_width + ", " + this.tile_height + ")");
					cell = cells[y][x];
				} while(cell.hasColor() || this.color_cells.indexOf(cell) > -1);
				
				for(let check_cell of this.color_cells) {
					const distance = euclidean_dist(cell, check_cell);
					if (distance < 4) {
						//console.log("  Nearby: " + cell + " : " + check_cell + " -> " + distance + "!");
						nearby_points = true;
					}
				}
			} while(nearby_points);
			
			this._initColorPoint(cell);
			console.log("Cell: " + cell + " -> " + cell.color);
		}
	}
	
	_initColorPoint(cell) {
		cell.setColor(this._getRandomColor(cell.id));
		cell.forced = true;
		this.color_cells.push(cell);
	}
	
	_getRandomColor(index=0) {
		if (this.distinct_colors) {
			const rgb_colors = unique_color(index == 0 ? int(random(512)) : index);
			
			return color("rgb(" + rgb_colors.r + ", " + rgb_colors.g + ", " + rgb_colors.b + ")");
		}
		
		return color(int(random(MIN_HUE, MAX_HUE)), 100, int(random(MIN_BRI, MAX_BRI)));
	}
}