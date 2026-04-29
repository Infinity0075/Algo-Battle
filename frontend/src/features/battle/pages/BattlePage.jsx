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

    socket.on('leaderboard_update', data => setLeaderboard(data))

    return () => {
      socket.off('room_data')
      socket.off('battle_started')
      socket.off('leaderboard_update')
    }
  }, [id, username])

  useEffect(() => {
    if (!startTime) return
    const interval = setInterval(() => {
      const diff = Math.max(0, 1800000 - (Date.now() - startTime))
      setTimeLeft(diff)
      if (diff === 0) clearInterval(interval)
    }, 1000)
    return () => clearInterval(interval)
  }, [startTime])

  const formatTime = ms => {
    const total = Math.floor(ms / 1000)
    const min = Math.floor(total / 60)
    const sec = total % 60
    return `${min}:${sec.toString().padStart(2, '0')}`
  }

  const isLow = timeLeft < 300000 // under 5 mins
  const isCritical = timeLeft < 60000 // under 1 min

  return (
    <div style={s.root}>
      {started && (
        <div style={s.topBar}>
          {/* Left: room info */}
          <div style={s.topLeft}>
            <span style={s.topLabel}>ROOM</span>
            <span style={s.topMono}>{id}</span>
            <div style={s.divider} />
            <span style={s.topLabel}>PLAYERS</span>
            <span style={s.topMono}>{players.length}</span>
          </div>

          {/* Center: timer */}
          <div
            style={{
              ...s.timer,
              color: isCritical ? '#ef4444' : isLow ? '#f59e0b' : '#a5f3fc',
              boxShadow: isCritical
                ? '0 0 20px rgba(239,68,68,0.3)'
                : isLow
                ? '0 0 20px rgba(245,158,11,0.2)'
                : 'none',
              borderColor: isCritical
                ? 'rgba(239,68,68,0.3)'
                : isLow
                ? 'rgba(245,158,11,0.2)'
                : '#1f1f30'
            }}
          >
            ⏱ {formatTime(timeLeft)}
          </div>

          {/* Right: mode */}
          <div style={s.topRight}>
            <span style={s.modeBadge}>⚔ BATTLE MODE</span>
          </div>
        </div>
      )}

      <div style={s.body}>
        {!started ? (
          <RoomLobby players={players} isHost={isHost} />
        ) : !problem ? (
          <div style={s.loading}>
            <div style={s.loadingRing} />
            <p style={s.loadingText}>Loading battle problem…</p>
          </div>
        ) : (
          <BattleArena
            problem={problem}
            leaderboard={leaderboard}
            startTime={startTime}
          />
        )}
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Mono:wght@400;700&family=Sora:wght@400;500;600;700&display=swap');
        @keyframes pulse { 0%,100%{opacity:.5;transform:scale(1)} 50%{opacity:1;transform:scale(1.3)} }
      `}</style>
    </div>
  )
}

const s = {
  root: {
    height: '100vh',
    background: '#09090f',
    color: '#fff',
    display: 'flex',
    flexDirection: 'column',
    fontFamily: "'Sora', sans-serif",
    overflow: 'hidden'
  },
  topBar: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '0 24px',
    height: 52,
    flexShrink: 0,
    background: '#0f0f1a',
    borderBottom: '1px solid #1a1a2e'
  },
  topLeft: { display: 'flex', alignItems: 'center', gap: 10 },
  topLabel: {
    fontSize: 10,
    fontWeight: 700,
    letterSpacing: '0.15em',
    color: '#4b4b60'
  },
  topMono: {
    fontFamily: "'Space Mono', monospace",
    fontSize: 13,
    color: '#8b8ba0'
  },
  divider: { width: 1, height: 16, background: '#1f1f30', margin: '0 4px' },
  timer: {
    fontFamily: "'Space Mono', monospace",
    fontSize: 20,
    fontWeight: 700,
    padding: '6px 20px',
    borderRadius: 10,
    border: '1px solid',
    transition: 'all 0.3s'
  },
  topRight: { display: 'flex', alignItems: 'center' },
  modeBadge: {
    fontSize: 10,
    fontWeight: 700,
    letterSpacing: '0.15em',
    color: '#6366f1',
    background: 'rgba(99,102,241,0.1)',
    border: '1px solid rgba(99,102,241,0.25)',
    borderRadius: 100,
    padding: '4px 12px'
  },
  body: { flex: 1, overflow: 'hidden' },
  loading: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16
  },
  loadingRing: {
    width: 36,
    height: 36,
    borderRadius: '50%',
    border: '3px solid #1f1f30',
    borderTopColor: '#6366f1',
    animation: 'spin 0.8s linear infinite'
  },
  loadingText: { color: '#6b7280', fontSize: 14, margin: 0 }
}
