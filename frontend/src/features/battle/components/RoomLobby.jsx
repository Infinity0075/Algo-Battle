import { getSocket } from '../services/socket'
import PlayerList from './PlayerList' // 🔧 USE COMPONENT

export default function RoomLobby ({ players = [], isHost }) {
  const handleStart = () => {
    const socket = getSocket()
    if (socket?.connected) {
      socket.emit('start_battle')
    }
  }

  return (
    <div className='flex items-center justify-center min-h-screen bg-[#05050a] text-white'>
      <div className='bg-[#0f0f1a] border border-[#1a1a2e] rounded-2xl p-8 w-full max-w-md text-center shadow-[0_0_40px_rgba(124,58,237,0.2)]'>
        <h1 className='text-2xl font-bold mb-2'>⚔️ Battle Lobby</h1>
        <p className='text-slate-500 text-sm mb-6'>
          Waiting for players to join...
        </p>

        {/* 🔥 PLAYER LIST */}
        <div className='mb-6 text-left'>
          <PlayerList players={players} />
        </div>

        {/* 🔥 START BUTTON */}
        {isHost ? (
          <button
            onClick={handleStart}
            disabled={players.length < 1} // 🔧 safety
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
