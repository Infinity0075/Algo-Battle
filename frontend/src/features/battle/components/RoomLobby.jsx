import { useState } from 'react'
import { getSocket } from '../services/socket'
import { useBattle } from '../context/useBattle'

export default function RoomLobby ({ players = [], isHost }) {
  const { roomId } = useBattle()
  const [copied, setCopied] = useState(false)

  const handleStart = () => {
    const socket = getSocket()
    if (socket?.connected) socket.emit('start_battle', { roomId })
  }

  const handleCopy = async () => {
    if (!roomId) return
    try {
      await navigator.clipboard.writeText(roomId)
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    } catch {
      console.error('Copy failed')
    }
  }

  return (
    <div style={s.page}>
      {/* animated bg lines */}
      <div style={s.grid} aria-hidden='true' />
      <div style={s.glow} aria-hidden='true' />

      <div style={s.card}>
        {/* Header */}
        <div style={s.header}>
          <div style={s.swordRow}>
            <span style={s.sword}>⚔</span>
          </div>
          <h1 style={s.title}>Battle Lobby</h1>
          <p style={s.subtitle}>
            {isHost
              ? 'Start when everyone is ready'
              : 'Waiting for host to start…'}
          </p>
        </div>

        {/* Room ID */}
        <div style={s.roomBox}>
          <div>
            <p style={s.roomLabel}>ROOM CODE</p>
            <p style={s.roomId}>{roomId}</p>
          </div>
          <button
            onClick={handleCopy}
            style={{
              ...s.copyBtn,
              background: copied
                ? 'rgba(34,197,94,0.15)'
                : 'rgba(99,102,241,0.15)',
              borderColor: copied
                ? 'rgba(34,197,94,0.4)'
                : 'rgba(99,102,241,0.4)',
              color: copied ? '#4ade80' : '#818cf8'
            }}
          >
            {copied ? '✓ Copied' : 'Copy'}
          </button>
        </div>

        {/* Players */}
        <div style={s.playersBox}>
          <div style={s.playersHeader}>
            <span style={s.playersLabel}>PLAYERS</span>
            <span style={s.playersCount}>{players.length} / 2</span>
          </div>

          <div style={s.playersList}>
            {players.length === 0 && (
              <div style={s.emptyPlayers}>
                <div style={s.waitingDot} />
                <span>Waiting for players to join…</span>
              </div>
            )}
            {players.map((p, i) => (
              <div key={p.id || i} style={s.playerRow}>
                <div style={s.playerLeft}>
                  <div
                    style={{
                      ...s.playerAvatar,
                      background:
                        i === 0
                          ? 'rgba(99,102,241,0.2)'
                          : 'rgba(239,68,68,0.2)',
                      border: `1px solid ${
                        i === 0 ? 'rgba(99,102,241,0.4)' : 'rgba(239,68,68,0.4)'
                      }`,
                      color: i === 0 ? '#818cf8' : '#f87171'
                    }}
                  >
                    {(p.username || p)?.[0]?.toUpperCase()}
                  </div>
                  <span style={s.playerName}>{p.username || p}</span>
                </div>
                <span
                  style={{
                    ...s.playerBadge,
                    background:
                      i === 0 ? 'rgba(99,102,241,0.1)' : 'rgba(239,68,68,0.1)',
                    color: i === 0 ? '#818cf8' : '#f87171'
                  }}
                >
                  {i === 0 ? 'Host' : 'Challenger'}
                </span>
              </div>
            ))}

            {/* Empty slots */}
            {Array.from({ length: Math.max(0, 2 - players.length) }).map(
              (_, i) => (
                <div key={`empty-${i}`} style={s.emptySlot}>
                  <div style={s.emptyAvatar}>?</div>
                  <span style={{ color: '#3a3a50', fontSize: 13 }}>
                    Waiting…
                  </span>
                </div>
              )
            )}
          </div>
        </div>

        {/* CTA */}
        {isHost ? (
          <button
            onClick={handleStart}
            disabled={players.length < 2}
            style={{
              ...s.startBtn,
              opacity: players.length < 2 ? 0.45 : 1,
              cursor: players.length < 2 ? 'not-allowed' : 'pointer'
            }}
            onMouseEnter={e => {
              if (players.length >= 2)
                e.currentTarget.style.transform = 'translateY(-2px)'
              e.currentTarget.style.boxShadow =
                '0 12px 40px rgba(99,102,241,0.5)'
            }}
            onMouseLeave={e => {
              e.currentTarget.style.transform = 'none'
              e.currentTarget.style.boxShadow =
                '0 4px 20px rgba(99,102,241,0.3)'
            }}
          >
            <span>Start Battle</span>
            <span style={{ fontSize: 18 }}>🚀</span>
          </button>
        ) : (
          <div style={s.waitingBox}>
            <div style={s.waitingDot} />
            <span>Waiting for host to start the battle…</span>
          </div>
        )}
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Mono:wght@400;700&family=Sora:wght@400;500;600;700&display=swap');
        @keyframes pulse { 0%,100%{opacity:.4;transform:scale(1)} 50%{opacity:1;transform:scale(1.3)} }
        @keyframes fadeUp { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
        @keyframes spin { to{transform:rotate(360deg)} }
      `}</style>
    </div>
  )
}

const s = {
  page: {
    minHeight: '100vh',
    background: '#0d0d14',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontFamily: "'Sora', sans-serif",
    position: 'relative',
    overflow: 'hidden',
    padding: 16
  },
  grid: {
    position: 'absolute',
    inset: 0,
    pointerEvents: 'none',
    backgroundImage: `linear-gradient(rgba(99,102,241,0.04) 1px,transparent 1px),linear-gradient(90deg,rgba(99,102,241,0.04) 1px,transparent 1px)`,
    backgroundSize: '40px 40px'
  },
  glow: {
    position: 'absolute',
    top: '20%',
    left: '50%',
    transform: 'translateX(-50%)',
    width: 500,
    height: 300,
    borderRadius: '50%',
    pointerEvents: 'none',
    background:
      'radial-gradient(ellipse, rgba(99,102,241,0.08) 0%, transparent 70%)'
  },
  card: {
    width: '100%',
    maxWidth: 420,
    position: 'relative',
    zIndex: 1,
    background: '#13131e',
    border: '1px solid #1f1f30',
    borderRadius: 24,
    padding: 32,
    display: 'flex',
    flexDirection: 'column',
    gap: 20,
    boxShadow: '0 0 0 1px rgba(99,102,241,0.05), 0 24px 80px rgba(0,0,0,0.6)',
    animation: 'fadeUp 0.5s ease both'
  },
  header: {
    textAlign: 'center',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 8
  },
  swordRow: { fontSize: 32, marginBottom: 4 },
  sword: { display: 'inline-block' },
  title: {
    fontSize: 26,
    fontWeight: 700,
    color: '#f1f0ff',
    margin: 0,
    letterSpacing: '-0.5px'
  },
  subtitle: { fontSize: 13, color: '#6b7280', margin: 0 },
  roomBox: {
    background: '#0d0d14',
    border: '1px solid #1f1f30',
    borderRadius: 14,
    padding: '14px 18px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  roomLabel: {
    fontSize: 10,
    fontWeight: 700,
    letterSpacing: '0.15em',
    color: '#4b4b60',
    margin: '0 0 4px'
  },
  roomId: {
    fontFamily: "'Space Mono', monospace",
    fontSize: 18,
    color: '#e8e8f0',
    margin: 0,
    letterSpacing: '0.1em'
  },
  copyBtn: {
    padding: '8px 16px',
    borderRadius: 10,
    border: '1px solid',
    fontSize: 13,
    fontWeight: 600,
    cursor: 'pointer',
    fontFamily: "'Sora', sans-serif",
    transition: 'all 0.2s'
  },
  playersBox: {
    background: '#0d0d14',
    border: '1px solid #1f1f30',
    borderRadius: 14,
    padding: 18,
    display: 'flex',
    flexDirection: 'column',
    gap: 14
  },
  playersHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  playersLabel: {
    fontSize: 10,
    fontWeight: 700,
    letterSpacing: '0.15em',
    color: '#4b4b60'
  },
  playersCount: {
    fontSize: 12,
    color: '#6366f1',
    fontWeight: 600,
    fontFamily: "'Space Mono', monospace"
  },
  playersList: { display: 'flex', flexDirection: 'column', gap: 8 },
  playerRow: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    background: '#13131e',
    border: '1px solid #1f1f30',
    borderRadius: 10,
    padding: '10px 14px'
  },
  playerLeft: { display: 'flex', alignItems: 'center', gap: 10 },
  playerAvatar: {
    width: 30,
    height: 30,
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 13,
    fontWeight: 700
  },
  playerName: { fontSize: 14, color: '#e8e8f0', fontWeight: 500 },
  playerBadge: {
    fontSize: 11,
    fontWeight: 600,
    padding: '3px 10px',
    borderRadius: 100
  },
  emptySlot: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    background: '#0d0d14',
    border: '1px dashed #1f1f30',
    borderRadius: 10,
    padding: '10px 14px'
  },
  emptyAvatar: {
    width: 30,
    height: 30,
    borderRadius: '50%',
    background: '#1a1a28',
    border: '1px dashed #2a2a3a',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 13,
    color: '#3a3a50'
  },
  emptyPlayers: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    color: '#4b4b60',
    fontSize: 13
  },
  waitingDot: {
    width: 8,
    height: 8,
    borderRadius: '50%',
    background: '#6366f1',
    flexShrink: 0,
    animation: 'pulse 1.4s ease-in-out infinite'
  },
  startBtn: {
    width: '100%',
    padding: '14px',
    borderRadius: 14,
    border: 'none',
    background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
    color: '#fff',
    fontSize: 15,
    fontWeight: 700,
    fontFamily: "'Sora', sans-serif",
    letterSpacing: 0.3,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    boxShadow: '0 4px 20px rgba(99,102,241,0.3)',
    transition: 'transform 0.15s, box-shadow 0.15s'
  },
  waitingBox: {
    background: '#0d0d14',
    border: '1px solid #1f1f30',
    borderRadius: 14,
    padding: '14px 18px',
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    color: '#6b7280',
    fontSize: 13,
    justifyContent: 'center'
  }
}
