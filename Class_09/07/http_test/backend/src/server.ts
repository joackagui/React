import express from "express";
import { mejorMovimiento, type Marca, type Tablero } from "./minimax.js";

const app = express();
const PORT = 3000;
const HOST = "localhost";

app.use(express.json());

app.use((_req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Content-Type");
  next();
});

app.get("/welcome", (_, res) => {
  res.send("Hello World!");
});

app.get("/welcome/json", (_, res) => {
  res.json({ message: "Hello World!" });
});

app.get("/saludo", (_, res) => {
  res.json({ message: "Hola desde el servidor Express!" });
});

app.post("/api/play", (req, res) => {
  const { board, turn } = req.body as { board?: unknown; turn?: unknown };

  if (
    !Array.isArray(board) ||
    board.length !== 9 ||
    !board.every((cell) => cell === null || cell === "X" || cell === "O") ||
    (turn !== "X" && turn !== "O")
  ) {
    res
      .status(400)
      .json({ error: "board debe tener 9 celdas y turn debe ser X u O" });
    return;
  }

  const index = mejorMovimiento(board as Tablero, turn as Marca);
  res.json({ index });
});

app.listen(PORT, HOST, () => {
  console.log(`Servidor escuchando en http://${HOST}:${PORT}`);
});
