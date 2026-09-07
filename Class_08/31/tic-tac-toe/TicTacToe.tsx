import { useState } from "react";

type mark = "X" | "O";
type cell = mark | null;
type board = cell[];

const initialBoard: board = Array(9).fill(null);

export default function TicTacToe() {
  const [board, setBoard] = useState<board>(initialBoard);
  const [turn, setTurn] = useState<mark>("X");

  const markCell = (index: number): void => {
    if (board[index] !== null) {
      return;
    }

    setBoard((currentBoard) =>
      currentBoard.map((cell, position) => {
        return position === index ? turn : cell;
      }),
    );
    setTurn((currentTurn) => (currentTurn === "X" ? "O" : "X"));
  };

  return (
    <div>
      <h1>Tic Tac Toe</h1>
      <table>
      <tbody>
        {[0, 1, 2].map((row) => (
          <tr key={row}>
            {board.slice(row * 3, row * 3 + 3).map((cell, column) => (
              <td key={column} onClick={() => markCell(row * 3 + column)}>
                {cell}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
    </div>
  );
}
