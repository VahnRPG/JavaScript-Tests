class ParticleSalt extends BaseParticle {
	constructor(x, y) {
		super(x, y);
		
		this.type = BaseParticle.SALT;
		this.color = this.getColor(0.9, 1.0, 0.8, 0.85, 0.8, 0.9);
		
		this.fall_rate = 2;
		this.spread_rate = 1;
		
		this.is_meltable = true;
		this.meltabiliity = 20;
	}
	
	update(delta, x, y) {
		this.was_updated = true;
		
		const liquid = inLiquid(x, y);
		if (liquid && oneIn(1000)) {
			//console.log("Salt melted: " + x + ", " + y);
			removeParticle(x, y);
			
			return;
		}
		
		this.velocity.y = clamp(this.velocity.y + (gravity * delta), -gravity, gravity);
		
		if (inBounds(x, y + 1) && !isEmpty(x, y + 1)) {
			this.velocity.y /= 2;
		}
		
		const vel_x = x + int(this.velocity.x);
		const vel_y = y + int(this.velocity.y);
		//console.log("Velocity: (" + vel_x + ", " + vel_y + ") - ", this.velocity);
		
		if (isEmpty(vel_x, vel_y)) {
			moveParticle(this, vel_x, vel_y);
		}
		else if (liquid && oneIn(10)) {
			swapParticles(x, y, liquid.x, liquid.y);
		}
		else {
			if (isEmpty(x, y + 1)) {
				this.velocity.y += gravity * delta;
				swapParticles(x, y, x, y + 1);
			}
			else if (isEmpty(x - 1, y + 1)) {
				this.velocity.x = (oneIn(2) ? -1.2 : 1.2);
				this.velocity.y += gravity * delta;
				swapParticles(x, y, x - 1, y + 1);
			}
			else if (isEmpty(x + 1, y + 1)) {
				this.velocity.x = (oneIn(2) ? -1.2 : 1.2);
				this.velocity.y += gravity * delta;
				swapParticles(x, y, x + 1, y + 1);
			}
		}
	}
}