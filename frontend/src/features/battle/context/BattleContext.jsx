import { createContext, useContext, useState } from 'react'

const BattleContext = createContext()

export const BattleProvider = ({ children }) => {
  const [roomId, setRoomId] = useState('')
  const [username, setUsername] = useState(
    localStorage.getItem('username') || '' // 🔧 persist
  )
  const [players, setPlayers] = useState([])
  const [started, setStarted] = useState(false)

  // 🔥 SET USERNAME (persist)
  const handleSetUsername = name => {
    setUsername(name)
    localStorage.setItem('username', name) // 🔧 save
  }

  // 🔥 RESET ROOM (important on leave)
  const resetBattle = () => {
    setRoomId('')
    setPlayers([])
    setStarted(false)
  }

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

export const useBattle = () => useContext(BattleContext)
