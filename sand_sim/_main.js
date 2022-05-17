let canvas = null;
let gravity = 10;
let start_time = 0;
let elapsed_time = 0;

const width = 100;
const height = 100;

let particles = [];
let current_particle = null;
const max_particle = 12;

let bg_color = null;

function setup() {
	start_time = millis();
	canvas = createCanvas(width, height);
	bg_color = color(240);
	background(bg_color);
	frameRate(60);
	
	for(let y=0; y<height; y++) {
		particles[y] = [];
		for(let x=0; x<width; x++) {
			particles[y][x] = null;
			//*
			if (oneIn(2) && y > (height / 2)) {
				//createParticle(BaseParticle.WATER, x, y);
				//createParticle(BaseParticle.OIL, x, y);
				//createParticle(BaseParticle.GUNPOWDER, x, y);
				//createParticle(BaseParticle.WOOD, x, y);
			}
			//*/
			/*
			if (oneIn(2) && y > (height / 2)) {
				switch(randInt(4)) {
					case 0:
						createParticle(BaseParticle.WOOD, x, y);
						break;
					case 1:
						createParticle(BaseParticle.STONE, x, y);
						break;
					case 2:
						createParticle(BaseParticle.SAND, x, y);
						break;
					case 3:
						createParticle(BaseParticle.SALT, x, y);
						break;
				}
			}
			//*/
			if (oneIn(20) && y > (height / 2)) {
				//createParticle(randInt(max_particle), x, y);
			}
		}
	}
	
	current_particle = BaseParticle.SALT;
}

function keyPressed() {
	if (keyCode === ESCAPE) {
		console.log("Stopping!");
		let data = [];
		for(let y=0; y<height; y++) {
			data[y] = [];
			for(let x=0; x<width; x++) {
				const particle = particles[y][x];
				data[y][x] = particle ? particle.id : 0;
			}
		}
		console.log("Here: ", JSON.stringify(data));
		noLoop();
		
		return;
	}
	else if (keyCode === 80) {
		saveCanvas(canvas, "sand-sim", "png");
		
		return;
	}
	
	if (current_particle === null && (keyCode === LEFT_ARROW || keyCode === RIGHT_ARROW)) {
		console.log("Init particle");
		current_particle = 1;
	}
	//*
	else if (keyCode === LEFT_ARROW) {
		current_particle--;
	}
	else if (keyCode === RIGHT_ARROW) {
		current_particle++;
	}
	
	if (current_particle < 1) {
		current_particle = max_particle;
	}
	else if (current_particle > max_particle) {
		current_particle = 1;
	}
	//*/
}

let created = 0;
function update() {
	elapsed_time = millis() - start_time;
	const delta = deltaTime / 1000;
	
	if (mouseIsPressed === true && current_particle !== null && created < 5000) {
		if (setParticle(current_particle, mouseX, mouseY)) {
			created++;
			//console.log("Created particle: " + mouseX + ", " + mouseY);
			//created = true;
		}
	}
	
	const run = (frameCount % 2 == 0 ? 0 : 1);
	
	for(let y=height - 1; y > 0; y--) {
		for(let x=width - 1; x > 0; x--) {
			const particle = particles[y][x];
			if (!particle) {
				continue;
			}
			
			particle.lifetime += delta;
			particle.update(delta, x, y);
		}
	}
	
	for(let y=height - 1; y > 0; y--) {
		for(let x=width - 1; x > 0; x--) {
			const particle = particles[y][x];
			if (!particle) {
				continue;
			}
			
			particle.was_updated = false;
		}
	}
}

function draw() {
	update();
	
	background(bg_color);
	
	let count = 0;
	for(let y=0; y<height; y++) {
		for(let x=0; x<width; x++) {
			const particle = particles[y][x];
			if (!particle) {
				continue;
			}
			
			particle.draw(x, y);
			count++;
		}
	}
	
	const text_size = 12;
	textSize(text_size);
	fill(0);
	if (created > 0) {
		text("Created: " + created, 0, text_size * 1);
	}
	if (count > 0) {
		text("Particles: " + count, 0, text_size * 2);
	}
	
	/*
	if (count > created * 10) {
		text("Error: ", 0, text_size * 3);
		let data = [];
		for(let y=0; y<height; y++) {
			data[y] = [];
			for(let x=0; x<width; x++) {
				const particle = particles[y][x];
				data[y][x] = particle ? particle.id : "-";
				if (!particle) {
					continue;
				}
				else if (!particle.checkPosition(x, y)) {
					//console.log("Here (" + particle.id + " - " + particle.type + "): " + x + ", " + y + " -> " + particle.x + ", " + particle.y);
				}
			}
		}
		//console.log("Here: ", JSON.stringify(data));
		noLoop();
	}
	//*/
}

function inBounds(x, y) {
	if (x < 0 || y < 0 || x > width - 1 || y > height - 1) {
		return false;
	}
	
	return true;
}

function isEmpty(x, y) {
	return inBounds(x, y) && !getParticle(x, y);
}

const positions = [
	{ x:  0, y:  0 },
	{ x:  0, y: -1 },
	{ x:  0, y:  1 },
	
	{ x: -1, y:  0 },
	{ x: -1, y: -1 },
	{ x: -1, y:  1 },
	
	{ x:  1, y:  0 },
	{ x:  1, y: -1 },
	{ x:  1, y:  1 },
];
function inLiquid(x, y, check_water=false) {
	for(const position of positions) {
		const check_x = x + position.x;
		const check_y = y + position.y;
		
		if (inBounds(check_x, check_y)) {
			const check_particle = getParticle(check_x, check_y);
			if (check_particle && check_particle.is_liquid) {
				if (!check_water || check_particle.type == BaseParticle.WATER) {
					return { x: check_x, y: check_y };
				}
			}
		}
	}
	
	return null;
}
function inWater(x, y) {
	return inLiquid(x, y, true);
}
function isSurrounded(x, y) {
	for(const position of positions) {
		if (position.x == 0 && position.y == 0) {
			continue;
		}
		
		const check_x = x + position.x;
		const check_y = y + position.y;
		
		if (inBounds(check_x, check_y) && !isEmpty(check_x, check_y)) {
			return false;
		}
	}
	
	return true;
}

function swapParticles(x_a, y_a, x_b, y_b) {
	let particle_a = getParticle(x_a, y_a);
	let particle_b = getParticle(x_b, y_b);
	
	if (particle_a) {
		moveParticle(particle_a, x_b, y_b);
	}
	if (particle_b) {
		moveParticle(particle_b, x_a, y_a);
	}
}

function moveParticle(particle, to_x, to_y) {
	if (!inBounds(to_x, to_y) || (particle.x == to_x && particle.y == to_y)) {
		return false;
	}
	
	removeParticle(particle.x, particle.y);
	
	//console.log(" Moving Particle: (" + particle.id + ") (" + particle.x + ", " + particle.y + ") to (" + to_x + ", " + to_y + ")");
	particle.setPosition(to_x, to_y);
	particles[to_y][to_x] = particle;
	///console.log("  Old location: ", particles[y][x].id);
	//console.log("   New location: ", particles[to_y][to_x].id);
	
	return true;
}

function removeParticle(x, y) {
	if (!inBounds(x, y)) {
		return false;
	}
	
	//console.log(" Removing Particle: (" + x + ", " + y + ") to (" + to_x + ", " + to_y + ")");
	particles[y][x] = null;
	
	return true;
}

function getParticle(x, y) {
	if (inBounds(x, y)) {
		return particles[y][x];
	}
	
	return null;
}

function createParticle(particle_id, x, y) {
	if (setParticle(particle_id, x, y)) {
		return particles[y][x];
	}
	
	return null;
}

function setParticle(particle_id, x, y) {
	//console.log("Particle (" + particle_id + "): " + x + ", " + y);
	if (!inBounds(x, y) || !isEmpty(x, y)) {
		return false;
	}
	
	let particle;
	switch (particle_id) {
		case BaseParticle.ACID:
			particle = new ParticleAcid(x, y);
			break;
		case BaseParticle.EMBER:
			particle = new ParticleEmber(x, y);
			break;
		case BaseParticle.FIRE:
			particle = new ParticleFire(x, y);
			break;
		case BaseParticle.GUNPOWDER:
			particle = new ParticleGunPowder(x, y);
			break;
		case BaseParticle.LAVA:
			particle = new ParticleLava(x, y);
			break;
		case BaseParticle.OIL:
			particle = new ParticleOil(x, y);
			break;
		case BaseParticle.SALT:
			particle = new ParticleSalt(x, y);
			break;
		case BaseParticle.SAND:
			particle = new ParticleSand(x, y);
			break;
		case BaseParticle.SMOKE:
			particle = new ParticleSmoke(x, y);
			break;
		case BaseParticle.STEAM:
			particle = new ParticleSteam(x, y);
			break;
		case BaseParticle.STONE:
			particle = new ParticleStone(x, y);
			break;
		case BaseParticle.WATER:
			particle = new ParticleWater(x, y);
			break;
		case BaseParticle.WOOD:
			particle = new ParticleWood(x, y);
			break;
	}
	
	particles[y][x] = particle;
	
	return true;
}