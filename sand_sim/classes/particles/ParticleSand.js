class ParticleSand extends BaseParticle {
	constructor(x, y) {
		super(x, y);
		
		this.type = BaseParticle.SAND;
		this.color = this.getColor(0.8, 1.0, 0.5, 0.6, 0.2, 0.25);
		
		this.fall_rate = 4;
		
		this.is_meltable = true;
		this.meltabiliity = 50;
	}
	
	update(delta, x, y) {
		const start_vel = this.velocity.copy();
		
		this.velocity.y = clamp(this.velocity.y + (gravity * delta), -10, 10);
		
		if (inBounds(x, y + 1) && !isEmpty(x, y + 1) && getParticle(x, y + 1).type != BaseParticle.WATER) {
			this.velocity.y /= 2;
		}
		
		const vel_x = x + int(this.velocity.x);
		const vel_y = y + int(this.velocity.y);
		//console.log("Velocity (" + this.id + "): (" + this.x + ", " + this.y + ") to (" + vel_x + ", " + vel_y + ") - ", this.velocity);
		
		const vel_particle = getParticle(vel_x, vel_y);
		if (
			inBounds(vel_x, vel_y) &&
			(
				isEmpty(vel_x, vel_y) || (vel_particle.type == BaseParticle.WATER && !vel_particle.was_updated && (vel_particle.velocity.mag() - start_vel.mag()) > 10)
			)
		) {
			if (vel_particle && vel_particle.type == BaseParticle.WATER) {
				vel_particle.velocity = createVector(randInt(-2, 2), -4);
				
				moveParticle(this, vel_x, vel_y);
				for(let i=-10; i<0; i++) {
					for(let j=-10; j<0; j++) {
						if (isEmpty(vel_x + j, vel_y + i)) {
							moveParticle(vel_particle, vel_x + j, vel_y + i);
							break;
						}
					}
				}
			}
			else if (isEmpty(vel_x, vel_y)) {
				console.log(" Moving (" + this.id + "): (" + this.x + ", " + this.y + ") - (" + this.velocity.x + ", " + this.velocity.y + ")");
				if (moveParticle(this, vel_x, vel_y)) {
					console.log("  Moved (" + this.id + "): (" + this.x + ", " + this.y + ") to (" + vel_x + ", " + vel_y + ")");
				}
			}
		}
		else {
			const liquid = inLiquid(x, y);
			if (inBounds(x, y + 1) && (isEmpty(x, y + 1) || getParticle(x, y + 1).type == BaseParticle.WATER)) {
				this.velocity.y += gravity * delta;
				moveParticle(this, x, y + 1);
			}
			else if (inBounds(x - 1, y + 1) && (isEmpty(x - 1, y + 1) || getParticle(x - 1, y + 1).type == BaseParticle.WATER)) {
				this.velocity.x = (liquid ? 0 : (oneIn(2) ? -1 : 1));
				this.velocity.y += gravity * delta;
				swapParticles(this, x, y, x - 1, y + 1);
			}
			else if (inBounds(x + 1, y + 1) && (isEmpty(x + 1, y + 1) || getParticle(x + 1, y + 1).type == BaseParticle.WATER)) {
				this.velocity.x = (liquid ? 0 : (oneIn(2) ? -1 : 1));
				this.velocity.y += gravity * delta;
				swapParticles(this, x, y, x + 1, y + 1);
			}
			else if (liquid && oneIn(10)) {
				swapParticles(this, x, y, liquid.x, liquid.y);
			}
		}
	}
}