class Planet {
	constructor(x, y, size, palette_size) {
		this.x = x;
		this.y = y;
		this.size = size;
		this.width = size;
		this.height = size;
		this.palette = random_palette(palette_size);
		this.occlusion_border = 1;
		
		const surface_gen = new GeneratorSurface(1, 10, Math.ceil(this.width * this.height / 10));
		this.surface = surface_gen.generate(this.width, this.height, palette_size);
		
		this.has_atmosphere = false;
		this.atmosphere = null;
		this.atmosphere_border = 0;
		this.atmosphere_color = null;
		
		if (inPercent(30) || true) {
			console.log("Atmosphere");
			this.has_atmosphere = true;
			this.atmosphere = surface_gen.generate(this.width, this.height, palette_size);
			this.atmosphere_border = randInt(2, this.palette.length - 2);
			
			let r = randInt(128, 192);
			let g = randInt(128, 192);
			let b = randInt(128, 192);
			this.atmosphere_color = color(r, g, b);
		}
	}
	
	draw() {
		noStroke();
		
		this._drawSurface();
		if (this.has_atmosphere) {
			this._drawAtmosphereSurface();
		}
		this._drawCircleAmbientOcclusion();
		this._drawCircleShadow();
	}
	
	_drawSurface() {
		const radius = this.size / 2;
		for(let y = 0; y < this.height; y++) {
			for(let x = 0; x < this.width; x++) {
				if (inside_circle(x, y, radius, radius, radius)) {
					stroke(this.palette[this.surface[y][x]]);
					point(this.x + x, this.y + y);
				}
			}
		}
	}
	
	_drawAtmosphereSurface() {
		const r = red(this.atmosphere_color);
		const g = green(this.atmosphere_color);
		const b = blue(this.atmosphere_color);
		
		const radius = this.size / 2;
		for(let y = 0; y < this.height; y++) {
			for(let x = 0; x < this.width; x++) {
				const atmosphere = this.atmosphere[y][x];
				if (inside_circle(x, y, radius, radius, radius) && atmosphere > this.atmosphere_border) {
					stroke(r, g, b, (256 / this.palette.length * atmosphere));
					point(this.x + x, this.y + y);
				}
			}
		}
	}
	
	_drawCircleAmbientOcclusion() {
		stroke(color(0, 0, 0, 96));
		
		const radius = this.size / 2;
		for(let y = 0; y < this.height; y++) {
			for(let x = 0; x < this.width; x++) {
				if (!inside_circle(x, y, radius, radius, radius - this.occlusion_border) && inside_circle(x, y, radius, radius, radius)) {
					point(this.x + x, this.y + y);
				}
			}
		}
	}
	
	_drawCircleShadow() {
		stroke(color(0, 0, 0, 48));
		
		const radius = this.size / 2;
		for(let y = 0; y < this.height; y++) {
			for(let x = 0; x < this.width; x++) {
				if (!inside_circle(x, y, radius + (radius / 4), 3 * radius / 4, ceil(radius * 0.9)) && inside_circle(x, y, radius, radius, radius)) {
					point(this.x + x, this.y + y);
				}
			}
		}
	}
}