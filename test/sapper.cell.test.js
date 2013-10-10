var $fixture = $('#qunit-fixture');

test('cell', function() {
	//act
	var cell = new Cell();
	
	//assert
	ok(cell != undefined, 'create cell');
});

test('cell fields', function() {
	//act
	var cell = new Cell(0);
	
	//assert
	ok(cell.value == 0, 'public value field');
	ok(cell.isMark == false, 'public isFlag field');
	ok(cell.isOpen == false, 'public isOpen field');
	ok(cell.options != undefined, 'public options field');
	ok(cell.options.callback != undefined, 'callback option exist');
	ok(cell.options.position != undefined, 'position option exist');
});

test('cell init options', function() {
	//arrange
	var pos = {x: 3, y: 54};
	
	//act
	var cell = new Cell({ position: pos });
	
	//assert
	ok(cell.options.position == pos, 'position is correct');
});

test('cell render function', function() {
	//act
	var cell = new Cell();
	
	//assert
	ok(cell.render != undefined, 'render exist');
	ok(typeof cell.render == 'function', 'render is function');
});

test('cell exec render', function(){
	//arrange
	var cell = new Cell();
	
	//act
	cell.render($fixture);
	
	//assert
	ok(cell.el != undefined, 'create element');
	equal($('div', $fixture).length, 1, 'render cell');
	var cellEl = $('div', $fixture ).first();
	ok(cellEl.hasClass('cell'), 'cell has default class');
	equal(cellEl.children().length, 0, 'cell should be empty');
});

test('cell render marked', function(){
	//arrange
	var cell = new Cell();
	
	//act
	cell.isMark = true;
	cell.render($fixture);
	
	//assert
	var cellEl = $('div', $fixture ).first();
	ok(cellEl.hasClass('cell-flag'), 'cell has flag class');
	ok(cellEl.html() == 'F', 'cell has flag markup');
});

test('cell render opened', function(){
	//arrange
	var cell = new Cell();
	
	//act
	cell.isOpen = true;
	cell.value = 2;
	cell.render($fixture);
	
	//assert
	var cellEl = $('div', $fixture ).first();
	ok(cellEl.hasClass('cell-open'), 'cell has open class');
	ok(cellEl.html() == cell.value, 'cell has open markup');
});

test('cell render opened empty cell', function(){
	//arrange
	var cell = new Cell();
	
	//act
	cell.isOpen = true;
	cell.value = 0;
	cell.render($fixture);
	
	//assert
	var cellEl = $('div', $fixture ).first();
	ok(cellEl.hasClass('cell-open'), 'cell has open class');
	ok(cellEl.html() == '', 'cell has not html');
});

test('cell open function', function(){
	//act
	var cell = new Cell();
	
	//assert
	ok(cell.open != undefined, 'open exist');
	ok(typeof cell.open == 'function', 'open is function');
});

test('cell open flag after call', function(){
	//arrange
	var cell = new Cell();
	
	//act
	cell.open();
	
	//assert
	ok(cell.isOpen == true, 'open flag exist');
});

test('cell call render after open', function(){
	//arrange
	var cell = new FakeCell();
	
	//act
	cell.open();
	
	//assert
	ok(cell.el[0].outerHTML == '<test></test>', 'call render after open');
});

test('cell call callback after open', function(){
	//arrange
	var val = 0;
	var obj;
	var cell = new Cell({ callback: testOpen });
	
	//act
	cell.open();
	
	//assert
	ok(val == 1, 'count calls of callback correct');
	ok(obj instanceof Cell, 'object is correct');
	
	function testOpen(xx){
		val += 1;
		obj = xx;
	}
});

test('cell mark function', function(){
	//act
	var cell = new Cell();
	
	//assert
	ok(cell.mark != undefined, 'mark exist');
	ok(typeof cell.mark == 'function', 'mark is function');
});

test('cell mark flag after call', function(){
	//arrange
	var cell = new Cell();
	
	//act
	cell.mark();
	
	//assert
	ok(cell.isMark == true, 'mark flag exist');
});

test('cell call render after mark', function(){
	//arrange
	var cell = new FakeCell();
	
	//act
	cell.mark();
	
	//assert
	ok(cell.el[0].outerHTML == '<test></test>', 'call render after mark');
});

test('cell mine', function() {
	//act
	var mine = new Mine();
	
	//assert
	ok(mine != undefined, 'create mine');
});

test('cell mine inherits', function() {
	//act
	var mine = new Mine();
	
	//assert
	ok(mine instanceof Cell, 'instance of cell');
});

test('cell call callback after open', function(){
	//arrange
	var val = 0;
	var obj;
	var cell = new Mine({ callback: testOpen });
	
	//act
	cell.open();
	
	//assert
	ok(val == 1, 'count calls of callback correct');
	ok(obj instanceof Mine, 'object is correct');
	
	function testOpen(xx){
		val += 1;
		obj = xx;
	}
});

test('cell mine render opened', function(){
	//arrange
	var cell = new Mine();
	
	//act
	cell.isOpen = true;
	cell.render($fixture);
	
	//assert
	var cellEl = $('div', $fixture ).first();
	ok(cellEl.hasClass('cell-bang'), 'cell has open class');
});

//fake cell for testing
function FakeCell(){
}
FakeCell.prototype = new Cell();

FakeCell.prototype.render = function(){
	this.el = $('<test></test>');
}
//fake cell for testing