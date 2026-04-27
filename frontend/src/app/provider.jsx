import { AuthProvider } from '../features/auth/context/AuthContext'
import { BattleProvider } from '../features/battle/context/BattleContext'

export default function AppProviders ({ children }) {
  return (
    <AuthProvider>
      <BattleProvider>{children}</BattleProvider>
    </AuthProvider>
  )
}
