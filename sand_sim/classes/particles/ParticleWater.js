class ParticleWater extends BaseParticle {
	constructor(x, y) {
		super(x, y);
		
		this.type = BaseParticle.WATER;
		this.color = this.getColor(0.1, 0.15, 0.3, 0.35, 0.7, 0.8);
		this.is_liquid = true;
		
		this.fall_rate = 2;
		this.spread_rate = 5;
	}
	
	update(delta, x, y) {
		this.was_updated = true;
		
		if (randInt(0, int(this.lifetime * 100)) % 20 == 0) {
			this.color = this.getColor(0.1, 0.15, 0.3, 0.35, 0.7, 0.8);
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
			moveParticle(this, vel_x, vel_y);
		}
		else if (isEmpty(x, fall_y)) {
			moveParticle(this, x, fall_y);
		}
		else if (isEmpty(spread_x, fall_y)) {
			moveParticle(this, spread_x, fall_y);
		}
		else if (isEmpty(neg_spread_x, fall_y)) {
			moveParticle(this, neg_spread_x, fall_y);
		}
		else if (inBounds(x, fall_y) && (isEmpty(x, fall_y) || getParticle(x, fall_y).type == BaseParticle.OIL)) {
			this.velocity.y += gravity * delta;
			swapParticles(x, y, x, fall_y);
		}
		else {
			const liquid = inLiquid(x, y);
			if (inBounds(neg_spread_x, fall_y) && (isEmpty(neg_spread_x, fall_y) || getParticle(neg_spread_x, fall_y).type == BaseParticle.OIL)) {
				this.velocity.x = (liquid ? 0 : (oneIn(2) ? -1 : 1));
				this.velocity.y += gravity * delta;
				swapParticles(x, y, neg_spread_x, fall_y);
			}
			else if (inBounds(spread_x, fall_y) && (isEmpty(spread_x, fall_y) || getParticle(spread_x, fall_y).type == BaseParticle.OIL)) {
				this.velocity.x = (liquid ? 0 : (oneIn(2) ? -1 : 1));
				this.velocity.y += gravity * delta;
				swapParticles(x, y, spread_x, fall_y);
			}
			else if (liquid && oneIn(10)) {
				swapParticles(this, x, y, liquid.x, liquid.y);
			}
			else if (isSurrounded(x, y)) {
				//do nothing
			}
			else {
				for(let i=0; i<this.fall_rate; i++) {
					for(let j=this.spread_rate; j > 0; j--) {
						if (inBounds(x - j, y + i) && (isEmpty(x - j, y + i) || getParticle(x - j, y + i).type == BaseParticle.OIL)) {
							swapParticles(x, y, x - j, y + i);
							break;
						}
						if (inBounds(x + j, y + i) && (isEmpty(x + j, y + i) || getParticle(x + j, y + i).type == BaseParticle.OIL)) {
							swapParticles(x, y, x + j, y + i);
							break;
						}
					}
				}
			}
		}
	}
}