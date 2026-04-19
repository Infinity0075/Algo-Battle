import { BrowserRouter } from 'react-router-dom'
import './App.css'

import AppRoutes from './routes'
import { BattleProvider } from '../features/battle/context/BattleContext'

function App () {
  return (
    <BrowserRouter>
      <BattleProvider>
        <AppRoutes />
      </BattleProvider>
    </BrowserRouter>
  )
}

export default App
