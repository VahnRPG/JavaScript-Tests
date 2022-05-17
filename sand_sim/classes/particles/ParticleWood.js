class ParticleWood extends BaseParticle {
	constructor(x, y) {
		super(x, y);
		
		this.type = BaseParticle.WOOD;
		this.color = this.getColor(0.23, 0.25, 0.15, 0.18, 0.02, 0.03);
		
		this.is_flammable = true;
		this.flammability = 200;
		
		this.is_meltable = true;
		this.meltabiliity = 100;
	}
}