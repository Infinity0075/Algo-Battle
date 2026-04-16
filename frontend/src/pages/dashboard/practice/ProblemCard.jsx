import { useNavigate } from 'react-router-dom'

function ProblemCard ({ problem, status }) {
  const navigate = useNavigate()

  const getDifficultyColor = diff => {
    if (diff === 'Easy') return 'green'
    if (diff === 'Medium') return 'orange'
    if (diff === 'Hard') return 'red'
    return 'gray'
  }

  return (
    <div
      onClick={() => navigate(`/dashboard/practice/${problem.id}`)}
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        border: '1px solid #eee',
        padding: '14px',
        borderRadius: '10px',
        cursor: 'pointer',
        transition: '0.2s',
        background: 'white'
      }}
      onMouseEnter={e => (e.currentTarget.style.background = '#f9f9f9')}
      onMouseLeave={e => (e.currentTarget.style.background = 'white')}
    >
      {/* <h3 style={{ margin: 0 }}>{problem.title}</h3> */}
      <span>
        {status === 'solved' && '✅ '}
        {status === 'attempted' && '⏳ '}
        {problem.title}
      </span>
      <span
        style={{
          color: 'white',
          backgroundColor: getDifficultyColor(problem.difficulty),
          padding: '4px 10px',
          borderRadius: '20px',
          fontSize: '12px'
        }}
      >
        {problem.difficulty}
      </span>
    </div>
  )
}

export default ProblemCard
