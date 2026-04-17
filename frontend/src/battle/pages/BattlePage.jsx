import { useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { useBattle } from '../context/BattleContext'
import { connectSocket, getSocket } from '../services/socket'

import RoomLobby from '../battle-components/RoomLobby'
import BattleArena from '../battle-components/BattleArena'

export default function BattlePage () {
  const { id } = useParams()
  const { username, setRoomId, players, setPlayers, started, setStarted } =
    useBattle()
  const [isHost, setIsHost] = useState(false)
  const [startTime, setStartTime] = useState(null)
  const [leaderboard, setLeaderboard] = useState([])

  useEffect(() => {
    const socket = connectSocket(id, username)

    socket.on('room_data', room => {
      setPlayers(room.users)
      setIsHost(socket.id === room.host)
    })

    socket.on('battle_started', ({ startTime, problem }) => {
      setStarted(true)
      setStartTime(startTime)
      setProblem(problem) // ✅ ADD THIS
    })

    socket.on('leaderboard_update', data => {
      setLeaderboard(data)
    })

    return () => socket.disconnect()
  }, [id, username])

  return (
    <div className='min-h-screen bg-gray-900 text-white'>
      {!started ? (
        <RoomLobby players={players} isHost={isHost} />
      ) : (
        <BattleArena
          startTime={startTime}
          leaderboard={leaderboard}
          problem={problem} // ✅ ADD
        />
      )}
    </div>
  )
}
