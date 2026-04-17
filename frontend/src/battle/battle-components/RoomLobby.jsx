import { getSocket } from '../services/socket'

export default function RoomLobby ({ players, isHost }) {
  const handleStart = () => {
    const socket = getSocket()
    socket.emit('start_battle')
  }

  return (
    <div className='flex flex-col items-center justify-center h-screen'>
      <h1 className='text-3xl mb-6'>Room Lobby</h1>

      <div className='bg-gray-800 p-6 rounded w-80'>
        {players.map(p => (
          <div key={p.id} className='bg-gray-700 p-2 mb-2 rounded'>
            {p.username}
          </div>
        ))}

        {isHost && (
          <button
            onClick={handleStart}
            className='mt-4 w-full bg-green-600 p-2 rounded'
          >
            Start Battle
          </button>
        )}
      </div>
    </div>
  )
}
