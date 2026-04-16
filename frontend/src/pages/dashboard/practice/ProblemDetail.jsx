import { useParams } from 'react-router-dom'
import { problems } from './problems'
import { useState } from 'react'
import axios from 'axios'
import { useAuth } from '../../../context/AuthContext'

function ProblemDetail () {
  const { problemId } = useParams()
  const { user } = useAuth()

  const problem = problems.find(
    p => p.id.toLowerCase() === problemId?.toLowerCase()
  )

  const [code, setCode] = useState(problem?.starterCode?.javascript || '')
  const [result, setResult] = useState('')
  const [loading, setLoading] = useState(false)

  if (!problem) return <h2>Problem not found</h2>

  return (
    <div style={{ padding: '20px', maxWidth: '900px' }}>
      <h1>{problem.title}</h1>

      <p>
        <strong>Difficulty:</strong>{' '}
        <span
          style={{
            color:
              problem.difficulty === 'Easy'
                ? 'green'
                : problem.difficulty === 'Medium'
                ? 'orange'
                : 'red'
          }}
        >
          {problem.difficulty}
        </span>
      </p>

      <p>{problem.description}</p>

      <h3>Examples:</h3>
      {problem.examples.map((ex, i) => (
        <div key={i}>
          <p>
            <b>Input:</b> {ex.input}
          </p>
          <p>
            <b>Output:</b> {ex.output}
          </p>
        </div>
      ))}

      <hr />

      <h2>Code Editor</h2>

      <textarea
        value={code}
        onChange={e => setCode(e.target.value)}
        rows={10}
        style={{
          width: '100%',
          padding: '10px',
          fontFamily: 'monospace'
        }}
      />

      <div style={{ marginTop: '10px' }}>
        <button
          onClick={() => {
            setResult('Running...')
            setTimeout(() => {
              setResult('Output: [1,2]')
            }, 1000)
          }}
        >
          Run
        </button>

        <button
          onClick={async () => {
            try {
              setLoading(true)
              setResult('Submitting...')

              const token = user?.token || localStorage.getItem('token')

              console.log('TOKEN:', token)

              if (!token) {
                setResult('❌ Not logged in')
                return
              }

              const res = await axios.post(
                'http://localhost:5005/api/submissions',
                {
                  problemId: problem.id,
                  status: 'solved',
                  language: 'javascript'
                },
                {
                  headers: {
                    Authorization: `Bearer ${token}`
                  }
                }
              )

              console.log('RESPONSE:', res.data)

              setResult('✅ Submitted Successfully!')
            } catch (err) {
              console.log('SUBMIT ERROR:', err.response?.data || err)
              setResult('❌ Submission Failed')
            } finally {
              setLoading(false)
            }
          }}
          style={{ marginLeft: '10px' }}
        >
          Submit
        </button>
      </div>

      {result && (
        <div style={{ marginTop: '15px' }}>
          <strong>{result}</strong>
        </div>
      )}
    </div>
  )
}

export default ProblemDetail
