var $fixture = $('#qunit-fixture');

test('game', function() {
	//act
	var game = new Game();

	//assert
	ok(game != undefined, 'create game');
});