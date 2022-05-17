const NORTH = 1;
const EAST = 2;
const SOUTH = 4;
const WEST = 8;

const DIRECTIONS = [
	NORTH,
	EAST,
	SOUTH,
	WEST,
];

const turnAround = (dir) => {
	if (dir == NORTH) {
		return SOUTH;
	}
	else if (dir == EAST) {
		return WEST;
	}
	else if (dir == SOUTH) {
		return NORTH;
	}
	else if (dir == WEST) {
		return EAST;
	}
}