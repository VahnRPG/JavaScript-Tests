class Grid {
	constructor(tile_width, tile_height) {
		this.tile_width = tile_width;
		this.tile_height = tile_height;
		
		this.cells = [];
		for(let y=0; y<this.tile_height; y++) {
			this.cells[y] = [];
			for(let x=0; x<this.tile_width; x++) {
				this.cells[y][x] = new Cell(this, x, y);
			}
		}
	}
	
	draw() {
		for(let y=0; y<this.tile_height; y++) {
			for(let x=0; x<this.tile_width; x++) {
				this.cells[y][x].draw();
			}
		}
	}
	
	getCells() {
		return this.cells;
	}
	
	getCell(x, y) {
		if (!_.isNil(this.cells[y]) && !_.isNil(this.cells[y][x])) {
			return this.cells[y][x];
		}
		
		return null;
	}
}