class GeneratorSurface {
	constructor(min_size, max_size, hill_count) {
		this.min_size = min_size;
		this.max_size = max_size;
		this.hill_count = hill_count;
	}
	
	generate(width, height, palette_size) {
		let surface = [];
		for(let y=0; y<height; y++) {
			surface[y] = [];
			for(let x=0; x<width; x++) {
				surface[y][x] = null;
			}
		}
		
		for(let i=0; i < this.hill_count; i++) {
			surface = this._applyRandomHill(width, height, surface);
		}
		surface = this._flattenSurface(width, height, surface, palette_size);
		
		return surface;
	}
	
	_applyRandomHill(width, height, surface) {
		const radius = randInt(this.max_size - this.min_size - 1) + this.min_size;
		const x = randInt(width + (2 * radius)) - radius;
		const y = randInt(height + (2 * radius)) - radius;
		
		for(let k = 1; k < radius; k++) {
			for(let i = y - k; i < y + k; i++) {
				for(let j = x - k; j < x + k; j++) {
					if (i >= 0 && i < height && j >= 0 && j < width) {
						if (inside_circle(j, i, x, y, radius)) {
							surface[i][j] += 1;
						}
					}
				}
			}
		}
		
		return surface;
	}
	
	_flattenSurface(width, height, surface, palette_size) {
		const max_height = this._getMaxHeight(width, height, surface);
		const min_height = this._getMinHeight(width, height, surface);
		const diff = max_height - min_height;
		
		for(let y = 0; y < height; y++) {
			for(let x = 0; x < width; x++) {
				surface[y][x] = int(((surface[y][x] - min_height) / diff) * (palette_size - 1));
			}
		}

		return surface;
	}
	
	_getMaxHeight(width, height, surface) {
		let max_value = -99999999;
		for(let y = 0; y < height; y++) {
			for(let x = 0; x < width; x++) {
				if (!_.isNil(surface[y][x]) && surface[y][x] > max_value) {
					max_value = surface[y][x];
				}
			}
		}

		return max_value;
	}
	
	_getMinHeight(width, height, surface) {
		let min_value = 99999999;
		for(let y = 0; y < height; y++) {
			for(let x = 0; x < width; x++) {
				if (!_.isNil(surface[y][x]) && surface[y][x] < min_value) {
					min_value = surface[y][x];
				}
			}
		}

		return min_value;
	}
}