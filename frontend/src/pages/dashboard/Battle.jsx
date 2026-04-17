import { useState, useEffect } from 'react'
import { problems } from './practice/problems'
import { useNavigate } from 'react-router-dom'
import { useBattle } from '../../battle/context/BattleContext'

function Battle () {
  const navigate = useNavigate()
  const { setRoomId, setUsername } = useBattle()

  const [problem, setProblem] = useState(null)
  const [time, setTime] = useState(0)
  const [running, setRunning] = useState(false)

  // 🔥 NEW STATE (mode switch)
  const [mode, setMode] = useState(null)

  // 🔥 Start SOLO battle (your original logic)
  const startBattle = () => {
    const random = problems[Math.floor(Math.random() * problems.length)]
    setProblem(random)
    setTime(0)
    setRunning(true)
  }

  // 🔥 Timer (unchanged)
  useEffect(() => {
    let interval

    if (running) {
      interval = setInterval(() => {
        setTime(prev => prev + 1)
      }, 1000)
    }

    return () => clearInterval(interval)
  }, [running])

  // 🔥 NEW: Multiplayer Join
  const handleMultiplayer = () => {
    const room = prompt('Enter Room ID')
    const user = prompt('Enter Username')

    if (!room || !user) return

    setRoomId(room)
    setUsername(user)

    navigate(`/battle/${room}`)
  }

  return (
    <div style={{ padding: '20px' }}>
      <h1>⚔️ Battle Mode</h1>

      {/* 🔥 MODE SELECT */}
      {!mode && (
        <>
          <button onClick={() => setMode('solo')}>Solo Battle</button>

          <button
            onClick={() => {
              setMode('multi')
              handleMultiplayer()
            }}
            style={{ marginLeft: '10px' }}
          >
            Multiplayer Battle
          </button>
        </>
      )}

      {/* 🔥 SOLO MODE (your original UI untouched) */}
      {mode === 'solo' && !problem && (
        <button onClick={startBattle}>Start Battle</button>
      )}

      {mode === 'solo' && problem && (
        <>
          <h3>⏱ Time: {time}s</h3>

          <div
            style={{
              marginTop: '20px',
              padding: '20px',
              border: '1px solid #eee',
              borderRadius: '10px'
            }}
          >
            <h2>{problem.title}</h2>
            <p>{problem.description}</p>
          </div>

          <button
            style={{ marginTop: '20px' }}
            onClick={() => navigate(`/dashboard/practice/${problem.id}`)}
          >
            Solve Problem
          </button>
        </>
      )}
    </div>
  )
}

export default Battle
