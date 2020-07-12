const UPDATE_LOOPS = 500;

class PlanetGen {
	constructor(size) {
		this.size = size;
		this.planet = null;
		
		this.processing = false;
	}
	
	build() {
		console.log("Rebuild!");
		
		this.palette_size = randInt(7, 7);
		this.space = new Space(this.size, this.palette_size);
		
		const planet_size = randInt(this.size / 4, this.size / 2);
		const disp_pos = (this.size / 2) - (planet_size / 2);
		this.planet = new Planet(disp_pos, disp_pos, planet_size, this.palette_size);
	}
	
	update() {
		if (this.processing) {
			for(let i=0; i<UPDATE_LOOPS; i++) {
				//this._processCells(this.current_cell);
			}
		}
		else if (this.space) {
		}
	}
	
	draw() {
		if (this.space) {
			this.space.draw();
			this.planet.draw();
		}
	}
}