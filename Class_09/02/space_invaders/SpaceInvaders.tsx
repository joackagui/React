import { useEffect, useRef, useState } from "react";

type Bullet = {
  id: number;
  x: number;
  y: number;
};

type Enemy = {
  id: number;
  x: number;
  y: number;
};

type GameState = "playing" | "won" | "lost";

const REM = 16;
const SHIP_WIDTH = 5 * REM;
const SHIP_HEIGHT = 2.5 * REM;
const BULLET_WIDTH = 0.75 * REM;
const BULLET_HEIGHT = 1.5 * REM;
const ENEMY_SIZE = 2.5 * REM;
const ENEMY_TOP = 10 * REM;
const KILLS_TO_WIN = 10;

function overlaps(
  aLeft: number,
  aRight: number,
  aTop: number,
  aBottom: number,
  bLeft: number,
  bRight: number,
  bTop: number,
  bBottom: number,
) {
  return aLeft < bRight && aRight > bLeft && aTop < bBottom && aBottom > bTop;
}

export default function SpaceInvaders() {
  const gameRef = useRef<HTMLDivElement>(null);
  const shipRef = useRef<HTMLDivElement>(null);
  const shipPosition = useRef(0);
  const enemiesRef = useRef<Enemy[]>([]);
  const enemyBulletTimers = useRef<ReturnType<typeof setInterval>[]>([]);
  const enemyCreationTimer = useRef<ReturnType<typeof setInterval> | undefined>(
    undefined,
  );
  const shipMovementTimer = useRef<ReturnType<typeof setInterval> | undefined>(
    undefined,
  );
  const bulletMovementTimer = useRef<
    ReturnType<typeof setInterval> | undefined
  >(undefined);
  const gameStateRef = useRef<GameState>("playing");
  const killsRef = useRef(0);
  const pressedKeys = useRef(new Set<string>());

  const [shipX, setShipX] = useState(0);
  const [bullets, setBullets] = useState<Bullet[]>([]);
  const [enemy, setEnemy] = useState<Enemy[]>([]);
  const [enemyBullets, setEnemyBullets] = useState<Bullet[]>([]);
  const [gameState, setGameState] = useState<GameState>("playing");
  const [resetKey, setResetKey] = useState(0);

  // Mantiene el ref sincronizado y frena spawns/movimiento enemigo
  // en cuanto el juego termina.
  useEffect(() => {
    gameStateRef.current = gameState;
    if (gameState !== "playing") {
      clearInterval(enemyCreationTimer.current);
      clearInterval(shipMovementTimer.current);
      enemyBulletTimers.current.forEach((timer) => clearInterval(timer));
      enemyBulletTimers.current = [];
    }
  }, [gameState]);

  useEffect(() => {
    if (gameState === "won") {
      alert("You won!");
    } else if (gameState === "lost") {
      alert("Game Over! You died");
    }
  }, [gameState]);

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
      if (gameStateRef.current !== "playing") return;

      if (e.key.startsWith("Arrow")) {
        e.preventDefault();
        pressedKeys.current.add(e.key);
      }

      if (e.code === "Space" && !e.repeat) {
        e.preventDefault();
        setBullets((currentBullets) => [
          ...currentBullets,
          {
            id: Date.now() + Math.random(),
            x: shipPosition.current,
            y: shipRef.current?.offsetHeight ?? 0,
          },
        ]);
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      pressedKeys.current.delete(e.key);
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    enemyCreationTimer.current = setInterval(() => {
      if (gameStateRef.current !== "playing") return;
      if (enemiesRef.current.length >= 5) return;

      const occupiedPositions = new Set(
        enemiesRef.current.map((currentEnemy) => currentEnemy.x),
      );
      const availablePositions = [0, 1, 2, 3, 4].filter(
        (position) => !occupiedPositions.has(position),
      );
      const position: Enemy = {
        id: Date.now() + Math.random(),
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
        if (gameStateRef.current !== "playing") return;
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
      enemyBulletTimers.current.push(setInterval(createEnemyBullet, 2000));
    }, 2000);

    shipMovementTimer.current = setInterval(() => {
      const game = gameRef.current;
      const ship = shipRef.current;

      if (!game || !ship) return;
      if (gameStateRef.current !== "playing") return;

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
      clearInterval(shipMovementTimer.current);
      clearInterval(enemyCreationTimer.current);
      enemyBulletTimers.current.forEach((timer) => clearInterval(timer));
      enemyBulletTimers.current = [];
    };
  }, [resetKey]);

  useEffect(() => {
    bulletMovementTimer.current = setInterval(() => {
      if (gameStateRef.current !== "playing") return;

      const gameHeight = gameRef.current?.clientHeight ?? 0;
      const gameWidth = gameRef.current?.clientWidth ?? 0;

      // Bullets del jugador: mueve, descarta las que salen de pantalla
      // y detecta choque contra enemigos.
      setBullets((currentBullets) => {
        const survivingBullets: Bullet[] = [];
        let nextEnemies = enemiesRef.current;
        let anyHit = false;

        currentBullets.forEach((bullet) => {
          const movedBullet = { ...bullet, y: bullet.y + 40 };
          if (movedBullet.y >= gameHeight) return;

          const bLeft = movedBullet.x - BULLET_WIDTH / 2;
          const bRight = movedBullet.x + BULLET_WIDTH / 2;
          const bBottom = gameHeight - movedBullet.y;
          const bTop = bBottom - BULLET_HEIGHT;

          const hitEnemy = nextEnemies.find((enemyShip) => {
            const centerX = gameWidth * ((enemyShip.x * 20 + 10) / 100);
            const eLeft = centerX - ENEMY_SIZE / 2;
            const eRight = centerX + ENEMY_SIZE / 2;
            return overlaps(
              bLeft,
              bRight,
              bTop,
              bBottom,
              eLeft,
              eRight,
              ENEMY_TOP,
              ENEMY_TOP + ENEMY_SIZE,
            );
          });

          if (hitEnemy) {
            anyHit = true;
            nextEnemies = nextEnemies.filter((e) => e.id !== hitEnemy.id);
            killsRef.current += 1;
          } else {
            survivingBullets.push(movedBullet);
          }
        });

        if (anyHit) {
          enemiesRef.current = nextEnemies;
          setEnemy(nextEnemies);
          if (killsRef.current >= KILLS_TO_WIN) {
            setGameState("won");
          }
        }

        return survivingBullets;
      });

      // Enemy bullets: mueve, descarta las que salen de pantalla
      // y detecta choque contra el ship.
      setEnemyBullets((currentBullets) => {
        const shipLeft = shipPosition.current - SHIP_WIDTH / 2;
        const shipRight = shipPosition.current + SHIP_WIDTH / 2;
        const shipTop = gameHeight - SHIP_HEIGHT;

        const survivingBullets: Bullet[] = [];
        let shipHit = false;

        currentBullets.forEach((bullet) => {
          const movedBullet = { ...bullet, y: bullet.y + 40 };
          if (movedBullet.y >= gameHeight) return;

          const bLeft = movedBullet.x - BULLET_WIDTH / 2;
          const bRight = movedBullet.x + BULLET_WIDTH / 2;
          const bTop = movedBullet.y;
          const bBottom = movedBullet.y + BULLET_HEIGHT;

          const collides = overlaps(
            bLeft,
            bRight,
            bTop,
            bBottom,
            shipLeft,
            shipRight,
            shipTop,
            gameHeight,
          );

          if (collides) {
            shipHit = true;
          } else {
            survivingBullets.push(movedBullet);
          }
        });

        if (shipHit) {
          setGameState("lost");
        }

        return survivingBullets;
      });
    }, 250);

    return () => clearInterval(bulletMovementTimer.current);
  }, [resetKey]);

  const handleRestart = () => {
    enemiesRef.current = [];
    killsRef.current = 0;
    pressedKeys.current.clear();
    setBullets([]);
    setEnemyBullets([]);
    setEnemy([]);
    setGameState("playing");
    setResetKey((k) => k + 1);
  };

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
      {enemy.map((currentEnemy) => (
        <div
          className="enemy_ship"
          key={currentEnemy.id}
          style={{
            left: `${currentEnemy.x * 20 + 10}%`,
            top: `${currentEnemy.y}rem`,
          }}
        ></div>
      ))}

      {gameState !== "playing" && (
        <div className="overlay">
          <div className="overlay-card">
            <h2>{gameState === "won" ? "GAME WON" : "GAME OVER"}</h2>
            <button className="restart-button" onClick={handleRestart}>
              Reiniciar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
