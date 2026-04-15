import { useParams } from 'react-router-dom'
import { problems } from './problems'
import { useState } from 'react'

function ProblemDetail () {
  const { id } = useParams()
  const problem = problems.find(p => p.id === Number(id))

  const [code, setCode] = useState('')

  const [result, setResult] = useState('')

  if (!problem) {
    return <h2>Problem not found</h2>
  }

  return (
    <div style={{ padding: '20px' }}>
      {/* Problem Info */}
      <h1>{problem.title}</h1>
      <p>
        <strong>Difficulty:</strong> {problem.difficulty}
      </p>
      <p>{problem.description}</p>

      <hr />

      {/* Code Editor */}
      <h2>Write your code:</h2>

      <textarea
        value={code}
        onChange={e => setCode(e.target.value)}
        rows={10}
        style={{ width: '100%', marginTop: '10px' }}
        placeholder='Write your code here...'
      />

      {/* Buttons */}
      <div style={{ marginTop: '10px' }}>
        <button
          onClick={() => {
            setResult('Running...')
            setTimeout(() => {
              setResult('Output: [1, 2]') // fake output
            }, 1000)
          }}
        >
          Run
        </button>

        <button
          onClick={() => {
            const isCorrect = Math.random() > 0.5

            if (isCorrect) {
              setResult('✅ Correct Answer!')
            } else {
              setResult('❌ Wrong Answer. Try again.')
            }
          }}
          style={{ marginLeft: '10px' }}
        >
          Submit
        </button>
        {result && (
          <div style={{ marginTop: '15px' }}>
            <strong>{result}</strong>
          </div>
        )}
      </div>
    </div>
  )
}

export default ProblemDetail
