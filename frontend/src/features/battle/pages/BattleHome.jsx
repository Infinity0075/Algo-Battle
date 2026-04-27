import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useBattle } from '../context/useBattle'
import { getRandomProblem } from '../services/battleService' // 🔧 USE API

function Battle () {
  const navigate = useNavigate()
  const { setRoomId, setUsername } = useBattle()

  const [mode, setMode] = useState(null)
  const [roomInput, setRoomInput] = useState('')
  const [usernameInput, setUsernameInput] = useState('')
  const [createdRoom, setCreatedRoom] = useState('')

  // 🔥 SOLO MODE → FETCH FROM BACKEND
  const startBattle = async () => {
    const problem = await getRandomProblem()
    if (!problem) return

    const path = problem.slug || problem._id

    navigate(`/dashboard/practice/${path}`)
  }

  // 🔥 MULTIPLAYER
  const handleJoin = () => {
    if (!roomInput || !usernameInput) return

    setRoomId(roomInput)
    setUsername(usernameInput)

    navigate(`/battle/${roomInput}`)
  }

  const generateRoomId = () =>
    Math.random().toString(36).substring(2, 6).toUpperCase()

  const handleCreate = () => {
    const newRoom = generateRoomId()

    setCreatedRoom(newRoom)
    setRoomId(newRoom)
    setUsername(usernameInput || 'Player')

    navigate(`/battle/${newRoom}`)
  }

  return (
    <div className='min-h-screen bg-[#05050a] text-white flex flex-col items-center justify-center px-4'>
      {/* TITLE */}
      <div className='text-center mb-10'>
        <h1 className='text-4xl font-extrabold'>⚔️ Battle Mode</h1>
      </div>

      {/* MODE SELECT */}
      {!mode && (
        <div className='flex gap-5'>
          <button
            onClick={() => setMode('solo')}
            className='bg-[#0f0f1a] border border-[#1a1a2e] rounded-2xl px-8 py-6 hover:scale-105'
          >
            🧍 Solo
          </button>

          <button
            onClick={() => setMode('multi')}
            className='bg-[#0f0f1a] border border-violet-700 rounded-2xl px-8 py-6 hover:scale-105'
          >
            ⚡ Multiplayer
          </button>
        </div>
      )}

      {/* MULTIPLAYER */}
      {mode === 'multi' && (
        <div className='w-full max-w-md bg-[#0f0f1a] border border-[#1a1a2e] rounded-2xl p-6'>
          <input
            placeholder='Room ID'
            value={roomInput}
            onChange={e => setRoomInput(e.target.value)}
            className='w-full mb-3 p-3 bg-[#09090f] border border-[#1a1a2e]'
          />

          <input
            placeholder='Username'
            value={usernameInput}
            onChange={e => setUsernameInput(e.target.value)}
            className='w-full mb-4 p-3 bg-[#09090f] border border-[#1a1a2e]'
          />

          <button
            onClick={handleJoin}
            className='w-full py-3 mb-2 bg-emerald-600 rounded'
          >
            Join Room
          </button>

          <button
            onClick={handleCreate}
            className='w-full py-3 bg-violet-600 rounded'
          >
            Create Room
          </button>

          {createdRoom && (
            <p className='text-sm mt-3 text-center'>Room: {createdRoom}</p>
          )}
        </div>
      )}

      {/* SOLO */}
      {mode === 'solo' && (
        <button
          onClick={startBattle}
          className='px-10 py-4 bg-violet-600 rounded-xl font-bold'
        >
          Start Solo Battle ⚔️
        </button>
      )}
    </div>
  )
}

export default Battle
