function getCellFromCords(grid, clickX, clickY) {
    let i = parseInt(clickX / grid.cellWidth - 0.01);
    let j = parseInt(clickY / grid.cellHeight - 0.01);

    return grid.allCells[i][j];
}

function clearBlocksFunction(grid, ctx) {
    for (let i = 0; i < grid.colCount; i++) {
        for (let j = 0; j < grid.rowCount; j++) {

            if (grid.allCells[i][j] != grid.start && grid.allCells[i][j] != grid.end) {
                grid.allCells[i][j].isWall = false;
                grid.allCells[i][j].color = "white";
                grid.allCells[i][j].type = "blank";
            }
        }
    }
    grid.draw(ctx);
}

function initRowColLabel(colCount, rowCount) {
    c = document.getElementById("colCount");
    r = document.getElementById("rowCount");
    c.value = colCount;
    r.value = rowCount;
}

