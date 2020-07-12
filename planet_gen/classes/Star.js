class Star {
	constructor(x, y) {
		this.x = x;
		this.y = y;
		this.radius = randInt(1, 5);
		
		let r = randInt(128, 256);
		let g = randInt(128, 256);
		let b = randInt(128, 256);
		let a = randInt(128, 256);
		
		this.color = color(r, g, b, a);
	}
	
	draw() {
		noStroke();
		fill(this.color);
		ellipse(this.x, this.y, this.radius);
	}
	
	toString() {
		return "(" + this.x + "," + this.y + ")";
	}
}