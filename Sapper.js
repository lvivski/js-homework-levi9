
var CellStates = {closed: {value:0}, opened: {value:1}, flagged: {value: 2}};
var CellTypes = {empty: {value:0}, mine: {value:1}, number: {value: 2}};

function Game(containerId, resultId) {
	this.container = document.getElementById(containerId);
	this.container.innerHTML = '';
	this.resultContainerId = resultId;
	this.HideResult();
	
	this.width = 10;
	this.height = 10;
	this.emptycells = this.width * this.height;
	this.minesToFind = 0;
	
	this.cells = new Array(this.height);
	for (i=0;i<this.height; i++) {
		this.cells[i] = new Array(this.width);
	}
	this.startedTime = Date.now();
} 

Game.prototype.CreateGame = function () {
	for (i=0;i<this.height; i++) {
		for (j=0;j<this.width; j++){
			var cell = new Cell(i,j, this);
			var randomNumber = Math.floor((Math.random()*100)+1); 
			var isMine = randomNumber <= 10;
			if (isMine) 
			{
				cell.type = CellTypes.mine;
				this.emptycells--;
				this.minesToFind++;
			};
			
			this.cells[i][j] = cell;
		}
	};
	
	this.CalcNumbers();
	this.RenderClosed();
};

Game.prototype.CalcNumbers = function() {
	for (var i = 0; i < this.height; i++) {
		for (var j = 0; j < this.width; j++) {
			var cell = this.cells[i][j];
			if (cell.type == CellTypes.mine) {
				for (var rIndex = -1; rIndex <= 1; rIndex++) {
					for (var cIndex = -1; cIndex <= 1; cIndex++) {
						var nearRow = cell.row + rIndex;
						var nearCol = cell.col + cIndex;
						if (nearRow < 0 || nearRow >= this.width || nearCol < 0
								|| nearCol >= this.height) {
							continue;
						}

						var nearCell = this.cells[nearRow][nearCol];
						if (nearCell.type != CellTypes.mine) {
							nearCell.number++;
							nearCell.type = CellTypes.number;
						}
					}
				}
			}
		}
	}
};


Game.prototype.RenderClosed = function () {
	for (i=0;i<this.height; i++) {
		var row = document.createElement('div');
		this.container.appendChild(row);
		for (j=0;j<this.width; j++){
			var cellObj = this.cells[i][j];
			cellObj.CreateView(row);
		}
	}
};

Game.prototype.OpenNearest = function (row, col) {
	for (var rIndex = -1; rIndex <= 1; rIndex++) {
		for (var cIndex = -1; cIndex <= 1; cIndex++) {
			var nearRow = row + rIndex;
			var nearCol = col + cIndex;
			if (nearRow < 0 || nearRow >= this.width || nearCol < 0
					|| nearCol >= this.height) {
				continue;
			}

			var nearCell = this.cells[nearRow][nearCol];
			if (nearCell.state == CellStates.closed) {
				nearCell.Click();
			}
		}
	}
};

Game.prototype.GameOver = function () {
	for (var i = 0; i < this.height; i++) {
		for (var j = 0; j < this.width; j++) {
			var cell = this.cells[i][j];
			cell.RenderCellOpened();
		}
	}
	this.ShowResult("Game over!");
};

Game.prototype.GameWin = function () {
	this.ShowResult("You won!");
};

Game.prototype.ShowResult = function (text) {
	var result = document.getElementById(this.resultContainerId);
	result.innerHTML = text + " time: " + GetTimeIntervalText(Date.now() - this.startedTime);
	result.style["display"] = "";
};

Game.prototype.HideResult = function () {
	var result = document.getElementById(this.resultContainerId);
	if (result != null) {
		result.style["display"] = "none";
	}
};

function Cell(r, c, game) {
	this.row = r;
	this.col = c;
	this.game = game;
	this.state = CellStates.closed; 
	this.type = CellTypes.empty;
	this.number = 0;
	this.view = null;
}

Cell.prototype.Click = function()
{
	if (this.state == CellStates.closed)
	{
		this.RenderCellOpened()
		
		if (this.type == CellTypes.mine) {
			this.game.GameOver();
		}
		else
		{
			this.game.emptycells--;
			if (this.game.emptycells == 0 && this.game.minesToFind == 0) {
				this.game.GameWin();
				return;
			}
			if (this.type == CellTypes.empty){
				this.game.OpenNearest(this.row, this.col);
			}
		}
	}
};

Cell.prototype.RightClick = function(event)
{
	event.preventDefault();
	if (this.state == CellStates.flagged) {
		this.view.innerHTML = "&nbsp;";
		this.view.setAttribute('class', 'cell closed');
		this.state = CellStates.closed;
		if (this.type == CellTypes.mine){
			this.game.minesToFind++;
		}
	} else {
		this.view.innerHTML = "♦";
		this.view.setAttribute('class', 'cell closed flag');
		this.state = CellStates.flagged;
		if (this.type == CellTypes.mine){
			this.game.minesToFind--;
		}
		
		if (this.game.emptycells == 0 && this.game.minesToFind == 0) {
			this.game.GameWin();
		}
	}
};

Cell.prototype.CreateView = function (container) {
	var cell = document.createElement('div');
	var symbol = '&nbsp;';
	cell.innerHTML = symbol;
	cell.setAttribute('class', 'cell closed');
	var cellObject = this;
	cellObject.view = cell;
	cell.onclick = function() { Cell.prototype.Click.call(cellObject);};
	cell.oncontextmenu = function(e) { Cell.prototype.RightClick.call(cellObject, e);};
	container.appendChild(cell);
};

Cell.prototype.RenderCellOpened = function () {
	this.state = CellStates.opened;
	var symbol = '&nbsp;';
	if (this.type == CellTypes.mine) {
		symbol = '☻';
	} else if (this.type == CellTypes.number) {
		symbol = this.number;
	}
	
	this.view.innerHTML = symbol;
	this.view.setAttribute('class', 'cell');
};

function GetTimeIntervalText(milliseconds){
	if (milliseconds == 'undefined') {
		return 'not calculated';
	}
	
	var result = '';
	var min = Math.round(milliseconds / 1000 / 60);
	if (min > 0) {
		result = min + " min";
	}
	var sec = Math.round((milliseconds - min * 1000 * 60) / 1000);
	return result + " " + sec + "sec";
}

