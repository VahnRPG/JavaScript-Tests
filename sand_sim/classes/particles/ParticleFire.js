class ParticleFire extends BaseParticle {
	constructor(x, y) {
		super(x, y);
		
		this.type = BaseParticle.FIRE;
		this.color = color(150, 20, 0);
		
		this.heat_power = 4;
		
		this.fall_rate = 4;
	}
	
	update(delta, x, y) {
		if (this.was_updated) {
			return;
		}
		
		this.was_updated = true;
		
		if (this.lifetime > 0.2 && oneIn(100)) {
			//console.log("Fire died: " + x + ", " + y + " - " + this.lifetime);
			removeParticle(x, y);
			
			return;
		}
		
		this.velocity.x = clamp(this.velocity.x + randInt(-100, 100) / 200, -0.5, 0.5);
		this.velocity.y = clamp(this.velocity.y - (gravity * delta) * 0.2, -(gravity / 2), 0);
		
		if (randInt(int(this.lifetime * 100)) % 200 == 0) {
			switch(randInt(4)) {
				case 0:
					this.color = color(255, 80, 20);
					break;
				case 1:
					this.color = color(250, 150, 10);
					break;
				case 2:
					this.color = color(200, 150, 0);
					break;
				case 3:
					this.color = color(100, 50, 2);
					break;
			}
		}
		
		if (this.lifetime < 0.02) {
			this.color.r = 200;
		}
		else {
			this.color.r = 255;
		}
		
		const water = inWater(x, y);
		if (water && oneIn(2)) {
			const rand_x = randInt(-5, 5);
			const rand_y = randInt(-5, -1);
			for(let i=rand_y; i > -5; i--) {
				for(let j=rand_x; j < 5; j++) {
					if (inBounds(x + j, y + i) && isEmpty(x + j, y + i)) {
						setParticle(BaseParticle.STEAM, x + j, y + i);
					}
				}
			}
			
			setParticle(BaseParticle.STEAM, x, y);
			removeParticle(water.x, water.y);
			
			return;
		}
		
		if (inBounds(x, y + 1) && !isEmpty(x, y + 1) && getParticle(x, y + 1).type != BaseParticle.WATER && getParticle(x, y + 1).type != BaseParticle.SMOKE) {
			this.velocity.y /= 2;
		}
		
		//randomly move this particle
		if (inBounds(x, y + 3) && !isEmpty(x, y + 3) && getParticle(x, y + 3).type == BaseParticle.FIRE && oneIn(100)) {
			moveParticle(this, x, y + 3);
			
			return;
		}
		
		//check fire spreading
		if (inBounds(x, y + 1) && !isEmpty(x, y + 1) && getParticle(x, y + 1).type == BaseParticle.FIRE && inBounds(x, y - 1) && isEmpty(x, y - 1)) {
			if (oneIn(10) && this.lifetime > 1 && this.lifetime < 10) {
				const rand1 = oneIn(2);
				const rand2 = randInt(-10, -1);
				
				for(let i=rand2; i < 0; i++) {
					const spread = 3;
					for(let j = (rand1 ? -spread : spread); (rand1 ? j < spread : j > -spread); (rand1 ? j++ : j--)) {
						const check_x = x + j;
						const check_y = y + i;
						
						if (inBounds(check_x, check_y) && isEmpty(check_x, check_y)) {
							moveParticle(this, check_x, check_y);
							break;
						}
					}
				}
			}
			
			return;
		}
		
		//spawn smoke
		for(let i=0; i<randInt(1, 10); i++) {
			if (oneIn(500)) {
				if (inBounds(x, y - 1) && isEmpty(x, y - 1)) {
					setParticle(BaseParticle.SMOKE, x, y - 1);
				}
				else if (inBounds(x + 1, y - 1) && isEmpty(x + 1, y - 1)) {
					setParticle(BaseParticle.SMOKE, x + 1, y - 1);
				}
				else if (inBounds(x - 1, y - 1) && isEmpty(x - 1, y - 1)) {
					setParticle(BaseParticle.SMOKE, x - 1, y - 1);
				}
			}
		}
		
		//spawn embers
		if (oneIn(250) && this.lifetime < 3) {
			for(let i=0; i<randInt(1, 100); i++) {
				let particle = null;
				if (inBounds(x, y - 1) && isEmpty(x, y - 1)) {
					particle = createParticle(BaseParticle.EMBER, x, y - 1);
				}
				else if (inBounds(x + 1, y - 1) && isEmpty(x + 1, y - 1)) {
					particle = createParticle(BaseParticle.EMBER, x + 1, y - 1);
				}
				else if (inBounds(x - 1, y - 1) && isEmpty(x - 1, y - 1)) {
					particle = createParticle(BaseParticle.EMBER, x - 1, y - 1);
				}
				
				if (particle) {
					particle.velocity = createVector(randInt(-5, 5) / 5, randInt(2, 10) / 10);
				}
			}
		}
		
		if (!this.checkFlammables(x, y) && inBounds(x, y - 1) && isEmpty(x, y - 1)) {
			if (oneIn(50)) {
				console.log("Removing fire: " + x + ", " + y);
				removeParticle(x, y);
				
				return;
			}
		}
		
		const vel_x = x + int(this.velocity.x);
		const vel_y = y + int(this.velocity.y);
		//console.log("Velocity: (" + vel_x + ", " + vel_y + ") - ", this.velocity);
		
		const vel_particle = getParticle(vel_x, vel_y);
		if (inBounds(vel_x, vel_y) && (!vel_particle || vel_particle.type == BaseParticle.FIRE || vel_particle.type == BaseParticle.SMOKE)) {
			swapParticles(x, y, vel_x, vel_y);
		}
		else {
			this.checkWater(x, y);
		}
	}
	
	checkFlammables(x, y) {
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
				if (check_particle && (check_particle.is_flammable && oneIn(int(check_particle.flammability / this.heat_power)))) {
					setParticle(BaseParticle.FIRE, check_x, check_y);
					if (oneIn(5)) {
						const rand = oneIn(2);
						for(let i=-3; i < 2; i++) {
							for(let j=(rand ? -3 : 2); (rand ? j < 2 : j > -3); (rand ? j++ : j--)) {
								const pos_x = x + j;
								const pos_y = y + i;
								if (inBounds(pos_x, pos_y) && isEmpty(pos_x, pos_y)) {
									this.lifetime += 0.1;
									//console.log(" Flammable Particle: (" + x + ", " + y + ") to (" + pos_x + ", " + pos_y + ")");
									moveParticle(this, pos_x, pos_y);
									break;
								}
							}
						}
					}
					
					return true;
				}
			}
		}
		
		return false;
	}
	
	checkWater(x, y) {
		const wood_chance = 100;
		const gunpowder_chance = 1;
		const oil_chance = 5;
		
		const positions = [
			{ x: -1, y:  1 },
			{ x:  0, y:  1 },
			{ x:  1, y:  1 },
			
			//{ x: -1, y:  0 },
			//{ x:  0, y:  0 },
			//{ x:  1, y:  0 },
			
			{ x: -1, y: -1 },
			{ x:  0, y: -1 },
			{ x:  1, y: -1 },
		];
		
		for(const position of positions) {
			const check_x = x + position.x;
			const check_y = y + position.y;
			
			if (inBounds(check_x, check_y)) {
				const check_particle = getParticle(check_x, check_y);
				if (!check_particle || check_particle.type == BaseParticle.WATER) {
					swapParticles(x, y, check_x, check_y);
					
					return true;
				}
			}
		}
		
		return false;
	}
}