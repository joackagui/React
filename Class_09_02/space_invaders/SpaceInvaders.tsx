import { useEffect, useRef, useState } from "react";

export default function SpaceInvaders() {
  const [left, setLeft] = useState<number>(0);
  const [bottom, setBottom] = useState<number>(0);
  const pressedKeys = useRef(new Set<string>());

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key.startsWith("Arrow")) {
        e.preventDefault();
        pressedKeys.current.add(e.key);
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      pressedKeys.current.delete(e.key);
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    const movement = setInterval(() => {
      if (pressedKeys.current.has("ArrowLeft")) {
        setLeft((prev) => Math.max(0, prev - 5));
      }
      if (pressedKeys.current.has("ArrowRight")) {
        setLeft((prev) => Math.min(20, prev + 5));
      }
      if (pressedKeys.current.has("ArrowDown")) {
        setBottom((prev) => Math.max(0, prev - 5));
      }
      if (pressedKeys.current.has("ArrowUp")) {
        setBottom((prev) => Math.min(15, prev + 5));
      }
    }, 300);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
      clearInterval(movement);
    };
  }, []);

  return (
    <div className="game">
      <h1>Space Invaders</h1>
      <div
        className="shoot"
        style={{ left: `${left}rem`, bottom: `${bottom}rem` }}
      ></div>
      <div className="weapon"></div>
    </div>
  );
}
