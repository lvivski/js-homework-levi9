var $fixture = $('#qunit-fixture');

test('field', function() {
	//act
	var field = new Field();

	//assert
	ok(field != undefined, 'create field');
});

test('field fields', function() {
	//act
	var field = new Field();

	//assert
	ok(field.options != undefined, 'public options field');
	ok(field.options.el != undefined, 'el options exist');
	ok(field.options.size != undefined, 'size options exist');
	ok(field.options.complexity != undefined, 'complexity options exist');
	ok(field.options.won != undefined, 'won callback exist');
	ok(field.options.lost != undefined, 'lost callback exist');
});

test('field default options', function() {
	//act
	var field = new Field();

	//assert
	ok(field.options.el.selector == 'body', 'default element is correct');
	ok(field.options.size.x == 10, 'default X size is correct');
	ok(field.options.size.y == 10, 'default Y size is correct');
	ok(field.options.complexity == 1, 'default complexity is correct');
});

test('field changin options', function() {
	//act
	var field = new Field({size: {x: 4, y: 4}, complexity: 2});

	//assert
	ok(field.options.size.x == 4, 'change X size is correct');
	ok(field.options.size.y == 4, 'change Y size is correct');
	ok(field.options.complexity == 2, 'change complexity is correct');
});

test('field length calculation', function(){
	//arrange
	var sizeX = 4,
		sizeY = 4;
	var length = sizeX * sizeY;

	//act
	var field = new Field({size: {x: sizeX, y: sizeY}});

	//assert
	ok(field.length == length, 'length is correct');
});

test('field count of mines calculation', function(){
	//arrange
	var sizeX = 4,
		sizeY = 4;

	//act
	var field1 = new Field({size: {x: sizeX, y: sizeY}, complexity: 1});
	var field2 = new Field({size: {x: sizeX, y: sizeY}, complexity: 2});
	var field3 = new Field({size: {x: sizeX, y: sizeY}, complexity: 3});

	//assert
	ok(field1.countMines == 1, 'amount mines is correct');
	ok(field2.countMines == 2, 'amount mines is correct');
	ok(field3.countMines == 3, 'amount mines is correct');
});

test('field check fill', function(){
	//arrange
	var mines = 0;

	//act
	var field = new Field({size: {x: 4, y: 4}, complexity: 3});
	
	for (var x = 0; x < field.options.size.x; x++) {
		for(var y = 0; y < field.options.size.x; y++) {
			if(field.cells[x][y] instanceof Mine) {
				mines++;
			}
		}
	}
	
	//assert
	ok(mines == field.countMines, 'amount mines is correct');
});

test('field has correct cells', function(){
	//act
	var field = new Field({size: {x: 4, y: 4}, complexity: 3});
	
	//assert
	for (var x = 0; x < field.options.size.x; x++) {
		for(var y = 0; y < field.options.size.x; y++) {
			ok(field.cells[x][y] instanceof Cell, 'cell has correct object');
		}
	}
});

test('field cells have correct value', function(){
	//act
	var field = new Field({size: {x: 4, y: 4}, complexity: 6});
	
	//assert
	for (var x = 0; x < field.options.size.x; x++) {
		for(var y = 0; y < field.options.size.x; y++) {
			if(field.cells[x][y] instanceof Mine){
				continue;
			}
			ok(field.cells[x][y].value == GetValueAround(field, {x: x, y: y}), 'cell value is correct');
		}
	}
	
	function GetValueAround(obj, pos){
		var value = 0;
		if(obj.cells[pos.x - 1] != undefined) {
			if(obj.cells[pos.x - 1][pos.y - 1] instanceof Mine) {
				value++;
			}
			if(obj.cells[pos.x - 1][pos.y] instanceof Mine) {
				value++;
			}
			if(obj.cells[pos.x - 1][pos.y + 1] instanceof Mine) {
				value++;
			}
		}
		if(obj.cells[pos.x][pos.y - 1] instanceof Mine) {
			value++;
		}
		if(obj.cells[pos.x][pos.y + 1] instanceof Mine) {
			value++;
		}
		if(obj.cells[pos.x + 1] != undefined) {
			if(obj.cells[pos.x + 1][pos.y - 1] instanceof Mine) {
				value++;
			}
			if(obj.cells[pos.x + 1][pos.y] instanceof Mine) {
				value++;
			}
			if(obj.cells[pos.x + 1][pos.y + 1] instanceof Mine) {
				value++;
			}
		}

		return value;
	}
});