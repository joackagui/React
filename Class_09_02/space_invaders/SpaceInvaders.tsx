import { useEffect, useRef, useState } from "react";

type Bullet = {
  id: number;
  x: number;
  y: number;
};

type Enemy = {
  x: number;
  y: number;
};

export default function SpaceInvaders() {
  const gameRef = useRef<HTMLDivElement>(null);
  const shipRef = useRef<HTMLDivElement>(null);
  const shipPosition = useRef(0);
  const enemiesRef = useRef<Enemy[]>([]);
  const enemyBulletTimers = useRef<ReturnType<typeof setInterval>[]>([]);
  const [shipX, setShipX] = useState(0);
  const [bullets, setBullets] = useState<Bullet[]>([]);
  const enemies = Array<Enemy>();
  const [enemy, setEnemy] = useState<Array<Enemy>>(enemies);
  const [enemyBullets, setEnemyBullets] = useState<Bullet[]>([]);
  const pressedKeys = useRef(new Set<string>());

  useEffect(() => {
    const updatePositions = () => {
      const game = gameRef.current;
      const ship = shipRef.current;

      if (!game || !ship) return;

      const gameWidth = game.clientWidth;
      const centeredShip = gameWidth / 2;

      shipPosition.current = centeredShip;
      setShipX(centeredShip);
    };

    updatePositions();
    window.addEventListener("resize", updatePositions);

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key.startsWith("Arrow")) {
        e.preventDefault();
        pressedKeys.current.add(e.key);
      }

      if (e.code === "Space" && !e.repeat) {
        e.preventDefault();
        setBullets((currentBullets) => {
          const nextBullets = [...currentBullets];
          nextBullets.push({
            id: Date.now() + Math.random(),
            x: shipPosition.current,
            y: shipRef.current?.offsetHeight ?? 0,
          });
          return nextBullets;
        });
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      pressedKeys.current.delete(e.key);
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    const enemyCreation = setInterval(() => {
      if (enemiesRef.current.length >= 5) return;

      const occupiedPositions = new Set(
        enemiesRef.current.map((currentEnemy) => currentEnemy.x),
      );
      const availablePositions = [0, 1, 2, 3, 4].filter(
        (position) => !occupiedPositions.has(position),
      );
      const position = {
        x: availablePositions[
          Math.floor(Math.random() * availablePositions.length)
        ],
        y: 10,
      };
      const nextEnemies = [...enemiesRef.current, position];
      enemiesRef.current = nextEnemies;
      setEnemy(nextEnemies);

      const gameWidth = gameRef.current?.clientWidth ?? 0;
      const bulletX = gameWidth * ((position.x * 20 + 10) / 100);
      const createEnemyBullet = () => {
        setEnemyBullets((currentBullets) => [
          ...currentBullets,
          {
            id: Date.now() + Math.random(),
            x: bulletX,
            y: position.y * 16 + 5 * 16,
          },
        ]);
      };

      createEnemyBullet();
      enemyBulletTimers.current.push(setInterval(createEnemyBullet, 3000));
    }, 3000);

    const movement = setInterval(() => {
      const game = gameRef.current;
      const ship = shipRef.current;

      if (!game || !ship) return;

      const minimumX = ship.offsetWidth / 2;
      const maximumX = game.clientWidth - minimumX;
      let nextX = shipPosition.current;

      if (pressedKeys.current.has("ArrowLeft")) {
        nextX -= 8;
      }
      if (pressedKeys.current.has("ArrowRight")) {
        nextX += 8;
      }

      nextX = Math.max(minimumX, Math.min(maximumX, nextX));
      shipPosition.current = nextX;
      setShipX(nextX);
    }, 16);

    return () => {
      window.removeEventListener("resize", updatePositions);
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
      clearInterval(movement);
      clearInterval(enemyCreation);
      enemyBulletTimers.current.forEach((timer) => clearInterval(timer));
      enemyBulletTimers.current = [];
    };
  }, []);

  useEffect(() => {
    const bulletMovement = setInterval(() => {
      const gameHeight = gameRef.current?.clientHeight ?? 0;

      setBullets((currentBullets) =>
        currentBullets
          .map((bullet) => ({ ...bullet, y: bullet.y + 40 }))
          .filter((bullet) => bullet.y < gameHeight),
      );

      setEnemyBullets((currentBullets) =>
        currentBullets
          .map((bullet) => ({ ...bullet, y: bullet.y + 40 }))
          .filter((bullet) => bullet.y < gameHeight),
      );
    }, 250);

    return () => clearInterval(bulletMovement);
  }, []);

  return (
    <div className="game" ref={gameRef}>
      <h1>Space Invaders</h1>
      {enemyBullets.map((bullet) => (
        <div
          className="enemy_bullet"
          key={bullet.id}
          style={{ left: `${bullet.x}px`, top: `${bullet.y}px` }}
        ></div>
      ))}
      {bullets.map((bullet) => (
        <div
          className="bullet"
          key={bullet.id}
          style={{ left: `${bullet.x}px`, bottom: `${bullet.y}px` }}
        ></div>
      ))}
      <div className="ship" ref={shipRef} style={{ left: `${shipX}px` }}></div>
      {enemy.map((currentEnemy, index) => (
        <div
          className="enemy_ship"
          key={index}
          style={{
            left: `${currentEnemy.x * 20 + 10}%`,
            top: `${currentEnemy.y}rem`,
          }}
        ></div>
      ))}
    </div>
  );
}
