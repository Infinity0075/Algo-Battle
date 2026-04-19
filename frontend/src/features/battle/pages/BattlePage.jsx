import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useBattle } from '../context/BattleContext'
import { connectSocket } from '../services/socket'

import RoomLobby from '../battle-components/RoomLobby'
import BattleArena from '../battle-components/BattleArena'

export default function BattlePage () {
  const { id } = useParams() // ✅ use only one param

  const { username, setRoomId, players, setPlayers, started, setStarted } =
    useBattle()

  const [isHost, setIsHost] = useState(false)
  const [startTime, setStartTime] = useState(null)
  const [leaderboard, setLeaderboard] = useState([])
  const [problem, setProblem] = useState(null) // ✅ MISSING STATE FIX

  useEffect(() => {
    const name = username || localStorage.getItem('username') || 'Player'

    const socket = connectSocket(id, name)

    // 🔥 ROOM DATA
    socket.on('room_data', room => {
      setPlayers(room.users)
      setIsHost(socket.id === room.host)
      setRoomId(id)
    })

    // 🔥 BATTLE START
    socket.on('battle_started', ({ startTime, problem }) => {
      console.log('🔥 Battle started:', problem)

      setStarted(true)
      setStartTime(startTime)
      setProblem(problem)
    })

    // 🔥 SUBMISSION UPDATE
    socket.on('submission_result', data => {
      setLeaderboard(prev => [...prev, data])
    })

    // 🔥 CLEANUP
    return () => {
      socket.disconnect()
    }
  }, [id])

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
