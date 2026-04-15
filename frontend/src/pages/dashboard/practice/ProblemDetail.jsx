import { useParams } from 'react-router-dom'

function ProblemDetail () {
  const { id } = useParams()

  return (
    <div>
      <h1>Problem Detail</h1>
      <p>Problem ID: {id}</p>
    </div>
  )
}

export default ProblemDetail
