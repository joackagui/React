import { useState } from "react";
import type { KeyboardEvent } from "react";

type Direction = "up" | "down" | "left" | "right";

const boardSize = 8;
const totalCells = boardSize * boardSize;
const initialSnake = [27, 26, 25];

const getRandomFruitPosition = (occupiedPositions: number[]): number => {
  const availablePositions: number[] = [];

  for (let position = 0; position < totalCells; position++) {
    if (!occupiedPositions.includes(position)) {
      availablePositions.push(position);
    }
  }

  const randomIndex = Math.floor(Math.random() * availablePositions.length);
  return availablePositions[randomIndex];
};

export default function SnakeGame() {
  const [snakePosition, setSnakePosition] = useState<number[]>(initialSnake);
  const [fruitPosition, setFruitPosition] = useState(() =>
    getRandomFruitPosition(initialSnake),
  );

  const getNextPosition = (headPosition: number, movement: Direction) => {
    switch (movement) {
      case "up":
        return headPosition - boardSize;
      case "down":
        return headPosition + boardSize;
      case "left":
        return headPosition - 1;
      case "right":
        return headPosition + 1;
    }
  };

  const moveSnake = (newDirection: Direction): void => {
    const headPosition = snakePosition[0];
    const nextHeadPosition = getNextPosition(headPosition, newDirection);
    const die: boolean =
      nextHeadPosition < 0 ||
      nextHeadPosition > totalCells ||
      (newDirection === "left" && headPosition % boardSize === 0) ||
      (newDirection === "right" &&
        headPosition % boardSize === boardSize - 1) ||
      snakePosition.includes(nextHeadPosition);

    if (die) {
      alert("Game Over! You died");
      resetGame();
      return;
    }

    const eatFruit = nextHeadPosition === fruitPosition;
    const nextSnakePosition = [nextHeadPosition, ...snakePosition];

    if (!eatFruit) {
      nextSnakePosition.pop();
    } else {
      setFruitPosition(getRandomFruitPosition(nextSnakePosition));
    }

    setSnakePosition(nextSnakePosition);
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    event.preventDefault();

    if (event.key === "ArrowUp") {
      moveSnake("up");
    } else if (event.key === "ArrowDown") {
      moveSnake("down");
    } else if (event.key === "ArrowLeft") {
      moveSnake("left");
    } else if (event.key === "ArrowRight") {
      moveSnake("right");
    }
  };

  const resetGame = (): void => {
    setSnakePosition(initialSnake);
    setFruitPosition(getRandomFruitPosition(initialSnake));
  };

  const board: string[] = [];

  for (let position = 0; position < totalCells; position++) {
    const snakeIndex = snakePosition.indexOf(position);

    if (snakeIndex === 0) {
      board.push("🐸");
    } else if (snakeIndex > 0) {
      board.push("🟩");
    } else if (position === fruitPosition) {
      board.push("🍎");
    } else {
      board.push("");
    }
  }

  return (
    <div tabIndex={0} autoFocus onKeyDown={handleKeyDown}>
      <h1>Snake Game</h1>
      <table>
        <tbody>
          {[0, 1, 2, 3, 4, 5, 6, 7].map((row) => (
            <tr key={row}>
              {board
                .slice(row * boardSize, row * boardSize + boardSize)
                .map((cell, column) => (
                  <td key={column}>{cell}</td>
                ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
