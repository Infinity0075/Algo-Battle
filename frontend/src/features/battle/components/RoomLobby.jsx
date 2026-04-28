import { useState } from 'react'
import { getSocket } from '../services/socket'
import { useBattle } from '../context/useBattle'

export default function RoomLobby ({ players = [], isHost }) {
  const { roomId } = useBattle()
  const [copied, setCopied] = useState(false)

  const handleStart = () => {
    const socket = getSocket()
    if (socket?.connected) {
      socket.emit('start_battle', { roomId })
    }
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
    <div className='flex items-center justify-center min-h-screen bg-[#05050a] text-white px-4'>
      <div className='w-full max-w-md space-y-6'>
        <div className='text-center space-y-2'>
          <h1 className='text-3xl font-bold'>⚔️ Battle Lobby</h1>
          <p className='text-slate-400 text-sm'>
            {isHost
              ? 'Start the battle when everyone is ready'
              : 'Waiting for host to start the battle...'}
          </p>
        </div>

        <div className='bg-[#0f0f1a] border border-[#1a1a2e] rounded-xl p-5 flex justify-between items-center shadow-[0_0_30px_rgba(124,58,237,0.15)]'>
          <div>
            <p className='text-xs text-slate-500 mb-1'>Room ID</p>
            <p className='font-mono text-lg tracking-widest'>{roomId}</p>
          </div>

          <button
            onClick={handleCopy}
            className='px-4 py-2 text-sm bg-violet-600 hover:bg-violet-700 rounded-md transition'
          >
            {copied ? 'Copied!' : 'Copy'}
          </button>
        </div>

        <div className='bg-[#0f0f1a] border border-[#1a1a2e] rounded-xl p-5 space-y-3'>
          <div className='flex justify-between items-center'>
            <h2 className='text-sm font-semibold text-slate-300'>👥 Players</h2>
            <span className='text-xs text-slate-500'>{players.length}/2</span>
          </div>

          <div className='space-y-2'>
            {players.map((p, i) => (
              <div
                key={p.id || i}
                className='flex justify-between items-center bg-[#151528] px-3 py-2 rounded-lg'
              >
                <span className='text-sm'>{p.username || p}</span>
                <span className='text-xs text-slate-400'>#{i + 1}</span>
              </div>
            ))}
          </div>

          {players.length === 0 && (
            <p className='text-slate-500 text-sm'>Waiting for players...</p>
          )}
        </div>

        {isHost ? (
          <button
            onClick={handleStart}
            disabled={players.length < 2}
            className='w-full py-3 rounded-xl bg-violet-600 hover:bg-violet-700 disabled:opacity-50 transition font-semibold shadow-[0_0_20px_rgba(124,58,237,0.4)]'
          >
            Start Battle 🚀
          </button>
        ) : (
          <div className='bg-[#0f0f1a] border border-[#1a1a2e] rounded-xl p-4 text-center text-sm text-slate-500'>
            ⏳ Waiting for host...
          </div>
        )}
      </div>
    </div>
  )
}
