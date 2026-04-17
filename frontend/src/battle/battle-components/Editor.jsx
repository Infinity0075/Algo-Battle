import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { getProblem } from '../../services/problemService'

const Editor = () => {
  const { id } = useParams()
  const [problem, setProblem] = useState(null)

  useEffect(() => {
    const fetchProblem = async () => {
      try {
        const data = await getProblem(id)
        setProblem(data)
      } catch (err) {
        console.error(err)
      }
    }

    fetchProblem()
  }, [id])

  if (!problem) return <p>Loading...</p>

  return (
    <div>
      <h2>{problem.title}</h2>

      <pre>{problem.starterCode?.javascript || '// Write your code here'}</pre>

      {/* your editor UI stays here */}
    </div>
  )
}

export default Editor
