import { useState, useEffect } from 'react'
import { problems } from './practice/problems'
import { useNavigate } from 'react-router-dom'
import { useBattle } from '../context/BattleContext'

function Battle () {
  const navigate = useNavigate()
  const { setRoomId, setUsername } = useBattle()

  const [problem, setProblem] = useState(null)
  const [time, setTime] = useState(0)
  const [running, setRunning] = useState(false)
  const [mode, setMode] = useState(null)

  const [roomInput, setRoomInput] = useState('')
  const [usernameInput, setUsernameInput] = useState('')
  const [createdRoom, setCreatedRoom] = useState('')

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
  const generateRoomId = () => {
    return Math.random().toString(36).substring(2, 6).toUpperCase()
  }
  const handleCreate = () => {
    const newRoom = generateRoomId()
    setCreatedRoom(newRoom)

    setRoomId(newRoom)
    setUsername(usernameInput || 'Player')

    navigate(`/battle/${newRoom}`)
  }

  const formatTime = s =>
    `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(
      2,
      '0'
    )}`

  const diffColor = {
    Easy: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
    Medium: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
    Hard: 'text-red-400 bg-red-500/10 border-red-500/20'
  }

  return (
    <div className='min-h-screen bg-[#05050a] text-white flex flex-col items-center justify-center px-4 relative overflow-hidden'>
      {/* Glow Background */}
      <div className='absolute w-[300px] h-[300px] bg-violet-600/10 blur-3xl rounded-full top-20 left-20' />
      <div className='absolute w-[200px] h-[200px] bg-cyan-500/10 blur-3xl rounded-full bottom-20 right-20' />

      {/* Title */}
      <div className='text-center mb-10 animate-fadeUp'>
        <p className='text-xs tracking-widest text-slate-500 uppercase mb-2 font-mono'>
          competitive arena
        </p>
        <h1 className='text-4xl font-extrabold tracking-tight'>
          ⚔️ Battle Mode
        </h1>
      </div>

      {/* MODE SELECT */}
      {!mode && (
        <div className='flex gap-5 flex-wrap justify-center'>
          {/* Solo */}
          <button
            onClick={() => setMode('solo')}
            className='bg-[#0f0f1a] border border-[#1a1a2e] rounded-2xl px-8 py-6 min-w-[180px] hover:scale-105 transition'
          >
            <div className='text-3xl mb-2'>🧍</div>
            <div className='font-bold'>Solo Battle</div>
            <p className='text-xs text-slate-500 mt-1'>Race against time</p>
          </button>

          {/* Multiplayer */}
          <button
            onClick={() => setMode('multi')}
            className='bg-gradient-to-br from-violet-900/40 to-[#0f0f1a] border border-violet-700 rounded-2xl px-8 py-6 min-w-[180px] hover:scale-105 transition shadow-[0_0_25px_rgba(124,58,237,0.3)]'
          >
            <div className='text-3xl mb-2'>⚡</div>
            <div className='font-bold'>Multiplayer</div>
            <p className='text-xs text-violet-400 mt-1'>Real opponents</p>
          </button>
        </div>
      )}

      {/* MULTIPLAYER */}
      {mode === 'multi' && (
        <div className='w-full max-w-md bg-[#0f0f1a] border border-[#1a1a2e] rounded-2xl p-8'>
          <div className='text-center mb-6'>
            <h2 className='text-xl font-bold'>Code Sync</h2>
            <p className='text-sm text-slate-500'>Join or create room</p>
          </div>

          <input
            placeholder='Room ID'
            value={roomInput}
            onChange={e => setRoomInput(e.target.value)}
            className='w-full mb-3 px-4 py-3 bg-[#09090f] border border-[#1a1a2e] rounded-lg outline-none focus:border-violet-500'
          />

          <input
            placeholder='Username'
            value={usernameInput}
            onChange={e => setUsernameInput(e.target.value)}
            className='w-full mb-4 px-4 py-3 bg-[#09090f] border border-[#1a1a2e] rounded-lg outline-none focus:border-violet-500'
          />

          <button
            onClick={handleJoin}
            className='w-full py-3 mb-2 bg-emerald-500/10 border border-emerald-500 text-emerald-400 rounded-lg hover:bg-emerald-500/20'
          >
            Join Room
          </button>

          <button
            onClick={handleCreate}
            className='w-full py-3 bg-violet-600 hover:bg-violet-700 rounded-lg font-semibold'
          >
            Create Room
          </button>
          {createdRoom && (
            <p className='text-sm text-slate-400 mt-3 text-center'>
              Room Created:
              <span className='text-violet-400 font-mono ml-2'>
                {createdRoom}
              </span>
            </p>
          )}
          {createdRoom && (
            <button
              onClick={() => navigator.clipboard.writeText(createdRoom)}
              className='mt-2 text-xs text-slate-500 hover:text-white'
            >
              Copy Room ID
            </button>
          )}

          <button
            onClick={() => setMode(null)}
            className='w-full mt-3 text-sm text-slate-500'
          >
            ← Back
          </button>
        </div>
      )}

      {/* SOLO START */}
      {mode === 'solo' && !problem && (
        <div className='text-center'>
          <p className='text-slate-500 mb-6'>Ready for a random challenge?</p>

          <button
            onClick={startBattle}
            className='px-10 py-4 bg-violet-600 hover:bg-violet-700 rounded-xl font-bold shadow-[0_0_20px_rgba(124,58,237,0.5)]'
          >
            Start Battle ⚔️
          </button>

          <button
            onClick={() => setMode(null)}
            className='block mt-4 text-sm text-slate-500'
          >
            ← Back
          </button>
        </div>
      )}

      {/* SOLO GAME */}
      {mode === 'solo' && problem && (
        <div className='w-full max-w-2xl bg-[#0f0f1a] border border-[#1a1a2e] rounded-2xl p-6'>
          {/* Timer */}
          <div className='flex justify-between mb-5'>
            <span
              className={`text-2xl font-mono ${
                time > 300 ? 'text-red-400' : 'text-emerald-400'
              }`}
            >
              ⏱ {formatTime(time)}
            </span>
            <span className='text-xs border px-3 py-1 rounded-full text-slate-400 border-[#1a1a2e]'>
              LIVE
            </span>
          </div>

          {/* Difficulty */}
          <span
            className={`text-xs px-3 py-1 rounded-full border ${
              diffColor[problem.difficulty]
            }`}
          >
            {problem.difficulty}
          </span>

          <h2 className='text-xl font-bold mt-3 mb-2'>{problem.title}</h2>

          <p className='text-slate-400 text-sm mb-6'>{problem.description}</p>

          <button
            onClick={() => navigate(`/dashboard/practice/${problem.id}`)}
            className='px-6 py-3 bg-violet-600 hover:bg-violet-700 rounded-lg font-semibold'
          >
            Solve Problem →
          </button>
        </div>
      )}
    </div>
  )
}

export default Battle
