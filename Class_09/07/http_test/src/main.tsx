import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import PostsList from "../PostsList.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <PostsList />
  </StrictMode>,
);
