import { useState } from 'react'
import { getSocket } from '../services/socket'
import PlayerList from './PlayerList'
import { useBattle } from '../context/useBattle' // 🔥 add this

export default function RoomLobby ({ players = [], isHost }) {
  const { roomId } = useBattle() // 🔥 get room id
  const [copied, setCopied] = useState(false)

  const handleStart = () => {
    const socket = getSocket()
    console.log('🔥 START CLICKED', socket?.id, socket?.connected)

    if (socket?.connected) {
      socket.emit('start_battle')
    }
  }

  const handleCopy = async () => {
    if (!roomId) return

    try {
      await navigator.clipboard.writeText(roomId)
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    } catch (err) {
      console.error('Copy failed')
    }
  }

  return (
    <div className='flex items-center justify-center min-h-screen bg-[#05050a] text-white'>
      <div className='bg-[#0f0f1a] border border-[#1a1a2e] rounded-2xl p-8 w-full max-w-md text-center shadow-[0_0_40px_rgba(124,58,237,0.2)]'>
        <h1 className='text-2xl font-bold mb-2'>⚔️ Battle Lobby</h1>
        <p className='text-slate-500 text-sm mb-4'>
          Waiting for players to join...
        </p>

        {/* 🔥 ROOM ID SECTION */}
        <div className='mb-6'>
          <p className='text-xs text-slate-400 mb-1'>Room ID</p>

          <div className='flex items-center justify-between bg-[#09090f] border border-[#1a1a2e] px-3 py-2 rounded-lg'>
            <span className='font-mono tracking-widest'>
              {roomId || '----'}
            </span>

            <button
              onClick={handleCopy}
              className='text-xs px-2 py-1 bg-violet-600 hover:bg-violet-700 rounded'
            >
              {copied ? 'Copied!' : 'Copy'}
            </button>
          </div>
        </div>

        {/* 🔥 PLAYER LIST */}
        <div className='mb-6 text-left'>
          <PlayerList players={players} />
        </div>

        {/* 🔥 START BUTTON */}
        {isHost ? (
          <button
            onClick={handleStart}
            disabled={players.length < 2} // 🔥 FIXED (min 2 players)
            className='w-full py-3 bg-violet-600 hover:bg-violet-700 disabled:opacity-50 rounded-lg font-semibold shadow-[0_0_15px_rgba(124,58,237,0.5)]'
          >
            Start Battle 🚀
          </button>
        ) : (
          <p className='text-slate-500 text-sm'>Waiting for host to start...</p>
        )}
      </div>
    </div>
  )
}
