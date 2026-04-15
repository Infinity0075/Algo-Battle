import { useState } from 'react'
import { problems } from './problems'
import ProblemCard from './ProblemCard'

function ProblemList () {
  const [search, setSearch] = useState('')
  const [difficulty, setDifficulty] = useState('All')

  const filteredProblems = problems.filter(problem => {
    const matchesSearch = problem.title
      .toLowerCase()
      .includes(search.toLowerCase())

    const matchesDifficulty =
      difficulty === 'All' || problem.difficulty === difficulty

    return matchesSearch && matchesDifficulty
  })

  return (
    <div>
      {/* Search */}
      <input
        type='text'
        placeholder='Search problems...'
        value={search}
        onChange={e => setSearch(e.target.value)}
        style={{
          padding: '10px',
          width: '100%',
          marginBottom: '15px',
          borderRadius: '8px',
          border: '1px solid #ddd',
          fontSize: '14px'
        }}
      />

      {/* Filters */}
      <div style={{ marginBottom: '15px' }}>
        {['All', 'Easy', 'Medium', 'Hard'].map(level => (
          <button
            key={level}
            onClick={() => setDifficulty(level)}
            style={{
              marginRight: '10px',
              padding: '6px 12px',
              borderRadius: '20px',
              border: '1px solid #ccc',
              backgroundColor: difficulty === level ? '#333' : '#f5f5f5',
              color: difficulty === level ? '#fff' : '#333',
              cursor: 'pointer',
              fontSize: '13px'
            }}
          >
            {level}
          </button>
        ))}
      </div>

      {/* List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {filteredProblems.length > 0 ? (
          filteredProblems.map(problem => (
            <ProblemCard key={problem.id} problem={problem} />
          ))
        ) : (
          <p>No problems found</p>
        )}
      </div>
    </div>
  )
}

export default ProblemList
