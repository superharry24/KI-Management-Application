import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
//import './index.css'
import Inventory from './Inventory';
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Inventory />
  </StrictMode>,
)
export default App