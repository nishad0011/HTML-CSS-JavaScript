class Grid {
    constructor(col_count, row_count, canvasWidth, canvasHeight) {
        this.colCount = col_count;
        this.rowCount = row_count;
        this.canvasWidth = canvasWidth;
        this.canvasHeight = canvasHeight;

        this.allCells = [];
        this.openSet = [];
        this.closedSet = [];

        this.start = null;
        this.end = null;
        this.currentCell = null;

        if (this.colCount >= this.rowCount) {
            this.cellWidth = Math.min(this.canvasWidth / this.colCount, 20);
            this.cellHeight = this.cellWidth;
        } else {
            this.cellHeight = Math.min(this.canvasHeight / this.rowCount, 20);
            this.cellWidth = this.cellHeight;
        }

    }
    createCells() {
        for (let i = 0; i < this.colCount; i++) {
            let tempList = [];
            for (let j = 0; j < this.rowCount; j++) {
                let x = this.cellWidth * i;
                let y = this.cellHeight * j;
                let colIndex = i;
                let rowIndex = j;
                tempList[j] = new Cell(x, y, colIndex, rowIndex, this);
            }
            this.allCells[i] = tempList;
        }
    }
    draw(ctx) {
        ctx.fillStyle = "#6E6E6E";
        ctx.rect(0, 0, 500, 500);
        ctx.fill();
        ctx.restore();
        ctx.beginPath();
        ctx.strokeStyle = "black";
        for (let i = 0; i < grid.colCount; i++) {
            for (let j = 0; j < grid.rowCount; j++) {
                ctx.beginPath();
                //console.log(this.allCells[i][j].color);
                ctx.fillStyle = String(this.allCells[i][j].color);
                ctx.rect(
                    this.allCells[i][j].x,
                    this.allCells[i][j].y,
                    this.cellWidth,
                    this.cellHeight
                );
                ctx.fill();
                ctx.stroke();
            }
        }
    }

    initStartEnd(s, e) {
        this.end = this.allCells[e[0]][e[1]];
        this.end.h = 0;
        this.end.color = "blue";
        this.end.isWall = false;
        this.end.type = "end";

        this.start = this.allCells[s[0]][s[1]];
        this.start.g = 0;
        this.start.color = "red";
        this.start.h = getH(this, this.start);
        this.start.isWall = false;
        this.start.type = "start";

    }

}

class Cell {
    constructor(x, y, colIndex, rowIndex, grid) {
        this.x = x;
        this.y = y;
        this.colIndex = colIndex;
        this.rowIndex = rowIndex;
        this.isWall = (Math.random() * 100 < 10 ? true : false);
        if (this.isWall) {
            this.type = "wall";
            this.color = "black";
        } else {
            this.type = "blank";
            this.color = "white";
        }

        this.previous = null;
        this.neighbours = [];
        this.g = 100000;
        this.h = 100000;
        this.f = this.g + this.h;
    }

    getNeighbors(grid, prevG, previousNode, useDiagonals) {
        //top,bottom,left,right
        if (this.colIndex + 1 < grid.colCount) {
            let cell1 = grid.allCells[this.colIndex + 1][this.rowIndex];
            if (prevG + 1 < cell1.g) {
                cell1.g = prevG + 1;
                cell1.h = getH(grid, cell1);
                cell1.f = cell1.g + cell1.h;
                cell1.previous = previousNode;
            }
            this.neighbours.push(cell1);
        }
        if (this.rowIndex + 1 < grid.rowCount) {
            let cell2 = grid.allCells[this.colIndex][this.rowIndex + 1];
            if (prevG + 1 < cell2.g) {
                cell2.g = prevG + 1;
                cell2.h = getH(grid, cell2);
                cell2.f = cell2.g + cell2.h;
                cell2.previous = previousNode;
            }
            this.neighbours.push(cell2);
        }
        if (this.colIndex - 1 >= 0) {
            let cell3 = grid.allCells[this.colIndex - 1][this.rowIndex];
            if (prevG + 1 < cell3.g) {
                cell3.g = prevG + 1;
                cell3.h = getH(grid, cell3);
                cell3.f = cell3.g + cell3.h;
                cell3.previous = previousNode;
            }
            this.neighbours.push(cell3);
        }
        if (this.rowIndex - 1 >= 0) {
            let cell4 = grid.allCells[this.colIndex][this.rowIndex - 1];
            if (prevG + 1 < cell4.g) {
                cell4.g = prevG + 1;
                cell4.h = getH(grid, cell4);
                cell4.f = cell4.g + cell4.h;
                cell4.previous = previousNode;
            }
            this.neighbours.push(cell4);
        }

        //Diagonals
        if (this.rowIndex - 1 >= 0 && this.colIndex + 1 < grid.colCount) {
            let c = grid.allCells[this.colIndex + 1][this.rowIndex - 1];
            if (prevG + 1.4 < c.g) {
                c.g = prevG + 1.4;
                c.h = getH(grid, c);
                c.f = c.g + c.h;
                c.previous = previousNode;
            }
            this.neighbours.push(c);
        }
        if (this.rowIndex + 1 < grid.rowCount && this.colIndex + 1 < grid.colCount) {
            let c = grid.allCells[this.colIndex + 1][this.rowIndex + 1];
            if (prevG + 1.4 < c.g) {
                c.g = prevG + 1.4;
                c.h = getH(grid, c);
                c.f = c.g + c.h;
                c.previous = previousNode;
            }
            this.neighbours.push(c);
        }
        if (this.rowIndex - 1 >= 0 && this.colIndex - 1 >= 0) {
            let c = grid.allCells[this.colIndex - 1][this.rowIndex - 1];
            if (prevG + 1.4 < c.g) {
                c.g = prevG + 1.4;
                c.h = getH(grid, c);
                c.f = c.g + c.h;
                c.previous = previousNode;
            }
            this.neighbours.push(c);
        }
        if (this.rowIndex + 1 < grid.rowCount && this.colIndex - 1 >= 0) {
            let c = grid.allCells[this.colIndex - 1][this.rowIndex + 1];
            if (prevG + 1.4 < c.g) {
                c.g = prevG + 1.4;
                c.h = getH(grid, c);
                c.f = c.g + c.h;
                c.previous = previousNode;
            }
            this.neighbours.push(c);
        }
        this.neighbours = this.neighbours.filter(isTraversable);
        // let temp = this.neighbours.filter(isTraversable);
        // console.log(temp);
    }

}

function isTraversable(cell) {
    if (!cell.isWall) {
        return true;
    } else { return false }
}

function getH(grid, cell) {
    endRowIndex = grid.end.rowIndex;
    endColIndex = grid.end.colIndex;
    cellCol = cell.colIndex;
    cellRow = cell.rowIndex;
    return (
        Math.sqrt(
            (Math.abs(endColIndex - cellCol) ** 2) +
            (Math.abs(endRowIndex - cellRow) ** 2)
        )
    )
}

function myScript(eve) {
    console.log(eve.clientX + "'" + eve.clientY);
}