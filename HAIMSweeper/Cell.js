
//Game field cell
function Cell(x, y, size, type) {
    //TODO: validate parameters
    this.x = x;
    this.y = y;
    this.size = size;
    this.type = type;
    this.state = CellState.Closed;
    this.minesAround = 0;

    this.draw = function(context, offsetX, offsetY, mode) {
        var cellImage = new Image();

        if(this.state === CellState.Closed) {
            cellImage.src = 'Tile.png';
        } else if(this.state === CellState.Flagged) {
            cellImage.src = 'TileFlagged.png';
        }

        var imageX = this.x * this.size + offsetX;
        var imageY = this.y * this.size + offsetY;
        var numberX = this.x * this.size + this.size / 3 + offsetX;
        var numberY = this.y * this.size + this.size * 2 / 3 + offsetY;

        if(this.state != CellState.Opened) {
            //In the Normal mode, draw the closed tile. In Reveal mode, draw what's behind it (for the case of won/lost game)
            if(mode === CellDrawMode.Normal) {
                context.drawImage(cellImage, imageX, imageY);
            } else {
                if(this.type === CellType.Mined) {
                    cellImage.src = 'TileMined.png';
                    context.drawImage(cellImage, imageX, imageY);
                } else if(this.type === CellType.Number) {
                    context.fillText(this.minesAround, numberX, numberY);
                }
            }
        } else {
            if(this.type === CellType.Number) {
                context.fillText(this.minesAround, numberX, numberY);
            } else if(this.type === CellType.Mined) {
                cellImage.src = 'TileExploded.png';
                context.drawImage(cellImage, imageX, imageY);
            }
        }
        
    };
}