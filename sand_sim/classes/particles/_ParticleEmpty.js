class ParticleEmpty extends BaseParticle {
	constructor(x, y) {
		super(x, y);
		
		this.type = BaseParticle.EMPTY;
		this.color = color(255);
	}
	
	update(delta, x, y) {
	}
	
	draw(x, y) {
	}
}