class BaseParticle {
	static EMPTY = 0;
	//solids
	static STONE = 1;
	static WOOD = 2;
	//gritty
	static GUNPOWDER = 3;
	static SALT = 4;
	static SAND = 5;
	//liquids
	static OIL = 6;
	static WATER = 7;
	//spawners
	static ACID = 8;
	static FIRE = 9;
	static LAVA = 10;
	//spawned
	static EMBER = 11;
	static SMOKE = 12;
	static STEAM = 13;
	
	//-------------------------------------------------------------------------
	
	static SAND_COLOR = { r: 150, g: 100, b: 50 };
	static SALT_COLOR = { r: 200, g: 180, b: 190 };
	static WATER_COLOR = { r: 20, g: 100, b: 170 };
	static STONE_COLOR = { r: 120, g: 110, b: 120 };
	static WOOD_COLOR = { r: 60, g: 40, b: 20 };
	static FIRE_COLOR = { r: 150, g: 20, b: 0 };
	static SMOKE_COLOR = { r: 50, g: 50, b: 50 };
	static EMBER_COLOR = { r: 200, g: 120, b: 20 };
	static STEAM_COLOR = { r: 220, g: 220, b: 250 };
	static GUNPOWDER_COLOR = { r: 60, g: 60, b: 60 };
	static OIL_COLOR = { r: 80, g: 70, b: 60 };
	static LAVA_COLOR = { r: 200, g: 50, b: 0 };
	static ACID_COLOR = { r: 90, g: 200, b: 60 };
	
	//-------------------------------------------------------------------------
	
	static LAST_ID = -1;
	
	constructor(x, y) {
		this.id = ++BaseParticle.LAST_ID;
		//console.log("ID: " + this.id);
		this.type = BaseParticle.NONE;
		this.x = x;
		this.y = y;
		
		this.color = null;
		this.parse_color = null;
		this.lifetime = 0;
		
		this.is_liquid = false;
		
		this.is_flammable = false;
		this.flammability = 10000;
		this.heat_power = 1;
		
		this.is_meltable = false;
		this.meltabiliity = 10000;
		this.melt_power = 1;
		
		this.fall_rate = 0;
		this.spread_rate = 0;
		
		this.velocity = createVector(randInt(-1, 1), randInt(-2, 5));
		this.velocity = createVector(0, 0);
		
		this.was_updated = false;
	}
	
	update(delta, x, y) {
	}
	
	draw(x, y) {
		fill(this.color);
		noStroke();
		rect(x, y, 1, 1);
	}
	
	setPosition(x, y) {
		this.x = x;
		this.y = y;
	}
	
	checkPosition(x, y) {
		return (x == this.x && y == this.y);
	}
		
	getColor(r_s, r_e, g_s, g_e, b_s, b_e) {
		const rand = randFloat(0, 1) / 2;
		const r = int(lerp(r_s, r_e, rand) * 255);
		const g = int(lerp(g_s, g_e, rand) * 255);
		const b = int(lerp(b_s, b_e, rand) * 255);
		
		return color(r, g, b);
	}
}