import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useBattle } from '../context/useBattle'
import { connectSocket, disconnectSocket } from '../services/socket'

import RoomLobby from '../components/RoomLobby'
import BattleArena from '../components/BattleArena'

export default function BattlePage () {
  const { id } = useParams()

  const {
    username,
    setRoomId,
    players,
    setPlayers,
    started,
    setStarted,
    resetBattle
  } = useBattle()

  const [isHost, setIsHost] = useState(false)
  const [startTime, setStartTime] = useState(null)
  const [leaderboard, setLeaderboard] = useState([])
  const [problem, setProblem] = useState(null)

  useEffect(() => {
    // 🔥 ALWAYS use stored username (NO fallback "Player")
    const name = username || localStorage.getItem('username')

    if (!name) {
      console.log('❌ No username found')
      return
    }

    const socket = connectSocket(id, name)

    // 🔥 CLEAN OLD LISTENERS
    socket.off('room_data')
    socket.off('battle_started')
    socket.off('leaderboard_update')

    // 🔥 ROOM DATA
    socket.on('room_data', room => {
      console.log('ROOM DATA:', room)

      setPlayers(room.users)

      // ✅ FIX: compare username (NOT socket.id)
      setIsHost(name === room.host)

      setRoomId(id)
    })

    // 🔥 BATTLE START
    socket.on('battle_started', ({ startTime, problem }) => {
      setStarted(true)
      setStartTime(startTime)
      setProblem(problem)
      setLeaderboard([])
    })

    // 🔥 LEADERBOARD
    socket.on('leaderboard_update', data => {
      setLeaderboard(data)
    })

    return () => {
      socket.off('room_data')
      socket.off('battle_started')
      socket.off('leaderboard_update')

      disconnectSocket()
      resetBattle()
    }
  }, [id, username])

  return (
    <div className='min-h-screen bg-gray-900 text-white'>
      {!started ? (
        <RoomLobby players={players} isHost={isHost} />
      ) : (
        <BattleArena
          startTime={startTime}
          leaderboard={leaderboard}
          problem={problem}
          username={username}
        />
      )}
    </div>
  )
}
