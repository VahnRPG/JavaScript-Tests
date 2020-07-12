const randFloat = (minimum, maximum=null) => {
	if (maximum == null) {
		maximum = minimum;
		minimum = 0.0;
	}
	
	return random(minimum, maximum);
}

const randInt = (minimum, maximum=null) => {
	if (maximum == null) {
		maximum = minimum;
		minimum = 0;
	}
	
	return int(random(minimum, maximum));
}

const randIncl = (minimum, maximum=null) => {
	if (maximum == null) {
		maximum = minimum;
		minimum = 0;
	}
	maximum++;
	
	return int(random(minimum, maximum));
}

const oneIn = (chance) => (randInt(chance) == 0);
const inPercent = (chance) => (randInt(100) < chance);