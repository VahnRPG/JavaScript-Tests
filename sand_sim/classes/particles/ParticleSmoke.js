class ParticleSmoke extends BaseParticle {
	constructor(x, y) {
		super(x, y);
		
		this.type = BaseParticle.SMOKE;
		this.color = color(50, 50, 50);
		
		this.fall_rate = 4;
	}
	
	update(delta, x, y) {
		if (this.lifetime > 10) {
			//console.log("Smoke evaporated: " + x + ", " + y + " - " + this.lifetime);
			removeParticle(x, y);
			
			return;
		}
		
		if (this.was_updated) {
			return;
		}
		
		this.was_updated = true;
		
		this.color.r = clamp(lerp(10, 0, this.lifetime * 0.5) / 10 * 150, 0, 150);
		this.color.g = clamp(lerp(10, 0, this.lifetime * 0.5) / 10 * 120, 0, 120);
		this.color.b = clamp(lerp(10, 0, this.lifetime * 0.5) / 10 * 100, 0, 100);
		
		this.velocity.x = clamp(this.velocity.x + randInt(-100, 100) / 100, -1, 1);
		this.velocity.y = clamp(this.velocity.y - (gravity * delta), -2, 10);
		
		if (inBounds(x, y - 1) && !isEmpty(x, y - 1) && getParticle(x, y - 1).type != BaseParticle.WATER) {
			this.velocity.y /= 2;
		}
		
		const vel_x = x + int(this.velocity.x);
		const vel_y = y + int(this.velocity.y);
		//console.log("Velocity: (" + vel_x + ", " + vel_y + ") - ", this.velocity);
		
		const vel_particle = getParticle(vel_x, vel_y);
		if (inBounds(vel_x, vel_y) && (!vel_particle || vel_particle.type == BaseParticle.SMOKE)) {
			if (vel_particle && vel_particle.type == BaseParticle.WATER) {
				vel_particle.was_updated = true;
				vel_particle.velocity = createVector(randInt(-2, 2), -3);
				swapParticles(x, y, vel_x, vel_y);
			}
			else if (!vel_particle) {
				moveParticle(this, vel_x, vel_y);
			}
		}
		else {
			this.checkMovement(delta, x, y);
		}
	}
	
	checkMovement(delta, x, y) {
		const wood_chance = 100;
		const gunpowder_chance = 1;
		const oil_chance = 5;
		
		const positions = [
			//{ x: -1, y:  1, change_x: false, change_y: false },
			//{ x:  0, y:  1, change_x: false, change_y: false },
			//{ x:  1, y:  1, change_x: false, change_y: false },
			
			{ x: -1, y:  0, change_x: false, change_y: false },
			//{ x:  0, y:  0, change_x: false, change_y: false },
			{ x:  1, y:  0, change_x: false, change_y: false },
			
			{ x: -1, y: -1, change_x: true,  change_y: true },
			{ x:  0, y: -1, change_x: false, change_y: true },
			{ x:  1, y: -1, change_x: true,  change_y: true },
		];
		
		for(const position of positions) {
			const check_x = x + position.x;
			const check_y = y + position.y;
			
			if (inBounds(check_x, check_y)) {
				const check_particle = getParticle(check_x, check_y);
				if (check_particle && check_particle.type != BaseParticle.SMOKE && check_particle.type != BaseParticle.WOOD && check_particle.type != BaseParticle.STONE) {
					if (position.change_x) {
						this.velocity.x = (oneIn(2) ? -1.2 : 1.2);
					}
					if (position.change_y) {
						this.velocity.y -= gravity * delta;
					}
					
					swapParticles(x, y, check_x, check_y);
					
					return true;
				}
			}
		}
		
		return false;
	}
}