const random_palette = (palette_size) => {
	let result = [];
	result[palette_size - 1] = color(randInt(192), randInt(192), randInt(192));
	
	let dim = 0.9;
	result = build_palette(result, palette_size, dim);
	
	if (inPercent(20)) {
		let j = randInt(palette_size - 4) + 2;
		result[j] = color(randInt(192), randInt(192), randInt(192));
		
		for(let i = j - 1; i >= 0; i--) {
			result[i] = dim_color(result[i + 1], dim);
		}
	}

	return result;
}

const vulcanic_palette = (palette_size) => {
	let result = [];
	result[palette_size - 1] = color(randInt(32) + 32, randInt(32) + 32, randInt(32) + 64);
	
	let dim = 0.9;
	result = build_palette(result, palette_size, dim);
	
	if (inPercent(20)) {
		let j = randInt(palette_size);
		result[j] = color(randInt(32) + 224, randInt(64) + 64, randInt(32) + 0);
		
		for(let i = j - 1; i >= 0; i--) {
			result[i] = dim_color(result[i + 1], dim);
		}
	}

	return result;
}

const nebula_palette = (palette_size) => {
	let result = [];
	result[palette_size - 1] = color(randInt(64), randInt(64), randInt(64));
	result = build_palette(result, palette_size, 0.6);

	return result;
}

const build_palette = (result, palette_size, dim) => {
	for(let i = palette_size - 2; i >= 0; i--) {
		result[i] = dim_color(result[i + 1], dim);
	}
	
	return result;
}

const dim_color = (rgb, dim) => {
	let r = red(rgb) * dim;
	let g = green(rgb) * dim;
	let b = blue(rgb) * dim;
	
	return color(r, g, b);
}