import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import TicTacToe from "../TicTacToe.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <TicTacToe />
  </StrictMode>,
);
