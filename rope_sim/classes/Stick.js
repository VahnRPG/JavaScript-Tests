class Stick {
	constructor(pointA, pointB) {
		this.pointA = pointA;
		this.pointB = pointB;
		this.length = p5.Vector.dist(pointA.position, pointB.position);
		this.dead = false;
	}
	
	draw() {
		if (this.dead) {
			return;
		}
		
		stroke(255);
		strokeWeight(4);
		line(this.pointA.position.x, this.pointA.position.y, this.pointB.position.x, this.pointB.position.y);
	}
	
	toString() {
		return "A: " + this.pointA + " - B: " + this.pointB + ")";
	}
}