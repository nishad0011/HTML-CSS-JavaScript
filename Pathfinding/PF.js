
const gridCanvas = document.querySelector("#gridCanvas");
const gridCtx = gridCanvas.getContext("2d");

const gridDiv = document.getElementById("canvasdiv");
const clearBlocksBtn = document.getElementById("clearBlocksBtn");
const drawBlocksCb = document.getElementById("drawBlocksCheckbox");


const width = 500;
const height = 500;
gridCanvas.width = width;
gridCanvas.height = height;

const col_count = 25;
const row_count = 25;
let grid = new Grid(col_count, row_count, width, height);

grid.createCells();

let start = [0, 0];
let end = [24, 24];

grid.initStartEnd(start, end);
initRowColLabel(col_count, row_count);

grid.draw(gridCtx);


var mouseClicked = false;
var drawing = false;
var selectedCell = null;
gridCanvas.addEventListener('mousedown', (event) => {
    let canvasOffset = gridCanvas.getBoundingClientRect();
    let clickX = event.clientX - canvasOffset.x;
    let clickY = event.clientY - canvasOffset.y;

    mouseClicked = true;
    if (drawBlocksCb.checked) { drawing = true };
    selectedCell = getCellFromCords(grid, clickX, clickY);
});

gridCanvas.addEventListener('mousemove', (event) => {
    if (drawBlocksCb.checked) { drawing = true } else { drawing = false }
    if (mouseClicked && drawing) {
        let canvasOffset = gridCanvas.getBoundingClientRect();
        let clickX = event.clientX - canvasOffset.x;
        let clickY = event.clientY - canvasOffset.y;
        let drawingCell = getCellFromCords(grid, clickX, clickY);
        if (drawingCell != grid.start && drawingCell != grid.end) {
            let c = drawingCell.colIndex;
            let r = drawingCell.rowIndex;

            grid.allCells[c][r].isWall = true;
            grid.allCells[c][r].color = "black";
            grid.allCells[c][r].type = "wall";
        }
    }
    grid.draw(gridCtx);

});

gridCanvas.addEventListener('mouseup', (event) => {
    if (mouseClicked && drawing != true) {
        let canvasOffset = gridCanvas.getBoundingClientRect();
        let clickX = event.clientX - canvasOffset.x;
        let clickY = event.clientY - canvasOffset.y;
        let mouseOnCell = getCellFromCords(grid, clickX, clickY);

        if (mouseOnCell.colIndex != selectedCell.colIndex ||
            mouseOnCell.rowIndex != selectedCell.rowIndex
        ) {
            tempCell = selectedCell;

            grid.allCells[selectedCell.colIndex][selectedCell.rowIndex] = new Cell(
                selectedCell.x,
                selectedCell.y,
                selectedCell.colIndex,
                selectedCell.rowIndex,
                grid
            );

            let c = mouseOnCell.colIndex;
            let r = mouseOnCell.rowIndex;

            //Moving walls
            if (tempCell.isWall) {
                grid.allCells[c][r].isWall = tempCell.isWall;
                grid.allCells[c][r].type = "wall";
                grid.allCells[c][r].color = "black";
            }

            if (tempCell === grid.start) {
                grid.allCells[c][r].color = "red";
                grid.allCells[c][r].isWall = false;
                grid.allCells[c][r].type = "start";
                grid.allCells[c][r].g = 0;
                grid.allCells[c][r].h = getH(grid, grid.allCells[c][r]);
                grid.allCells[c][r].f = grid.allCells[c][r].g + grid.allCells[c][r].h;

                grid.start = grid.allCells[c][r];

            }
            if (tempCell === grid.end) {
                grid.allCells[c][r].color = "blue";
                grid.allCells[c][r].isWall = false;
                grid.allCells[c][r].type = "end";
                grid.end = grid.allCells[c][r];

            }

        }

    }
    mouseClicked = false;
    grid.draw(gridCtx);

});

clearBlocksBtn.addEventListener('click', () => { clearBlocksFunction(grid, gridCtx) });

const startButton = document.getElementById("startButton");
startButton.addEventListener('click', () => {
    grid.currentCell = grid.start;
    grid.openSet.push(grid.currentCell);
    animate();
});

//animate();
function animate() {
    grid.draw(gridCtx);

    // initialize neighbours
    grid.currentCell.getNeighbors(
        grid,
        grid.currentCell.g,
        grid.currentCell,
        true
    );

    for (let j = 0; j < grid.currentCell.neighbours.length; j++) {
        if (
            !grid.openSet.includes(grid.currentCell.neighbours[j]) &&
            !grid.closedSet.includes(grid.currentCell.neighbours[j])
        ) {
            grid.currentCell.neighbours[j].color = "green";
            grid.openSet.push(grid.currentCell.neighbours[j]);
        }
    }
    if (grid.currentCell != grid.start) { grid.currentCell.color = "grey"; }
    grid.closedSet.push(grid.currentCell);
    const index = grid.openSet.indexOf(grid.currentCell);
    if (index > -1) {
        grid.openSet.splice(index, 1);
    }

    let winner = 0;
    for (let i = 0; i < grid.openSet.length; i++) {
        if (grid.openSet[i].f < grid.openSet[winner].f) {
            winner = i;
        }
    }
    grid.currentCell = grid.openSet[winner];

    if (grid.openSet.length != 0 && grid.currentCell != grid.end) {
        // console.log(grid.currentCell.f);
        requestAnimationFrame(animate);
    }
    else {
        if (grid.currentCell != grid.end) {
            alert("No Path found");
        }
        //Showing Path
        temp = grid.currentCell;
        temp.color = "blue";
        while (temp.previous != null) {
            temp = temp.previous;
            temp.color = "blue";
        }
        grid.draw(gridCtx);
    }

}

function updateRowCol() {
    console.log("updating row col");
    const cc = document.getElementById("colCount");
    const rr = document.getElementById("rowCount");
    grid.colCount = cc.value;
    grid.rowCount = rr.value;

    if (grid.colCount >= grid.rowCount) {
        grid.cellWidth = Math.min(grid.canvasWidth / grid.colCount, 20);
        grid.cellHeight = grid.cellWidth;
    } else {
        grid.cellHeight = Math.min(grid.canvasHeight / grid.rowCount, 20);
        grid.cellWidth = grid.cellHeight;
    }

    if (grid.start.colIndex >= grid.colCount) {
        if (grid.end.colIndex == grid.colCount - 1) {
            grid.end.colIndex = grid.end.colIndex - 1;
        }
        grid.start.colIndex = grid.colCount - 1;
    }
    if (grid.start.rowIndex >= grid.rowCount) {
        if (grid.end.rowIndex == grid.rowCount - 1) {
            grid.end.rowIndex = grid.end.rowIndex - 1;
        }
        grid.start.rowIndex = grid.rowCount - 1;
    }

    if (grid.end.colIndex >= grid.colCount) {
        if (grid.start.colIndex == grid.colCount - 1) {
            grid.start.colIndex = grid.start.colIndex - 1;
        }
        grid.end.colIndex = grid.colCount - 1;
    }
    if (grid.end.rowIndex >= grid.rowCount) {
        if (grid.start.rowIndex == grid.rowCount - 1) {
            grid.start.rowIndex = grid.start.rowIndex - 1;
        }
        grid.end.rowIndex = grid.rowCount - 1;
    }
    let c = grid.start.colIndex;
    let r = grid.start.rowIndex

    let a = grid.end.colIndex;
    let b = grid.end.rowIndex

    grid.createCells();

    grid.allCells[c][r].color = "red";
    grid.allCells[c][r].isWall = false;
    grid.allCells[c][r].type = "start";
    grid.allCells[c][r].g = 0;
    grid.allCells[c][r].h = getH(grid, grid.allCells[c][r]);
    grid.allCells[c][r].f = grid.allCells[c][r].g + grid.allCells[c][r].h;
    grid.start = grid.allCells[c][r];


    grid.allCells[a][b].color = "blue";
    grid.allCells[a][b].isWall = false;
    grid.allCells[a][b].type = "end";
    grid.allCells[a][b].h = 0;
    grid.end = grid.allCells[a][b];


    grid.draw(gridCtx);
}

function reset() {
    grid = new Grid(col_count, row_count, width, height);
    grid.createCells();
    grid.initStartEnd(start, end);
    grid.draw(gridCtx);


    const cc = document.getElementById("colCount");
    const rr = document.getElementById("rowCount");
    cc.value = grid.colCount;
    rr.value = grid.rowCount;
}