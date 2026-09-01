import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import SnakeGame from '../Snake.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <SnakeGame />
  </StrictMode>,
)
