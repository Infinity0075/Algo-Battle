import { createContext, useContext, useState } from 'react'

const BattleContext = createContext()

export const BattleProvider = ({ children }) => {
  const [roomId, setRoomId] = useState('')
  const [username, setUsername] = useState('')
  const [players, setPlayers] = useState([])
  const [started, setStarted] = useState(false)

  return (
    <BattleContext.Provider
      value={{
        roomId,
        setRoomId,
        username,
        setUsername,
        players,
        setPlayers,
        started,
        setStarted
      }}
    >
      {children}
    </BattleContext.Provider>
  )
}

export const useBattle = () => useContext(BattleContext)
