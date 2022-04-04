class Cell {
	constructor(x, y, color) {
		this.x = x;
		this.y = y;
		this.color = color;
	}
	
	draw() {
		let x = this.x * tile_size;
		let y = this.y * tile_size;
		
		noStroke();
		fill(this.color);
		rect(x, y, tile_size, tile_size);
	}
}