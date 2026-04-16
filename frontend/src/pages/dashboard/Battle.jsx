import { useState, useEffect } from 'react'
import { problems } from './practice/problems'
import { useNavigate } from 'react-router-dom'

function Battle () {
  const navigate = useNavigate()

  const [problem, setProblem] = useState(null)
  const [time, setTime] = useState(0)
  const [running, setRunning] = useState(false)

  // 🔥 Start battle
  const startBattle = () => {
    const random = problems[Math.floor(Math.random() * problems.length)]
    setProblem(random)
    setTime(0)
    setRunning(true)
  }

  // 🔥 Timer
  useEffect(() => {
    let interval

    if (running) {
      interval = setInterval(() => {
        setTime(prev => prev + 1)
      }, 1000)
    }

    return () => clearInterval(interval)
  }, [running])

  return (
    <div style={{ padding: '20px' }}>
      <h1>⚔️ Battle Mode</h1>

      {!problem ? (
        <button onClick={startBattle}>Start Battle</button>
      ) : (
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
