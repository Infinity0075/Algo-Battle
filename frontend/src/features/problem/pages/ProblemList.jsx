import { useEffect, useState } from 'react'
import ProblemCard from '../components/ProblemCard'
import { getProblems } from '../services/problemService'
import { getProblemStatus } from '../../submission/services/submissionService'

function ProblemList () {
  const [problems, setProblems] = useState([])
  const [statusMap, setStatusMap] = useState({})
  const [filter, setFilter] = useState('All')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [problemsData, statusData] = await Promise.all([
          getProblems(),
          getProblemStatus()
        ])

        // 🔥 FIX: both already return data (no .data needed)
        setProblems(problemsData || [])
        setStatusMap(statusData || {})
      } catch (err) {
        console.error('Fetch error:', err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchAll()
  }, [])

  const filtered =
    filter === 'All' ? problems : problems.filter(p => p.difficulty === filter)

  return (
    <div className='space-y-6'>
      {/* HEADER */}
      <div className='flex justify-between items-center'>
        <h1 className='text-xl font-semibold'>Practice Problems</h1>

        <div className='flex gap-2'>
          {['All', 'Easy', 'Medium', 'Hard'].map(level => (
            <button
              key={level}
              onClick={() => setFilter(level)}
              className={`px-3 py-1 text-xs rounded-md border ${
                filter === level
                  ? 'bg-amber-600 border-amber-600 text-white'
                  : 'border-[#2A2A2A] text-gray-400 hover:bg-[#222222]'
              }`}
            >
              {level}
            </button>
          ))}
        </div>
      </div>

      {/* LOADING */}
      {loading && (
        <div className='text-gray-400 text-sm'>Loading problems...</div>
      )}

      {/* LIST */}
      {!loading && (
        <div className='space-y-2'>
          {filtered.length === 0 ? (
            <p className='text-gray-500 text-sm'>No problems found</p>
          ) : (
            filtered.map(problem => (
              <ProblemCard
                key={problem._id}
                problem={problem}
                status={statusMap?.[problem._id]} // 🔥 SAFE ACCESS
              />
            ))
          )}
        </div>
      )}
    </div>
  )
}

export default ProblemList
