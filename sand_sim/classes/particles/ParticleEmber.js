class ParticleEmber extends BaseParticle {
	constructor(x, y) {
		super(x, y);
		
		this.type = BaseParticle.EMBER;
		this.color = color(200, 120, 20);
		
		this.fall_rate = 4;
	}
	
	update(delta, x, y) {
		if (this.lifetime > 0.5) {
			//console.log("Ember faded: " + x + ", " + y + " - " + this.lifetime);
			removeParticle(x, y);
			
			return;
		}
		
		if (this.was_updated) {
			return;
		}
		
		this.was_updated = true;
		
		this.checkWood(x, y);
		
		this.velocity.x = clamp(this.velocity.x + randInt(-100, 100) / 100, -1, 1);
		this.velocity.y = clamp(this.velocity.y - (gravity * delta), -2, 10);
		
		if (inBounds(x, y + 1) && !isEmpty(x, y + 1) && getParticle(x, y + 1).type != BaseParticle.WATER) {
			this.velocity.y /= 2;
		}
		
		const vel_x = x + int(this.velocity.x);
		const vel_y = y + int(this.velocity.y);
		//console.log("Velocity: (" + vel_x + ", " + vel_y + ") - ", this.velocity);
		
		const vel_particle = getParticle(vel_x, vel_y);
		if (inBounds(vel_x, vel_y) && (!vel_particle || vel_particle.type == BaseParticle.WATER || vel_particle.type == BaseParticle.FIRE || vel_particle.type == BaseParticle.SMOKE || vel_particle.type == BaseParticle.EMBER)) {
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
		else if (inBounds(x + 1, y) && (isEmpty(x + 1, y) || getParticle(x + 1, y).type == BaseParticle.FIRE)) {
			swapParticles(x, y, x + 1, y);
		}
		else if (inBounds(x - 1, y) && (isEmpty(x - 1, y) || getParticle(x - 1, y).type == BaseParticle.FIRE)) {
			swapParticles(x, y, x - 1, y);
		}
	}
	
	checkWood(x, y) {
		const wood_chance = 100;
		const gunpowder_chance = 1;
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
				if (check_particle && check_particle.type == BaseParticle.WOOD && oneIn(200)) {
					console.log("Creating fire: " + check_x + ", " + check_y);
					setParticle(BaseParticle.FIRE, check_x, check_y);
					
					return true;
				}
			}
		}
		
		return false;
	}
}