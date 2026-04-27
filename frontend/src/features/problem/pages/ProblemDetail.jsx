import { useParams } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { getProblemById } from '../services/problemService' // 🔧 FIXED name
import Editor from '../../battle/components/Editor' // 🔧 keep for now

const diffConfig = {
  Easy: 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20',
  Medium: 'text-amber-500 bg-amber-500/10 border-amber-500/20',
  Hard: 'text-red-500 bg-red-500/10 border-red-500/20'
}

function ProblemDetail () {
  const { problemId } = useParams()

  const [problem, setProblem] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchProblem = async () => {
      try {
        const data = await getProblemById(problemId)

        console.log('Fetched:', data) // ✅ now valid

        setProblem(data)
      } catch (err) {
        console.error('Problem fetch error:', err.response?.data || err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchProblem()
  }, [problemId])

  if (loading) {
    return (
      <div className='flex items-center justify-center min-h-screen bg-[#09090f]'>
        <div className='w-8 h-8 border-2 border-[#1a1a2e] border-t-violet-600 rounded-full animate-spin' />
      </div>
    )
  }

  if (!problem) {
    return (
      <div className='flex items-center justify-center min-h-screen bg-[#09090f] text-red-500'>
        Problem not found
      </div>
    )
  }

  const diffStyle = diffConfig[problem.difficulty] || diffConfig.Easy

  return (
    <div className='flex h-screen bg-[#09090f] text-white'>
      {/* LEFT */}
      <div className='w-1/2 border-r border-[#1a1a2e] overflow-y-auto p-6'>
        <div className='mb-6'>
          <div className='flex items-center gap-3 mb-2'>
            <span
              className={`px-3 py-1 text-xs rounded-full border font-semibold ${diffStyle}`}
            >
              {problem.difficulty}
            </span>

            {problem.category && (
              <span className='px-3 py-1 text-xs rounded-full border border-[#1a1a2e] bg-[#0f0f1a] text-slate-400'>
                {problem.category}
              </span>
            )}
          </div>

          <h1 className='text-2xl font-bold mb-3'>{problem.title}</h1>

          <p className='text-slate-400 leading-relaxed'>
            {problem.description}
          </p>
        </div>

        {/* 🔧 EXAMPLES */}
        {problem.examples?.length > 0 && (
          <div>
            <h3 className='text-xs uppercase tracking-wider text-slate-500 font-bold mb-3'>
              Examples
            </h3>

            {problem.examples.map((ex, i) => (
              <div
                key={i}
                className='bg-[#0f0f1a] border border-[#1a1a2e] rounded-lg p-4 mb-3 font-mono text-sm'
              >
                <div>
                  <span className='text-slate-500'>Input: </span>
                  <span className='text-cyan-400'>{ex.input}</span>
                </div>
                <div>
                  <span className='text-slate-500'>Output: </span>
                  <span className='text-emerald-400'>{ex.output}</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* 🔧 CONSTRAINTS */}
        {problem.constraints?.length > 0 && (
          <div className='mt-6'>
            <h3 className='text-xs uppercase tracking-wider text-slate-500 font-bold mb-3'>
              Constraints
            </h3>

            <ul className='text-sm text-slate-400 list-disc ml-5 space-y-1'>
              {problem.constraints.map((c, i) => (
                <li key={i}>{c}</li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* RIGHT */}
      <div className='w-1/2'>
        <Editor mode='practice' problem={problem} />
      </div>
    </div>
  )
}

export default ProblemDetail
