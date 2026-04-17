import { useEffect, useState } from 'react'
import Editor from './Editor'
import Timer from './Timer'
import { getSocket, sendCodeChange, sendSubmit } from '../services/socket'

export default function BattleArena ({ startTime, leaderboard }) {
  const [code, setCode] = useState('// Start coding...')
  const [submissions, setSubmissions] = useState([])

  useEffect(() => {
    const socket = getSocket()

    socket.on('code_update', incomingCode => {
      setCode(incomingCode)
    })

    socket.on('submission_result', data => {
      setSubmissions(prev => [...prev, data])
    })

    return () => {
      socket.off('code_update')
      socket.off('submission_result')
    }
  }, [])

  const handleCodeChange = val => {
    setCode(val)
    sendCodeChange(val)
  }

  const handleSubmit = () => {
    sendSubmit(code)
  }

  return (
    <div className='grid grid-cols-2 h-screen'>
      <div className='p-6 bg-gray-800'>
        <h2>Problem</h2>
        <p>Reverse a string</p>

        <h3 className='mt-4'>Leaderboard</h3>
        {leaderboard.map((p, i) => (
          <div key={i}>
            #{i + 1} {p.username} - {p.time}ms
          </div>
        ))}
      </div>

      <div className='flex flex-col'>
        <Timer startTime={startTime} />

        <Editor
          mode='battle'
          externalCode={code}
          setExternalCode={handleCodeChange}
        />

        <button onClick={handleSubmit} className='bg-green-600 p-2'>
          Submit
        </button>
      </div>
    </div>
  )
}
