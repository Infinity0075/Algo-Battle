import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useBattle } from '../context/BattleContext'
import { connectSocket, disconnectSocket } from '../services/socket' // 🔧 use cleanup

import RoomLobby from '../components/RoomLobby' // 🔧 FIX PATH
import BattleArena from '../components/BattleArena' // 🔧 FIX PATH

export default function BattlePage () {
  const { id } = useParams()

  const {
    username,
    setRoomId,
    players,
    setPlayers,
    started,
    setStarted,
    resetBattle // 🔧 use reset
  } = useBattle()

  const [isHost, setIsHost] = useState(false)
  const [startTime, setStartTime] = useState(null)
  const [leaderboard, setLeaderboard] = useState([])
  const [problem, setProblem] = useState(null)

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
      setStarted(true)
      setStartTime(startTime)
      setProblem(problem)
      setLeaderboard([]) // 🔧 reset leaderboard
    })

    // 🔥 SUBMISSION UPDATE (sorted)
    socket.on('submission_result', data => {
      setLeaderboard(prev => {
        const updated = [...prev, data]
        return updated.sort((a, b) => a.time - b.time) // 🔧 SORT
      })
    })

    // 🔥 CLEANUP
    return () => {
      disconnectSocket() // 🔧 proper cleanup
      resetBattle() // 🔧 reset context
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
