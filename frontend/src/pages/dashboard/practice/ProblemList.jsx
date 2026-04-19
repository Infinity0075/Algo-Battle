import { useEffect, useState } from 'react'
import ProblemCard from './ProblemCard'
import { getProblems } from '../../../services/problemService'

function ProblemList () {
  const [problems, setProblems] = useState([])
  const [filter, setFilter] = useState('All')

  useEffect(() => {
    const fetchProblems = async () => {
      try {
        const data = await getProblems()
        setProblems(data)
      } catch (err) {
        console.error(err)
      }
    }

    fetchProblems()
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

      {/* LIST */}
      <div className='space-y-2'>
        {filtered.map(problem => (
          <ProblemCard key={problem._id} problem={problem} />
        ))}
      </div>
    </div>
  )
}

export default ProblemList
