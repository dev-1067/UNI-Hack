import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BatchProvider } from './context/BatchContext.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BatchProvider>
      <App />
    </BatchProvider>
  </StrictMode>,
)
