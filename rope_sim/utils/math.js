const inside_circle = (x, y, width, height, radius) => {
	return ((Math.pow(x - width, 2) + Math.pow(y - height, 2)) < Math.pow(radius, 2));
}

const euclidean_dist = (point1, point2) => {
	return Math.sqrt(Math.pow(point1.x - point2.x, 2) + Math.pow(point1.y - point2.y, 2));
}

const manhattan_dist = (point1, point2) => {
	return Math.abs(point1.x - point2.x) + Math.abs(point1.y - point2.y);
}

const clamp = (value, min_value, max_value) => {
	if (value < min_value) {
		return min_value;
	}
	else if (value > max_value) {
		return max_value;
	}
	
	return value;
}