import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '../style/index.css'
import App from './App.jsx'
import { AuthProvider } from '../features/auth/context/AuthContext.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <App />
    </AuthProvider>
  </StrictMode>
)
