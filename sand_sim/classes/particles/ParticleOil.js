class ParticleOil extends BaseParticle {
	constructor(x, y) {
		super(x, y);
		
		this.type = BaseParticle.OIL;
		//this.color = this.getColor(0.12, 0.15, 0.10, 0.12, 0.08, 0.10);
		this.color = this.getColor(0.72, 0.75, 0.68, 0.7, 0.21, 0.22);
		this.is_liquid = true;
		
		this.is_flammable = true;
		this.flammability = 20;
		
		this.fall_rate = 2;
		this.spread_rate = 4;
	}
	
	update(delta, x, y) {
		this.was_updated = true;
		
		if (randInt(0, int(this.lifetime * 100)) % 20 == 0) {
			//this.color = this.getColor(0.2, 0.25, 0.2, 0.25, 0.2, 0.25);
			this.color = this.getColor(0.8, 0.85, 0.78, 0.83, 0.32, 0.37);
		}
		
		this.velocity.y = clamp(this.velocity.y + (gravity * delta), -gravity, gravity);
		
		if (inBounds(x, y + 1) && !isEmpty(x, y + 1)) {
			this.velocity.y /= 2;
		}
		
		const vel_x = x + int(this.velocity.x);
		const vel_y = y + int(this.velocity.y);
		//console.log("Velocity: (" + vel_x + ", " + vel_y + ") - ", this.velocity);
		
		const spread = (oneIn(2) ? this.spread_rate : -this.spread_rate); 
		const spread_x = x + spread;
		const neg_spread_x = x - spread;
		const fall_y = y + this.fall_rate;
		
		if (isEmpty(vel_x, vel_y)) {
			//console.log("Velocity oil: " + this.id);
			moveParticle(this, vel_x, vel_y);
		}
		else if (isEmpty(x, fall_y)) {
			//console.log("Falling oil: " + this.id);
			moveParticle(this, x, fall_y);
		}
		else if (isEmpty(spread_x, fall_y)) {
			//console.log("Spreading oil: " + this.id);
			moveParticle(this, spread_x, fall_y);
		}
		else if (isEmpty(neg_spread_x, fall_y)) {
			//console.log("(neg) Spreading oil: " + this.id);
			moveParticle(this, neg_spread_x, fall_y);
		}
		else {
			//console.log("Flattening oil: " + this.id);
			for(let i=0; i<this.fall_rate; i++) {
				for(let j=this.spread_rate; j > 0; j--) {
					if (isEmpty(x - j, y + i)) {
						moveParticle(this, x - j, y + i);
						break;
					}
					if (isEmpty(x + j, y + i)) {
						moveParticle(this, x + j, y + i);
						break;
					}
				}
			}
		}
	}
}