import { useState, useEffect } from 'react'
import { problems } from './practice/problems'
import { useNavigate } from 'react-router-dom'
import { useBattle } from '../../battle/context/BattleContext'

const FONTS = `@import url('https://fonts.googleapis.com/css2?family=Syne:wght@600;700;800&family=DM+Sans:wght@400;500&family=JetBrains+Mono:wght@400;500&display=swap');`

function Battle () {
  const navigate = useNavigate()
  const { setRoomId, setUsername } = useBattle()

  const [problem, setProblem] = useState(null)
  const [time, setTime] = useState(0)
  const [running, setRunning] = useState(false)
  const [mode, setMode] = useState(null)

  const [roomInput, setRoomInput] = useState('')
  const [usernameInput, setUsernameInput] = useState('')

  const startBattle = () => {
    const random = problems[Math.floor(Math.random() * problems.length)]
    setProblem(random)
    setTime(0)
    setRunning(true)
  }

  useEffect(() => {
    let interval
    if (running) {
      interval = setInterval(() => setTime(prev => prev + 1), 1000)
    }
    return () => clearInterval(interval)
  }, [running])

  const handleJoin = () => {
    if (!roomInput || !usernameInput) return
    setRoomId(roomInput)
    setUsername(usernameInput)
    navigate(`/battle/${roomInput}`)
  }

  const handleCreate = () => {
    const newRoom = Math.random().toString(36).substring(2, 8)
    setRoomId(newRoom)
    setUsername(usernameInput || 'Player')
    navigate(`/battle/${newRoom}`)
  }

  const formatTime = s =>
    `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(
      2,
      '0'
    )}`

  const diffColor = { Easy: '#10b981', Medium: '#f59e0b', Hard: '#ef4444' }

  return (
    <div
      style={{
        minHeight: '100vh',
        background: '#09090f',
        fontFamily: 'DM Sans, sans-serif',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '40px 20px',
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      <style>{FONTS}</style>
      <style>{`
        @keyframes fadeUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes pulse { 0%,100% { opacity: 1; } 50% { opacity: 0.5; } }
        @keyframes glow { 0%,100% { box-shadow: 0 0 20px rgba(124,58,237,0.3); } 50% { box-shadow: 0 0 40px rgba(124,58,237,0.6); } }
        .mode-btn:hover { transform: scale(1.03); }
        .input-field:focus { border-color: #7c3aed !important; outline: none; }
      `}</style>

      {/* Background glow orbs */}
      <div
        style={{
          position: 'absolute',
          top: '20%',
          left: '15%',
          width: 300,
          height: 300,
          borderRadius: '50%',
          background:
            'radial-gradient(circle, rgba(124,58,237,0.06) 0%, transparent 70%)',
          pointerEvents: 'none'
        }}
      />
      <div
        style={{
          position: 'absolute',
          bottom: '20%',
          right: '15%',
          width: 200,
          height: 200,
          borderRadius: '50%',
          background:
            'radial-gradient(circle, rgba(6,182,212,0.05) 0%, transparent 70%)',
          pointerEvents: 'none'
        }}
      />

      {/* Title */}
      <div
        style={{
          textAlign: 'center',
          marginBottom: 40,
          animation: 'fadeUp 0.4s ease'
        }}
      >
        <p
          style={{
            margin: '0 0 8px',
            fontSize: 12,
            color: '#64748b',
            fontFamily: 'JetBrains Mono, monospace',
            letterSpacing: '0.1em',
            textTransform: 'uppercase'
          }}
        >
          competitive arena
        </p>
        <h1
          style={{
            fontFamily: 'Syne, sans-serif',
            fontSize: 38,
            fontWeight: 800,
            color: '#f1f5f9',
            margin: 0,
            letterSpacing: '-1px'
          }}
        >
          ⚔️ Battle Mode
        </h1>
      </div>

      {/* Mode Select */}
      {!mode && (
        <div
          style={{
            display: 'flex',
            gap: 16,
            flexWrap: 'wrap',
            justifyContent: 'center',
            animation: 'fadeUp 0.5s ease'
          }}
        >
          <button
            className='mode-btn'
            onClick={() => setMode('solo')}
            style={{
              padding: '20px 36px',
              background: '#0f0f1a',
              border: '1px solid #1a1a2e',
              borderRadius: 16,
              color: '#e2e8f0',
              cursor: 'pointer',
              fontFamily: 'Syne, sans-serif',
              fontSize: 16,
              fontWeight: 700,
              transition: 'all 0.2s ease',
              minWidth: 180
            }}
            onMouseEnter={e => {
              e.currentTarget.style.borderColor = '#64748b'
              e.currentTarget.style.background = '#141425'
            }}
            onMouseLeave={e => {
              e.currentTarget.style.borderColor = '#1a1a2e'
              e.currentTarget.style.background = '#0f0f1a'
            }}
          >
            <div style={{ fontSize: 28, marginBottom: 8 }}>🧍</div>
            Solo Battle
            <p
              style={{
                fontSize: 12,
                color: '#64748b',
                fontWeight: 400,
                margin: '4px 0 0',
                fontFamily: 'DM Sans, sans-serif'
              }}
            >
              Race against the clock
            </p>
          </button>

          <button
            className='mode-btn'
            onClick={() => setMode('multi')}
            style={{
              padding: '20px 36px',
              background: 'linear-gradient(135deg, #1e0a3c 0%, #0f0f1a 100%)',
              border: '1px solid #4c1d95',
              borderRadius: 16,
              color: '#e2e8f0',
              cursor: 'pointer',
              fontFamily: 'Syne, sans-serif',
              fontSize: 16,
              fontWeight: 700,
              transition: 'all 0.2s ease',
              minWidth: 180,
              animation: 'glow 3s ease-in-out infinite'
            }}
            onMouseEnter={e => {
              e.currentTarget.style.borderColor = '#7c3aed'
              e.currentTarget.style.background =
                'linear-gradient(135deg, #2d1155 0%, #141425 100%)'
            }}
            onMouseLeave={e => {
              e.currentTarget.style.borderColor = '#4c1d95'
              e.currentTarget.style.background =
                'linear-gradient(135deg, #1e0a3c 0%, #0f0f1a 100%)'
            }}
          >
            <div style={{ fontSize: 28, marginBottom: 8 }}>⚡</div>
            Multiplayer
            <p
              style={{
                fontSize: 12,
                color: '#a78bfa',
                fontWeight: 400,
                margin: '4px 0 0',
                fontFamily: 'DM Sans, sans-serif'
              }}
            >
              Battle real opponents
            </p>
          </button>
        </div>
      )}

      {/* Multiplayer UI */}
      {mode === 'multi' && (
        <div
          style={{
            width: '100%',
            maxWidth: 420,
            background: '#0f0f1a',
            border: '1px solid #1a1a2e',
            borderRadius: 20,
            padding: '32px',
            animation: 'fadeUp 0.4s ease'
          }}
        >
          <div style={{ textAlign: 'center', marginBottom: 28 }}>
            <h2
              style={{
                fontFamily: 'Syne, sans-serif',
                fontSize: 22,
                fontWeight: 800,
                color: '#f1f5f9',
                margin: '0 0 6px'
              }}
            >
              Code Sync
            </h2>
            <p style={{ color: '#64748b', fontSize: 13, margin: 0 }}>
              Real-time battle collaboration
            </p>
          </div>

          <input
            type='text'
            placeholder='Room ID'
            value={roomInput}
            onChange={e => setRoomInput(e.target.value)}
            className='input-field'
            style={{
              width: '100%',
              padding: '12px 16px',
              background: '#09090f',
              border: '1px solid #1a1a2e',
              borderRadius: 10,
              color: '#e2e8f0',
              fontSize: 14,
              fontFamily: 'JetBrains Mono, monospace',
              marginBottom: 12,
              boxSizing: 'border-box',
              transition: 'border-color 0.15s'
            }}
          />

          <input
            type='text'
            placeholder='Username'
            value={usernameInput}
            onChange={e => setUsernameInput(e.target.value)}
            className='input-field'
            style={{
              width: '100%',
              padding: '12px 16px',
              background: '#09090f',
              border: '1px solid #1a1a2e',
              borderRadius: 10,
              color: '#e2e8f0',
              fontSize: 14,
              fontFamily: 'DM Sans, sans-serif',
              marginBottom: 20,
              boxSizing: 'border-box',
              transition: 'border-color 0.15s'
            }}
          />

          <button
            onClick={handleJoin}
            style={{
              width: '100%',
              padding: '13px',
              background: 'rgba(16,185,129,0.12)',
              border: '1px solid rgba(16,185,129,0.4)',
              borderRadius: 10,
              color: '#10b981',
              fontFamily: 'Syne, sans-serif',
              fontSize: 14,
              fontWeight: 700,
              cursor: 'pointer',
              marginBottom: 10,
              transition: 'all 0.15s'
            }}
            onMouseEnter={e =>
              (e.currentTarget.style.background = 'rgba(16,185,129,0.2)')
            }
            onMouseLeave={e =>
              (e.currentTarget.style.background = 'rgba(16,185,129,0.12)')
            }
          >
            Join Room
          </button>

          <button
            onClick={handleCreate}
            style={{
              width: '100%',
              padding: '13px',
              background: '#7c3aed',
              border: 'none',
              borderRadius: 10,
              color: '#fff',
              fontFamily: 'Syne, sans-serif',
              fontSize: 14,
              fontWeight: 700,
              cursor: 'pointer',
              transition: 'all 0.15s'
            }}
            onMouseEnter={e => (e.currentTarget.style.background = '#6d28d9')}
            onMouseLeave={e => (e.currentTarget.style.background = '#7c3aed')}
          >
            Create Room
          </button>

          <button
            onClick={() => setMode(null)}
            style={{
              width: '100%',
              marginTop: 12,
              padding: '8px',
              background: 'transparent',
              border: 'none',
              color: '#64748b',
              cursor: 'pointer',
              fontSize: 13
            }}
          >
            ← Back
          </button>
        </div>
      )}

      {/* Solo Start */}
      {mode === 'solo' && !problem && (
        <div style={{ textAlign: 'center', animation: 'fadeUp 0.4s ease' }}>
          <p style={{ color: '#64748b', marginBottom: 24, fontSize: 14 }}>
            A random problem will be assigned. Ready?
          </p>
          <button
            onClick={startBattle}
            style={{
              padding: '14px 40px',
              background: '#7c3aed',
              border: 'none',
              borderRadius: 12,
              color: '#fff',
              fontFamily: 'Syne, sans-serif',
              fontSize: 16,
              fontWeight: 700,
              cursor: 'pointer',
              transition: 'all 0.15s',
              animation: 'glow 3s ease-in-out infinite'
            }}
            onMouseEnter={e => {
              e.currentTarget.style.background = '#6d28d9'
              e.currentTarget.style.transform = 'scale(1.03)'
            }}
            onMouseLeave={e => {
              e.currentTarget.style.background = '#7c3aed'
              e.currentTarget.style.transform = 'scale(1)'
            }}
          >
            Start Battle ⚔️
          </button>
          <button
            onClick={() => setMode(null)}
            style={{
              display: 'block',
              margin: '14px auto 0',
              background: 'transparent',
              border: 'none',
              color: '#64748b',
              cursor: 'pointer',
              fontSize: 13
            }}
          >
            ← Back
          </button>
        </div>
      )}

      {/* Solo Problem Display */}
      {mode === 'solo' && problem && (
        <div
          style={{
            width: '100%',
            maxWidth: 620,
            background: '#0f0f1a',
            border: '1px solid #1a1a2e',
            borderRadius: 18,
            padding: 28,
            animation: 'fadeUp 0.4s ease'
          }}
        >
          {/* Timer */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: 20
            }}
          >
            <span
              style={{
                fontFamily: 'JetBrains Mono, monospace',
                fontSize: 28,
                fontWeight: 500,
                color: time > 300 ? '#ef4444' : '#10b981',
                animation: running ? 'pulse 2s ease-in-out infinite' : 'none'
              }}
            >
              ⏱ {formatTime(time)}
            </span>
            <span
              style={{
                fontSize: 11,
                color: '#64748b',
                fontFamily: 'JetBrains Mono, monospace',
                background: '#09090f',
                padding: '4px 12px',
                borderRadius: 20,
                border: '1px solid #1a1a2e'
              }}
            >
              LIVE
            </span>
          </div>

          {/* Difficulty */}
          <div style={{ marginBottom: 12 }}>
            <span
              style={{
                fontSize: 11,
                fontFamily: 'JetBrains Mono, monospace',
                fontWeight: 600,
                color: diffColor[problem.difficulty] || '#64748b',
                background: `${diffColor[problem.difficulty] || '#64748b'}18`,
                border: `1px solid ${
                  diffColor[problem.difficulty] || '#64748b'
                }33`,
                padding: '3px 10px',
                borderRadius: 20
              }}
            >
              {problem.difficulty}
            </span>
          </div>

          <h2
            style={{
              fontFamily: 'Syne, sans-serif',
              fontSize: 20,
              fontWeight: 700,
              color: '#f1f5f9',
              marginBottom: 10
            }}
          >
            {problem.title}
          </h2>
          <p
            style={{
              color: '#94a3b8',
              fontSize: 14,
              lineHeight: 1.7,
              marginBottom: 24
            }}
          >
            {problem.description}
          </p>

          <button
            onClick={() => navigate(`/dashboard/practice/${problem.id}`)}
            style={{
              padding: '12px 24px',
              background: '#7c3aed',
              border: 'none',
              borderRadius: 10,
              color: '#fff',
              fontFamily: 'Syne, sans-serif',
              fontSize: 14,
              fontWeight: 700,
              cursor: 'pointer',
              transition: 'all 0.15s'
            }}
            onMouseEnter={e => (e.currentTarget.style.background = '#6d28d9')}
            onMouseLeave={e => (e.currentTarget.style.background = '#7c3aed')}
          >
            Solve Problem →
          </button>
        </div>
      )}
    </div>
  )
}

export default Battle
