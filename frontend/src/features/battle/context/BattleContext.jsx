import { useCallback, useState } from 'react'
import BattleContext from './BattleContextCore'

export const BattleProvider = ({ children }) => {
  const [roomId, setRoomId] = useState('')
  const [username, setUsername] = useState(
    localStorage.getItem('username') || '' // 🔧 persist
  )
  const [players, setPlayers] = useState([])
  const [started, setStarted] = useState(false)

  // 🔥 SET USERNAME (persist)
  const handleSetUsername = useCallback(name => {
    setUsername(name)
    localStorage.setItem('username', name) // 🔧 save
  }, [])

  // 🔥 RESET ROOM (important on leave)
  const resetBattle = useCallback(() => {
    setRoomId('')
    setPlayers([])
    setStarted(false)
  }, [])

  return (
    <BattleContext.Provider
      value={{
        roomId,
        setRoomId,
        username,
        setUsername: handleSetUsername, // 🔧 override setter
        players,
        setPlayers,
        started,
        setStarted,
        resetBattle // 🔧 expose
      }}
    >
      {children}
    </BattleContext.Provider>
  )
}
