(function(){
	var root = this;

	root.Game = function(options) {
		var gameEl = $('<div>')
			.addClass('sapper')
			.appendTo('body');
		this.options = { 
			el: gameEl,
			won: function() {
				gameEl.find('.notify').empty().html('You won!');
			},
			lost: function() {
				gameEl.find('.notify').empty().html('You lost!');
			}
		};
		$.extend( this.options, options );
		this.startTime = (new Date()).getTime();

		renderNotifyBlock();
		renderControlPanel();
		
		var field = new Field( this.options );
		var self = this;
		
		function renderNotifyBlock() {
			var gameNotify = $('<div>')
				.addClass('notify')
				.appendTo(gameEl);
		};
		
		function renderControlPanel() {
			var gamePanel = $('<div>')
				.addClass('control-panel')
				.appendTo(gameEl);
			var restartBtn = $('<div>')
				.html('Restart')
				.on('click', function () {
					gameEl.find('.notify').empty();
					field = new Field( self.options );
				})
				.appendTo(gamePanel);
		};
	};

	root.Field = function(options) {
		this.options = {
			el: $('body'),
			size: {x: 10, y: 10},
			complexity: 1,
			won: function(){},
			lost: function(){}
		};
		$.extend( this.options, options );

		var self = this;

		this.length = this.options.size.x * this.options.size.y;
		this.countMines = Math.ceil((this.options.complexity * 5 * this.length) / 100);
		this.getCellsAround = function(cells, pos){
			var around = [];
			var prevX = pos.x - 1;
			var nextX = pos.x + 1;
			var prevY = pos.y - 1;
			var nextY = pos.y + 1;
			if(cells[prevX] != undefined){
				around.push(cells[prevX][prevY]);
				around.push(cells[prevX][pos.y]);
				around.push(cells[prevX][nextY]);
			}
			around.push(cells[pos.x][prevY]);
			around.push(cells[pos.x][nextY]);
			if(cells[nextX] != undefined){
				around.push(cells[nextX][prevY]);
				around.push(cells[nextX][pos.y]);
				around.push(cells[nextX][nextY]);
			}
			var result = [];
			for (var i = 0; i < around.length; i++) {
				if(around[i] == undefined
					|| around[i].isOpen 
					|| around[i].isMark) {
					continue;
				}
				result.push(around[i]);
			}
			return result;
		};
		this.cells = generateField(this.countMines, this.options.size, this.doWave(this));
		this.render();
		
		function generateField(countMines, size, callback){
			var cells = [],
				mines = countMines
				options = { callback: callback };
			for (var x = 0; x < size.x; x++) {
				cells.push([]);
				for (var y = 0; y < size.y; y++) {
					options['position'] = {x: x, y: y};
					cells[x][y] = new Cell(options);
				}
			}
			while(mines) {
				var x = Math.random() * (size.x - 1) >> 0;
				var y = Math.random() * (size.y - 1) >> 0;
				if(!(cells[x][y] instanceof Mine)) {
					options['position'] = {x: x, y: y};
					cells[x][y] = new Mine(options);
					IncreaseNeighbourValue(options['position']);
					mines--;
				}
			}
			return cells;
			
			function IncreaseNeighbourValue(pos){
				var around = self.getCellsAround(cells, pos);
				for (var i = 0; i < around.length; i++) {
					around[i].value++;
				}
			};
		};
	};

	Field.prototype.render = function() {
		this.options.el.find('.field').empty();
		var self = this,
			wrapper = $('<div>')
				.addClass('field')
				.on('mouseup', function(e){
					e.preventDefault();
					var index = $(e.target).index();
					var x = (index / self.options.size.y) >> 0;
					var y = index - (x * self.options.size.y);
					var cell = self.cells[x][y];
					if(cell.isOpen) {
						return;
					}
					if(e.which == 3 && !cell.isMark) {
						cell.mark();
					} else {
						cell.open();
					}
				})
				.appendTo(this.options.el);

		for (var x = 0; x < this.options.size.x; x++) {
			for (var y = 0; y < this.options.size.y; y++) {
				this.cells[x][y].render(wrapper);
			}
			wrapper.css('width', wrapper.width());
		}
	};

	Field.prototype.doWave = function(context){
		var self = context;
		return function(obj) {
			if(obj === undefined){
				return;
			}
			
			if(obj instanceof Mine) {
				self.dispose();
				self.options.lost();
				return;
			} else {
				if(isComplete()) {
					self.dispose();
					self.options.won();
					return;
				} else if(obj.value == 0) {
					openCellsAround(obj.options.position);
				}
			}
			
			function openCellsAround(pos){
				var around = self.getCellsAround(self.cells, pos);
				for (var i = 0; i < around.length; i++) {
					if(!around[i].isOpen) {
						around[i].isOpen = true;
						around[i].render();
					}
					if(around[i].value == 0) {
						openCellsAround(around[i].options.position);
					}
				}
			}
			
			function isComplete() {
				for (var x = 0; x < self.options.size.x; x++) {
					for (var y = 0; y < self.options.size.y; y++) {
						if(self.cells[x][y] instanceof Mine) {
							continue;
						} else if(!self.cells[x][y].isOpen){
							return false;
						}
					}
				}
				return true;
			}
		};
	};
	
	Field.prototype.dispose = function(context){
		this.options.el.find('.field').off();
	};

	root.Cell = function (options) {
		this.value = 0;
		this.isMark = false;
		this.isOpen = false;
		this.options = {
			callback: function(){},
			position: {}
		};
		$.extend( this.options, options );
	};

	Cell.prototype.render = function(el) {
		if(this.el === undefined) {
			this.el = $('<div></div>')
				.addClass('cell');
		}
		
		if(el != undefined) {
			this.el.appendTo(el);
		}

		if(this.isMark){
			this.el.addClass('cell-flag')
				.empty().html('F');
		}

		if(this.isOpen){
			this.el.addClass('cell-open')
				.empty()
				.html((this.value == 0) ? '' : this.value);
		}
	};

	Cell.prototype.open = function(){
		this.isOpen = true;
		this.render();
		this.options.callback(this);
	};

	Cell.prototype.mark = function(){
		this.isMark = true;
		this.render();
	};

	root.Mine = function (options) {
		$.extend( this.options, options );
	};
	Mine.prototype = new Cell();

	Mine.prototype.render = function(el) {
		if(this.el === undefined) {
			this.el = $('<div></div>')
				.addClass('cell');
		}

		if(el != undefined) {
			this.el.appendTo(el);
		}

		if(this.isOpen){
			this.el
				.addClass('cell-bang')
				.empty()
				.html('*');
		}
	};
}).call(this);