import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import UserContex from './context/UserContex.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <UserContex>
      <App />
    </UserContex>
  </StrictMode>,
)
