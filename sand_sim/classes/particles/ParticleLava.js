class ParticleLava extends BaseParticle {
	constructor(x, y) {
		super(x, y);
		
		this.type = BaseParticle.LAVA;
		this.color = color(150, 20, 0);
		
		this.heat_power = 4;
		
		this.fall_rate = 4;
		this.spread_rate = 1;
	}
	
	update(delta, x, y) {
		if (this.was_updated) {
			return;
		}
		
		this.was_updated = true;
		
		if (randInt(int(this.lifetime * 100)) % 200 == 0) {
			switch(randInt(4)) {
				case 0:
					this.color = color(255, 80, 20);
					break;
				case 1:
					this.color = color(255, 10, 10);
					break;
				case 2:
					this.color = color(255, 50, 0);
					break;
				case 3:
					this.color = color(200, 50, 2);
					break;
			}
		}
		
		this.velocity.y = clamp(this.velocity.y + (gravity * delta), -gravity, gravity);
		
		const water = inWater(x, y);
		if (water && oneIn(2)) {
			const rand_x = randInt(-5, 5);
			const rand_y = randInt(-5, -1);
			for(let i=rand_x; i > -5; i--) {
				for(let j=rand_y; j < 5; j++) {
					if (inBounds(x + j, y + i) && isEmpty(x + j, y + i)) {
						setParticle(BaseParticle.STEAM, x + j, y + i);
					}
				}
			}
			
			setParticle(BaseParticle.STEAM, x, y);
			setParticle(BaseParticle.STONE, water.x, water.y);
			
			return;
		}
		
		if (inBounds(x, y + 1) && !isEmpty(x, y + 1) && getParticle(x, y + 1).type != BaseParticle.WATER && getParticle(x, y + 1).type != BaseParticle.SMOKE) {
			this.velocity.y /= 2;
		}
		
		if (!this.checkFlammables(x, y) && isEmpty(x, y - 1)) {
			if (oneIn(50)) {
				console.log("Removing fire: " + x + ", " + y);
				removeParticle(x, y);
				
				return;
			}
		}
		
		const vel_x = x + int(this.velocity.x);
		const vel_y = y + int(this.velocity.y);
		//console.log("Velocity: (" + vel_x + ", " + vel_y + ") - ", this.velocity);
		
		const spread = (oneIn(2) ? this.spread_rate : -this.spread_rate); 
		const spread_x = x + spread;
		const neg_spread_x = x - spread;
		const fall_y = y + this.fall_rate;
		
		if (inBounds(vel_x, vel_y) && isEmpty(vel_x, vel_y)) {
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
					if (inBounds(x - j, y + i) && isEmpty(x - j, y + i)) {
						moveParticle(this, x - j, y + i);
						break;
					}
					if (inBounds(x + j, y + i) && isEmpty(x + j, y + i)) {
						moveParticle(this, x + j, y + i);
						break;
					}
				}
			}
		}
	}
	
	checkFlammables(x, y) {
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
				if (check_particle && (check_particle.is_flammable && oneIn(int(check_particle.flammability / this.heat_power)))) {
					setParticle(BaseParticle.FIRE, check_x, check_y);
					if (oneIn(5)) {
						const rand = oneIn(2);
						for(let i=-3; i < 2; i++) {
							for(let j=(rand ? -3 : 2); (rand ? j < 2 : j > -3); (rand ? j++ : j--)) {
								const pos_x = x + j;
								const pos_y = y + i;
								if (isEmpty(pos_x, pos_y)) {
									this.lifetime += 0.1;
									//console.log(" Flammable Particle: (" + x + ", " + y + ") to (" + pos_x + ", " + pos_y + ")");
									setParticle(BaseParticle.FIRE, pos_x, pos_y);
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
}