import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '../style/index.css'

import App from './App'
import AppProviders from './provider'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AppProviders>
      <App />
    </AppProviders>
  </StrictMode>
)
