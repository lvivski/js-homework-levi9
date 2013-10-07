
//Contains general help methods
function Tools() { }

//Returns random integer number between min and max values
Tools.getRandomInt = function(min, max) {
	return Math.floor(Math.random() * (max - min + 1)) + min;
}
