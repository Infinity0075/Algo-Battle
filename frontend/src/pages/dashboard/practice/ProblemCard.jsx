import { useNavigate } from 'react-router-dom'

function ProblemCard ({ problem }) {
  const navigate = useNavigate()

  return (
    <div
      onClick={() => navigate(`/dashboard/practice/${problem.id}`)}
      style={{
        border: '1px solid #ccc',
        padding: '10px',
        marginBottom: '10px',
        borderRadius: '6px',
        cursor: 'pointer'
      }}
    >
      <h3>{problem.title}</h3>
      <p>{problem.difficulty}</p>
    </div>
  )
}

export default ProblemCard
