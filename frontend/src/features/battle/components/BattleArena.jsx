import { useEffect, useState } from 'react'
import Editor from './Editor'
import Timer from './Timer'
import { getSocket, sendCodeChange, sendSubmit } from '../services/socket'

export default function BattleArena ({
  startTime,
  leaderboard = [],
  problem,
  username
}) {
  const [code, setCode] = useState('// Start coding...')
  const [submissions, setSubmissions] = useState([])

  useEffect(() => {
    const socket = getSocket()
    if (!socket) return // 🔧 safety

    // 🔥 CODE SYNC
    socket.on('code_update', incomingCode => {
      setCode(incomingCode)
    })

    // 🔥 ACTIVITY LOG
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

  // 🔥 FIX: no fake response handling (server emits result)
  const handleSubmit = () => {
    sendSubmit(code)
  }

  if (!problem) {
    return <div className='text-white p-6'>Loading problem...</div>
  }

  return (
    <div className='grid grid-cols-2 h-screen bg-[#05050a] text-white'>
      {/* LEFT */}
      <div className='p-6 border-r border-[#1a1a2e] overflow-y-auto'>
        {/* Problem */}
        <div className='mb-6'>
          <h2 className='text-xl font-bold mb-2'>📘 Problem</h2>
          <p className='text-slate-300 text-sm font-semibold'>
            {problem.title}
          </p>
          <p className='text-slate-500 text-xs mt-2 line-clamp-4'>
            {problem.description}
          </p>
        </div>

        {/* Leaderboard */}
        <div>
          <h3 className='text-lg font-semibold mb-3'>🏆 Leaderboard</h3>

          <div className='space-y-2'>
            {leaderboard.length === 0 && (
              <p className='text-slate-500 text-sm'>No submissions yet</p>
            )}

            {leaderboard.map((p, i) => (
              <div
                key={i}
                className='flex justify-between items-center bg-[#0f0f1a] border border-[#1a1a2e] px-3 py-2 rounded-lg'
              >
                <span className='text-sm'>
                  #{i + 1} {p.username}
                </span>
                <span className='text-xs text-emerald-400'>
                  {(p.time / 1000).toFixed(2)}s {/* 🔧 better UX */}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Activity */}
        <div className='mt-6'>
          <h3 className='text-lg font-semibold mb-2'>⚡ Activity</h3>

          <div className='space-y-1 text-sm max-h-40 overflow-y-auto'>
            {submissions.map((s, i) => (
              <div key={i} className='text-slate-400'>
                {s.username} → {s.status}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* RIGHT */}
      <div className='flex flex-col'>
        {/* Top Bar */}
        <div className='flex justify-between items-center px-4 py-2 border-b border-[#1a1a2e]'>
          <Timer startTime={startTime} />

          <button
            onClick={handleSubmit}
            className='px-4 py-1.5 bg-emerald-500 hover:bg-emerald-600 rounded-md text-sm font-semibold shadow-[0_0_10px_rgba(16,185,129,0.5)]'
          >
            Submit ⚡
          </button>
        </div>

        {/* Editor */}
        <div className='flex-1'>
          <Editor
            mode='battle'
            externalCode={code}
            setExternalCode={handleCodeChange}
            problem={problem} // 🔧 pass for starterCode
          />
        </div>
      </div>
    </div>
  )
}
