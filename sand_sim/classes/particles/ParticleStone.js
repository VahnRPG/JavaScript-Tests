class ParticleStone extends BaseParticle {
	constructor(x, y) {
		super(x, y);
		
		this.type = BaseParticle.STONE;
		this.color = this.getColor(0.5, 0.65, 0.5, 0.65, 0.5, 0.65);
		
		this.is_meltable = true;
		this.meltabiliity = 300;
	}
}