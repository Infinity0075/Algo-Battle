/**
 * ============================================
 * 🚀 ROOT APP
 * ============================================
 *
 * Handles routing + global wrappers
 */

import { BrowserRouter } from 'react-router-dom'
import { Suspense } from 'react'
import '../style/app.css'

import AppRoutes from './routes'

function App () {
  return (
    <BrowserRouter>
      <Suspense fallback={<div className='loading'>Loading...</div>}>
        <AppRoutes />
      </Suspense>
    </BrowserRouter>
  )
}

export default App
