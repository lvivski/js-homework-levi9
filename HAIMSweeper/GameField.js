
//Contains game field with all the cells and methods to update/draw them
function GameField(fieldX, fieldY, size, minesNumber, cellSize, context) {
    //TODO: check parameters
    this.fieldX = fieldX;
    this.fieldY = fieldY;
    this.size = size;
    this.cellSize = cellSize;
    this.map = [];
    this.minesNumber = minesNumber;
    this.context = context;

    this.state = GameState.Open;
    this.minesRemaining = minesNumber;
    this.score = 0;

    this.init = function() {
        for(var i = 0; i < this.size; i++) {
            var row = [];
            for(var j = 0; j < this.size; j++) {
                var cell = new Cell(i, j, this.cellSize, CellType.Empty);
                row.push(cell);
            }
            this.map.push(row);
        }

        this.seedMines();
    };

    //Seeds mines by changing cell type on the initialized map
    this.seedMines = function() {
        for(var i = 0; i < minesNumber; i++) {
            var mineX = Tools.getRandomInt(0, this.size - 1);
            var mineY = Tools.getRandomInt(0, this.size - 1);
            var cell = this.map[mineX][mineY];
            
            //Iterate till we find an empty, non-mined cell
            while (cell.type != CellType.Empty) {
                mineX = Tools.getRandomInt(0, this.size - 1);
                mineY = Tools.getRandomInt(0, this.size - 1);
                cell = this.map[mineX][mineY];
            }

            //Mine the found cell
            cell.type = CellType.Mined;

            //All the non-mined cells around this now will have their type set to Number and the number of mines around increased
            for(var k = -1; k <= 1; k++) {
                for(var p = -1; p <= 1; p++) {
                    //Check for undefined to skip empty space around the map edges
                    if(typeof this.map[mineX + k] != 'undefined' && typeof this.map[mineX + k][mineY + p] != 'undefined') {
                        if(this.map[mineX + k][mineY + p].type != CellType.Mined) {
                            this.map[mineX + k][mineY + p].type = CellType.Number;
                            this.map[mineX + k][mineY + p].minesAround += 1;
                        }
                    }
                }
            }
        }
    };

    this.onMouseLeft = function(x, y) {
        console.log('Left', x, y);

        if(this.map[x][y].state === CellState.Closed || this.map[x][y].state === CellState.Flagged) {
            this.openCell(this.map[x][y]);
        }

        if(this.checkWin()) {
            this.state = GameState.Won;
        }
    };

    this.onMouseRight = function(x, y) {
        console.log('Right', x, y);
        console.log(this.map[x][y].state);

        if(this.map[x][y].state === CellState.Closed || this.map[x][y].state === CellState.Flagged) {
            this.flagCell(this.map[x][y]);
        }

        if(this.checkWin()) {
            this.state = GameState.Won;
        }
    };

    //Opens the cell and performs actions depending on the cell type
    this.openCell = function(cell) {
        console.log('open');
        cell.state = CellState.Opened;
        if(cell.type === CellType.Mined) {
            this.state = GameState.Lost;
        } else {
            this.propagateOpen(cell);
        }
    }

    this.propagateOpen = function(cell) {
        for(var i = -1; i <= 1; i += 1) {
            for(var j = -1; j <= 1; j+= 1) {
                if(typeof this.map[cell.x + i] != 'undefined' && typeof this.map[cell.x + i][cell.y + j] != 'undefined') {
                    var neighbourCell =  this.map[cell.x + i][cell.y + j];
                    if(neighbourCell.type != CellType.Mined && neighbourCell.state != CellState.Opened) {
                        neighbourCell.state = CellState.Opened;

                        //Continue propagation for empty cells
                        if(neighbourCell.type === CellType.Empty) {
                            this.propagateOpen(neighbourCell);
                        }
                    }
                }
            }
        }
    }

    //Changes the cell state to flagged/closed
    this.flagCell = function(cell) {
        
        if(cell.state === CellState.Flagged) {
            cell.state = CellState.Closed;
            this.minesRemaining += 1;
        } else {
            cell.state = CellState.Flagged;
            this.minesRemaining -= 1;
        }
        
    };

    //Check if win condition is met: only mined cells are flagged
    //Returns true in case player has won the game
    this.checkWin = function() {
        var retValue = false;
        var flaggedCells = 0;

        this.score = 0; //reset score, we will recalculate it

        for (var i = 0; i < this.map.length; i++) {
            for (var j = 0; j < this.map[i].length; j++) {
                
                if(this.map[i][j].type === CellType.Mined && this.map[i][j].state === CellState.Flagged) {
                    flaggedCells += 1;
                    this.score += 10;
                } else if (this.map[i][j].type === CellType.Empty){
                    if(this.map[i][j].state === CellState.Opened) {
                        this.score += 1;
                    }
                } else {    //Number type
                    if(this.map[i][j].state === CellState.Number) {
                        this.score += this.map[i][j].minesAround;
                    }
                }


            }
        }

        if(flaggedCells == minesNumber) {
            retValue = true;
        }

        return retValue;
    }

    //Draws game field map and score/mines left
    this.draw = function() {
        this.context.clearRect(0,0,this.context.canvas.width,this.context.canvas.height);

        //Draw background
        var backgroundImage = new Image();
        backgroundImage.src = 'Back1.jpg';  //TODO: We now use only one image, it's not fun. Use some Google/Bing image search to get random HAIM images to improve player experience
        context.drawImage(backgroundImage, 0, 0);

        //Draw mines number in Open state and score in Won one
        if(this.state === GameState.Open) {
            context.fillText('Mines left: ' + this.minesRemaining, 0, 20);
        } else {
            context.fillText('Score: ' + this.score, 0, 20);
        }


        //Draw map
        for (var i = 0; i < this.map.length; i++) {
            for (var j = 0; j < this.map[i].length; j++) {
                if(this.state === GameState.Open) {
                    this.map[i][j].draw(this.context, this.fieldX, this.fieldY, CellDrawMode.Normal);
                } else {
                    this.map[i][j].draw(this.context, this.fieldX, this.fieldY, CellDrawMode.Reveal);
                }
                
            }
        }
    };
}