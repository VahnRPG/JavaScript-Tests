class ParticleSteam extends BaseParticle {
	constructor(x, y) {
		super(x, y);
		
		this.type = BaseParticle.STEAM;
		this.color = color(220, 220, 250);
		
		this.fall_rate = 4;
	}
	
	update(delta, x, y) {
		if (this.lifetime > 10) {
			//console.log("Steam dissipated: " + x + ", " + y + " - " + this.lifetime);
			removeParticle(x, y);
			
			return;
		}
		
		if (this.was_updated) {
			return;
		}
		
		this.was_updated = true;
		
		this.color.r = clamp(lerp(0, 10, this.lifetime) / 10 * 255, 150, 255);
		this.color.g = clamp(lerp(0, 10, this.lifetime) / 10 * 255, 150, 255);
		this.color.b = clamp(lerp(0, 10, this.lifetime) / 10 * 255, 150, 255);
		this.color.a = clamp(lerp(10, 0, this.lifetime) / 10 * 255, 10, 255);
		
		this.velocity.x = clamp(this.velocity.x + randInt(-100, 100) / 100, -1, 1);
		this.velocity.y = clamp(this.velocity.y - (gravity * delta), -2, 10);
		
		if (inBounds(x, y - 1) && !isEmpty(x, y - 1) && getParticle(x, y - 1).type != BaseParticle.WATER) {
			this.velocity.y /= 2;
		}
		
		const vel_x = x + int(this.velocity.x);
		const vel_y = y + int(this.velocity.y);
		//console.log("Velocity: (" + vel_x + ", " + vel_y + ") - ", this.velocity);
		
		const vel_particle = getParticle(vel_x, vel_y);
		if (inBounds(vel_x, vel_y) && (!vel_particle || vel_particle.type == BaseParticle.WATER || vel_particle.type == BaseParticle.FIRE)) {
			if (vel_particle && vel_particle.type == BaseParticle.WATER) {
				vel_particle.was_updated = true;
				vel_particle.velocity = createVector(randInt(-2, 2), -3);
				swapParticles(x, y, vel_x, vel_y);
			}
			else if (!vel_particle) {
				moveParticle(this, vel_x, vel_y);
			}
		}
		else if (inBounds(x, y - 1) && ((isEmpty(x, y - 1) || getParticle(x, y - 1).type == BaseParticle.WATER) || getParticle(x, y - 1).type == BaseParticle.FIRE)) {
			this.velocity.y -= gravity * delta;
			swapParticles(x, y, x, y - 1);
		}
		else if (inBounds(x - 1, y - 1) && ((isEmpty(x - 1, y - 1) || getParticle(x - 1, y - 1).type == BaseParticle.WATER) || getParticle(x - 1, y - 1).type == BaseParticle.FIRE)) {
			this.velocity.x = (oneIn(2) ? -1.2 : 1.2);
			this.velocity.y -= gravity * delta;
			swapParticles(x, y, x - 1, y - 1);
		}
		else if (inBounds(x + 1, y - 1) && ((isEmpty(x + 1, y - 1) || getParticle(x + 1, y - 1).type == BaseParticle.WATER) || getParticle(x + 1, y - 1).type == BaseParticle.FIRE)) {
			this.velocity.x = (oneIn(2) ? -1.2 : 1.2);
			this.velocity.y -= gravity * delta;
			swapParticles(x, y, x + 1, y - 1);
		}
		else if (inBounds(x + 1, y) && (isEmpty(x + 1, y) || getParticle(x + 1, y).type == BaseParticle.WATER)) {
			swapParticles(x, y, x + 1, y);
		}
		else if (inBounds(x - 1, y) && (isEmpty(x - 1, y) || getParticle(x - 1, y).type == BaseParticle.WATER)) {
			swapParticles(x, y, x - 1, y);
		}
	}
}