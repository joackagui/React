import { useState } from "react";
const BOARD_SIZE = 8;
const BOARD_CELLS = BOARD_SIZE * BOARD_SIZE;
const initialSnake = [36, 35, 34];
const getRandomFruitPosition = (occupiedPositions) => {
    const availablePositions = Array.from({ length: BOARD_CELLS }, (_, position) => position).filter((position) => !occupiedPositions.includes(position));
    return availablePositions[Math.floor(Math.random() * availablePositions.length)];
};
export default function SnakeGame() {
    const [snakePosition, setSnakePosition] = useState(initialSnake);
    const [fruitPosition, setFruitPosition] = useState(() => getRandomFruitPosition(initialSnake));
    const [direction, setDirection] = useState("right");
    const getNextPosition = (headPosition, movement) => {
        switch (movement) {
            case "up":
                return headPosition - BOARD_SIZE;
            case "down":
                return headPosition + BOARD_SIZE;
            case "left":
                return headPosition - 1;
            case "right":
                return headPosition + 1;
        }
    };
    const moveSnake = (newDirection) => {
        const headPosition = snakePosition[0];
        const nextHeadPosition = getNextPosition(headPosition, newDirection);
        const crossedBorder = nextHeadPosition < 0 ||
            nextHeadPosition >= BOARD_CELLS ||
            (newDirection === "left" && headPosition % BOARD_SIZE === 0) ||
            (newDirection === "right" &&
                headPosition % BOARD_SIZE === BOARD_SIZE - 1);
        if (crossedBorder) {
            alert("Game Over! You hit the border.");
            resetGame();
            return;
        }
        const ateFruit = nextHeadPosition === fruitPosition;
        const nextSnakePosition = [nextHeadPosition, ...snakePosition];
        if (!ateFruit) {
            nextSnakePosition.pop();
        }
        else {
            setFruitPosition(getRandomFruitPosition(nextSnakePosition));
        }
        setDirection(newDirection);
        setSnakePosition(nextSnakePosition);
    };
    const handleKeyDown = (event) => {
        event.preventDefault();
        if (event.key === "ArrowUp") {
            moveSnake("up");
        }
        else if (event.key === "ArrowDown") {
            moveSnake("down");
        }
        else if (event.key === "ArrowLeft") {
            moveSnake("left");
        }
        else if (event.key === "ArrowRight") {
            moveSnake("right");
        }
    };
    const resetGame = () => {
        setSnakePosition(initialSnake);
        setFruitPosition(getRandomFruitPosition(initialSnake));
        setDirection("right");
    };
    const board = Array.from({ length: BOARD_CELLS }, (_, position) => {
        const snakeSegment = snakePosition.indexOf(position);
        if (snakeSegment === 0)
            return "🐸";
        if (snakeSegment > 0)
            return "🟩";
        if (position === fruitPosition)
            return "🍎";
        return "";
    });
    return (<div tabIndex={0} autoFocus onKeyDown={handleKeyDown}>
      <h1>Snake Game</h1>
      <table>
        <tbody>
          {[0, 1, 2, 3, 4, 5, 6, 7].map((row) => (<tr key={row}>
              {board
                .slice(row * BOARD_SIZE, row * BOARD_SIZE + BOARD_SIZE)
                .map((cell, column) => (<td key={column}>{cell}</td>))}
            </tr>))}
        </tbody>
      </table>
      <p>Usa las flechas para mover la serpiente</p>
    </div>);
}
