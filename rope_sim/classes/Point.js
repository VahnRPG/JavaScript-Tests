class Point {
	constructor(position, locked = false, radius = 50) {
		this.position = position.copy();
		this.prevPosition = position.copy();
		this.locked = locked;
		this.radius = radius;
		this.dead = false;
	}
	/*
	constructor(x, y, locked = false, radius = 50) {
		this.position = createVector(x, y);
		this.prevPosition = this.position.copy();
		this.locked = locked;
		this.radius = radius;
	}
	*/
	
	draw() {
		if (this.dead) {
			return;
		}
		
		noStroke();
		fill((this.locked ? 204 : 236), (this.locked ? 0 : 236), (this.locked ? 0 : 236));
		ellipse(this.position.x, this.position.y, this.radius);
	}
	
	toString() {
		return "(" + this.position.x + "," + this.position.y + ")";
	}
}