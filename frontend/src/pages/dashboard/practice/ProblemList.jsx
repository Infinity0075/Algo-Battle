import { useState, useEffect } from 'react'
import ProblemCard from './ProblemCard'
import { useAuth } from '../../../context/AuthContext'
import { getProblemStatus } from '../../../services/submissionService'
import { getProblems } from '../../../services/problemService'

function ProblemList () {
  const [search, setSearch] = useState('')
  const [difficulty, setDifficulty] = useState('All')
  const [problems, setProblems] = useState([])
  const [statusMap, setStatusMap] = useState({})
  const [loading, setLoading] = useState(true)

  const { user } = useAuth()

  // 🔥 Fetch Problems
  useEffect(() => {
    const fetchProblems = async () => {
      try {
        const data = await getProblems()
        setProblems(data)
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchProblems()
  }, [])

  // 🔥 Fetch Status
  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const token = user?.token || localStorage.getItem('token')
        if (!token) return

        const data = await getProblemStatus(token)
        setStatusMap(data)
      } catch (err) {
        console.error(err)
      }
    }

    fetchStatus()
  }, [user])

  const filteredProblems = problems.filter(problem => {
    const matchesSearch = problem.title
      .toLowerCase()
      .includes(search.toLowerCase())

    const matchesDifficulty =
      difficulty === 'All' || problem.difficulty === difficulty

    return matchesSearch && matchesDifficulty
  })

  if (loading) return <div className='p-6'>Loading problems...</div>

  return (
    <div className='space-y-4'>
      {/* Search */}
      <input
        type='text'
        placeholder='Search problems...'
        value={search}
        onChange={e => setSearch(e.target.value)}
        className='w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black'
      />

      {/* Filters */}
      <div className='flex gap-2'>
        {['All', 'Easy', 'Medium', 'Hard'].map(level => (
          <button
            key={level}
            onClick={() => setDifficulty(level)}
            className={`px-4 py-1.5 rounded-full text-sm border transition ${
              difficulty === level
                ? 'bg-black text-white'
                : 'bg-gray-100 hover:bg-gray-200'
            }`}
          >
            {level}
          </button>
        ))}
      </div>

      {/* List */}
      <div className='flex flex-col gap-2'>
        {filteredProblems.length > 0 ? (
          filteredProblems.map(problem => (
            <ProblemCard
              key={problem._id}
              problem={problem}
              status={statusMap[problem._id]}
            />
          ))
        ) : (
          <p className='text-gray-500'>No problems found</p>
        )}
      </div>
    </div>
  )
}

export default ProblemList
