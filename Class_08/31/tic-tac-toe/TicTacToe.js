import { useState } from "react";
const initialBoard = Array(9).fill(null);
export default function TicTacToe() {
    const [board, setBoard] = useState(initialBoard);
    const [turn, setTurn] = useState("X");
    const markCell = (index) => {
        if (board[index] !== null) {
            return;
        }
        setBoard((currentBoard) => currentBoard.map((cell, position) => {
            return position === index ? turn : cell;
        }));
        setTurn((currentTurn) => (currentTurn === "X" ? "O" : "X"));
    };
    return <table></table>;
}
