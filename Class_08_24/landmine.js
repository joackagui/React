"use strict";
class Cell {
    row;
    col;
    value;
    constructor(row, col, value) {
        this.row = row;
        this.col = col;
        this.value = value;
    }
}
let gameOver = false;
function reveal(element, cell) {
    if (gameOver || element.classList.contains("revealed")) {
        return;
    }
    element.classList.add("revealed");
    element.textContent = cell.value;
    if (cell.value === "💣") {
        gameOver = true;
        document.querySelectorAll(".memory td").forEach((currentCell) => {
            currentCell.classList.add("exploded", "revealed");
            currentCell.textContent = "X";
        });
        alert("Game Over! You hit a landmine!");
    }
}
