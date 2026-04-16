import { useNavigate } from 'react-router-dom'

function ProblemCard ({ problem, status }) {
  const navigate = useNavigate()

  if (!problem || !problem._id) {
    console.error('Invalid problem:', problem)
    return null
  }

  const getDifficultyColor = diff => {
    if (diff === 'Easy') return 'green'
    if (diff === 'Medium') return 'orange'
    if (diff === 'Hard') return 'red'
    return 'gray'
  }

  return (
    <div
      onClick={() => {
        console.log('CLICKED:', problem._id) // 🔥 DEBUG
        navigate(`/dashboard/practice/${problem._id}`)
      }}
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        border: '1px solid #eee',
        padding: '14px',
        borderRadius: '10px',
        cursor: 'pointer',
        background: 'white'
      }}
    >
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
