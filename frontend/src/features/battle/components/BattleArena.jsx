import { useEffect, useState } from 'react'
import Editor from './Editor'
import Timer from './Timer'
import { getSocket, sendCodeChange, sendSubmit } from '../services/socket'

export default function BattleArena ({ problem, startTime, leaderboard }) {
  const [code, setCode] = useState('')
  const [submissions, setSubmissions] = useState([])

  // ✅ Load starter code once
  useEffect(() => {
    if (!problem) return

    const starter = problem?.starterCode?.javascript || '// Start coding...'

    setCode(starter)
  }, [problem])

  useEffect(() => {
    const socket = getSocket()
    if (!socket) return

    // 🔥 CODE SYNC
    socket.on('code_update', payload => {
      setCode(typeof payload === 'string' ? payload : payload.code)
    })

    // 🔥 SUBMISSION RESULT
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
    sendSubmit(code, 'javascript')
  }

  if (!problem) {
    return (
      <div className='flex items-center justify-center w-full text-white'>
        Loading battle...
      </div>
    )
  }

  return (
    <div className='flex h-full bg-[#05050a] text-white'>
      {/* 🔥 LEFT PANEL */}
      <div className='w-1/2 border-r border-[#1a1a2e] overflow-y-auto p-6'>
        {/* PROBLEM */}
        <div className='mb-6'>
          <h2 className='text-xl font-bold mb-3'>{problem.title}</h2>

          <p className='text-slate-300 whitespace-pre-wrap leading-relaxed'>
            {problem.description}
          </p>
        </div>

        {/* EXAMPLES */}
        {problem.examples?.length > 0 && (
          <div className='mb-6'>
            <h3 className='text-sm font-semibold text-slate-400 mb-2'>
              Examples
            </h3>

            {problem.examples.map((ex, i) => (
              <div
                key={i}
                className='bg-[#0f0f1a] border border-[#1a1a2e] p-3 rounded mb-2 text-sm font-mono'
              >
                <div className='text-slate-500'>Input:</div>
                <pre className='text-cyan-400'>{ex.input}</pre>

                <div className='text-slate-500 mt-2'>Output:</div>
                <pre className='text-emerald-400'>{ex.output}</pre>
              </div>
            ))}
          </div>
        )}

        {/* LEADERBOARD */}
        <div className='mb-6'>
          <h3 className='text-sm font-semibold text-slate-400 mb-2'>
            🏆 Leaderboard
          </h3>

          {leaderboard?.length === 0 ? (
            <p className='text-slate-500 text-sm'>No submissions yet</p>
          ) : (
            <div className='space-y-2'>
              {leaderboard.map((p, i) => (
                <div
                  key={i}
                  className='flex justify-between bg-[#0f0f1a] border border-[#1a1a2e] px-3 py-2 rounded'
                >
                  <span>
                    #{i + 1} {p.username}
                  </span>
                  <span className='text-emerald-400 text-sm'>
                    {(p.time / 1000).toFixed(2)}s
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ACTIVITY */}
        <div>
          <h3 className='text-sm font-semibold text-slate-400 mb-2'>
            ⚡ Activity
          </h3>

          <div className='text-sm space-y-1 max-h-40 overflow-y-auto'>
            {submissions.map((s, i) => (
              <div key={i} className='text-slate-400'>
                {s.username || 'You'} → {s.status}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 🔥 RIGHT PANEL */}
      <div className='w-1/2 flex flex-col'>
        {/* TOP BAR */}
        <div className='flex justify-between items-center px-4 py-2 border-b border-[#1a1a2e]'>
          <Timer startTime={startTime} />

          <button
            onClick={handleSubmit}
            className='px-4 py-1.5 bg-emerald-600 hover:bg-emerald-700 rounded-md text-sm'
          >
            Submit ⚡
          </button>
        </div>

        {/* EDITOR */}
        <div className='flex-1'>
          <Editor
            mode='battle'
            externalCode={code}
            setExternalCode={handleCodeChange}
            problem={problem}
          />
        </div>
      </div>
    </div>
  )
}
