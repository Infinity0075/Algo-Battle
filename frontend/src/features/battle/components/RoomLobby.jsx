import { getSocket } from '../services/socket'

export default function RoomLobby ({ players = [], isHost }) {
  const handleStart = () => {
    const socket = getSocket()
    socket.emit('start_battle')
  }

  return (
    <div className='flex items-center justify-center min-h-screen bg-[#05050a] text-white'>
      <div className='bg-[#0f0f1a] border border-[#1a1a2e] rounded-2xl p-8 w-full max-w-md text-center shadow-[0_0_40px_rgba(124,58,237,0.2)]'>
        <h1 className='text-2xl font-bold mb-6'>⚔️ Battle Lobby</h1>

        {/* Players */}
        <div className='space-y-2 mb-6'>
          {players.map(p => (
            <div
              key={p.id}
              className='bg-[#09090f] border border-[#1a1a2e] px-3 py-2 rounded-lg text-sm'
            >
              🧑 {p.username}
            </div>
          ))}

          {players.length === 0 && (
            <p className='text-slate-500 text-sm'>Waiting for players...</p>
          )}
        </div>

        {/* Start Button */}
        {isHost && (
          <button
            onClick={handleStart}
            className='w-full py-3 bg-violet-600 hover:bg-violet-700 rounded-lg font-semibold shadow-[0_0_15px_rgba(124,58,237,0.5)]'
          >
            Start Battle 🚀
          </button>
        )}
      </div>
    </div>
  )
}
