class Point {
	constructor(x, y, locked = false, radius = 50) {
		this.position = createVector(x, y);
		this.prevPosition = this.position.copy();
		this.locked = locked;
		this.radius = radius;
	}
	
	draw() {
		noStroke();
		fill((this.locked ? 204 : 236), (this.locked ? 0 : 236), (this.locked ? 0 : 236));
		ellipse(this.position.x, this.position.y, this.radius);
	}
	
	toString() {
		return "(" + this.position.x + "," + this.position.y + ")";
	}
}