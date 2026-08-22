import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { GoogleOAuthProvider } from '@react-oauth/google'
import './index.css'
import App from './App.jsx'
import { ToastProvider } from './components/ToastProvider.jsx'

const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID || "YOUR_CLIENT_ID.apps.googleusercontent.com";

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <GoogleOAuthProvider clientId={clientId}>
      <ToastProvider>
        <App />
      </ToastProvider>
    </GoogleOAuthProvider>
  </StrictMode>,
)
