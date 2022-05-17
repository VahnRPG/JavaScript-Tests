class ParticleAcid extends BaseParticle {
	constructor(x, y) {
		super(x, y);
		
		this.type = BaseParticle.ACID;
		this.color = this.getColor(0.05, 0.06, 0.8, 0.85, 0.1, 0.12);
		
		this.melt_power = 1;
		
		this.fall_rate = 2;
		this.spread_rate = 5;
	}
	
	update(delta, x, y) {
		this.was_updated = true;
		
		if (randInt(0, int(this.lifetime * 100)) % 20 == 0) {
			this.color = this.getColor(0.05, 0.06, 0.8, 0.85, 0.1, 0.12);
		}
		
		if (inWater(x, y) && oneIn(250)) {
			console.log("Acid neutralized in water: " + x + ", " + y);
			removeParticle(x, y);
			
			return;
		}
		
		this.checkMeltables(x, y);
		
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
	
	checkMeltables(x, y) {
		const wood_chance = 100;
		const gunpowder_chance = 0;
		const oil_chance = 5;
		
		const positions = [
			{ x:  0, y:  1 },
			{ x:  1, y:  1 },
			{ x: -1, y:  1 },
			
			{ x: -1, y:  0 },
			//{ x:  0, y:  0 },
			{ x:  1, y:  0 },
			
			{ x:  1, y: -1 },
			{ x: -1, y: -1 },
			//{ x:  0, y: -1 },
		];
		
		for(const position of positions) {
			const check_x = x + position.x;
			const check_y = y + position.y;
			
			if (inBounds(check_x, check_y)) {
				const check_particle = getParticle(check_x, check_y);
				if (check_particle && (check_particle.is_meltable && oneIn(int(check_particle.meltabiliity / this.melt_power)))) {
					moveParticle(this, check_x, check_y);
					
					return true;
				}
			}
		}
		
		return false;
	}
}