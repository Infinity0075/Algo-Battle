import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useBattle } from '../context/useBattle'
import { connectSocket, getSocket } from '../services/socket'

import RoomLobby from '../components/RoomLobby'
import BattleArena from '../components/BattleArena'

export default function BattlePage () {
  const { id } = useParams()
  const { username, setRoomId, players, setPlayers, started, setStarted } =
    useBattle()

  const [isHost, setIsHost] = useState(false)
  const [startTime, setStartTime] = useState(null)
  const [leaderboard, setLeaderboard] = useState([])
  const [problem, setProblem] = useState(null)
  const [timeLeft, setTimeLeft] = useState(0)

  useEffect(() => {
    const name = username || localStorage.getItem('username')
    if (!name) return

    const socket = connectSocket(id, name)

    socket.off('room_data')
    socket.off('battle_started')
    socket.off('leaderboard_update')

    socket.on('room_data', room => {
      setPlayers(room.users)
      setIsHost(socket.id === room.host)
      setRoomId(id)
    })

    socket.on('battle_started', data => {
      if (!data?.problem) return

      setStarted(true)
      setStartTime(data.startTime)
      setProblem(data.problem)
      setLeaderboard([])
    })

    socket.on('leaderboard_update', data => {
      setLeaderboard(data)
    })

    return () => {
      socket.off('room_data')
      socket.off('battle_started')
      socket.off('leaderboard_update')
    }
  }, [id, username])

  useEffect(() => {
    if (!startTime) return

    const interval = setInterval(() => {
      const now = Date.now()
      const diff = Math.max(0, 1800000 - (now - startTime))
      setTimeLeft(diff)
      if (diff === 0) clearInterval(interval)
    }, 1000)

    return () => clearInterval(interval)
  }, [startTime])

  const formatTime = ms => {
    const totalSec = Math.floor(ms / 1000)
    const min = Math.floor(totalSec / 60)
    const sec = totalSec % 60
    return `${min}:${sec.toString().padStart(2, '0')}`
  }

  return (
    <div className='h-screen bg-[#09090f] text-white flex flex-col'>
      {started && (
        <div className='flex justify-between items-center px-6 py-3 border-b border-[#1a1a2e] bg-[#0f0f1a]'>
          <div className='flex items-center gap-4'>
            <span className='text-sm text-slate-400'>Room:</span>
            <span className='font-mono text-sm'>{id}</span>
            <span className='text-sm text-slate-400'>Players:</span>
            <span className='text-sm'>{players.length}</span>
          </div>

          <div className='text-lg font-mono text-yellow-400'>
            ⏱ {formatTime(timeLeft)}
          </div>

          <div className='text-sm text-slate-400'>Battle Mode</div>
        </div>
      )}

      <div className='flex flex-1 overflow-hidden'>
        {!started ? (
          <RoomLobby players={players} isHost={isHost} />
        ) : !problem ? (
          <div className='flex items-center justify-center w-full'>
            Loading battle problem...
          </div>
        ) : (
          <BattleArena
            problem={problem}
            leaderboard={leaderboard}
            startTime={startTime}
          />
        )}
      </div>
    </div>
  )
}
