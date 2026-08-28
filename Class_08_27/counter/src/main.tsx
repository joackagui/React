import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import KeysExample from '../keysExample.tsx'
import Counter from '../counter.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <KeysExample />
    <Counter />
  </StrictMode>
)
