import { useState } from "react";

type Cell = "X" | "O" | null;

const emptyBoard: Cell[] = Array(9).fill(null);
const boardSize = 3;

export default function TicTacToe() {
  const [board, setBoard] = useState<Cell[]>(emptyBoard);
  const [loading, setLoading] = useState(false);

  const play = async (index: number) => {
    if (loading || board[index] !== null) return;

    const playerBoard = [...board];
    playerBoard[index] = "X";
    setBoard(playerBoard);
    setLoading(true);

    try {
      const response = await fetch("http://localhost:3000/api/play", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ board: playerBoard, turn: "O" }),
      });
      if (!response.ok) throw new Error("No se pudo obtener el movimiento");

      const { index: computerIndex } = (await response.json()) as {
        index: number;
      };
      const nextBoard = [...playerBoard];
      if (computerIndex >= 0) nextBoard[computerIndex] = "O";
      setBoard(nextBoard);
    } catch {
      console.error("No se pudo conectar con el servidor");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="game">
      <h1>Tic Tac Toe</h1>
      <table className="board" aria-label="Tic Tac Toe Board">
        <tbody>
          {Array.from({ length: boardSize }, (_, row) => (
            <tr key={row}>
              {board
                .slice(row * boardSize, row * boardSize + boardSize)
                .map((cell, column) => {
                  const index = row * boardSize + column;

                  return (
                    <td key={column}>
                      <button
                        type="button"
                        onClick={() => void play(index)}
                        disabled={loading || cell !== null}
                        aria-label={`Casilla ${index + 1}`}
                      >
                        {cell}
                      </button>
                    </td>
                  );
                })}
            </tr>
          ))}
        </tbody>
      </table>
    </main>
  );
}
