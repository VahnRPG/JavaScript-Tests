class Space {
	constructor(size, palette_size) {
		this.width = size;
		this.height = size;
		
		this.stars = this._generateStars(size);
		this.palette = nebula_palette(palette_size);
		
		const surface_gen = new GeneratorSurface(10, 50, 500);
		this.nebula = surface_gen.generate(this.width, this.height, palette_size);
	}
	
	draw() {
		for(let y = 0; y < this.height; y++) {
			for(let x = 0; x < this.width; x++) {
				//console.log("  Here: " + x + ", " + y + " -> " + this.palette[this.nebula[y][x]]);
				stroke(this.palette[this.nebula[y][x]]);
				point(x, y);
			}
		}
		
		_.each(this.stars, (star) => {
			star.draw();
		});
	}
	
	_generateStars(size) {
		let stars = [];
		for(let i=0; i<size; i++) {
			stars.push(new Star(randInt(size), randInt(size)));
		}
		
		return stars;
	}
}