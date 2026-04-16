import { useParams } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { useAuth } from '../../../context/AuthContext'
import { getProblem } from '../../../services/problemService'
import axios from 'axios'

function ProblemDetail () {
  const params = useParams()
  const id = params.id || params.problemId // ✅ handles both cases

  const { user } = useAuth()

  const [problem, setProblem] = useState(null)
  const [code, setCode] = useState('')
  const [result, setResult] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchProblem = async () => {
      try {
        console.log('Fetching problem with ID:', id)

        if (!id) {
          console.error('No ID found in params')
          return
        }

        const data = await getProblem(id)
        console.log('Fetched problem:', data)

        if (!data) {
          throw new Error('No data returned')
        }

        setProblem(data)
        setCode(data?.starterCode?.javascript || '')
      } catch (err) {
        console.log('Problem fetch failed:', err)
        setResult('Failed to load problem ❌')
      } finally {
        setLoading(false)
      }
    }

    fetchProblem()
  }, [id])

  if (loading) return <div className='p-6'>Loading...</div>

  if (!problem) return <div className='p-6 text-red-500'>Problem not found</div>

  return (
    <div className='p-6 max-w-4xl mx-auto space-y-6'>
      <h1 className='text-2xl font-bold'>{problem.title}</h1>

      <p>
        <span className='font-semibold'>Difficulty:</span>{' '}
        <span
          className={`font-medium ${
            problem.difficulty === 'Easy'
              ? 'text-green-600'
              : problem.difficulty === 'Medium'
              ? 'text-yellow-600'
              : 'text-red-600'
          }`}
        >
          {problem.difficulty}
        </span>
      </p>

      <p className='text-gray-700'>{problem.description}</p>

      {/* Examples */}
      <div>
        <h3 className='font-semibold mb-2'>Examples:</h3>
        {problem.examples?.length > 0 ? (
          problem.examples.map((ex, i) => (
            <div key={i} className='bg-gray-100 p-3 rounded mb-2'>
              <p>
                <strong>Input:</strong> {ex.input}
              </p>
              <p>
                <strong>Output:</strong> {ex.output}
              </p>
            </div>
          ))
        ) : (
          <p>No examples available</p>
        )}
      </div>

      {/* Code Editor */}
      <div>
        <h2 className='font-semibold mb-2'>Code Editor</h2>

        <textarea
          value={code}
          onChange={e => setCode(e.target.value)}
          rows={10}
          className='w-full p-3 border rounded font-mono focus:outline-none'
        />

        <div className='flex gap-3 mt-3'>
          {/* Run */}
          <button
            onClick={() => {
              setResult('Running...')
              setTimeout(() => {
                setResult('Output: [1,2]')
              }, 1000)
            }}
            className='px-4 py-2 bg-gray-200 rounded hover:bg-gray-300'
          >
            Run
          </button>

          {/* Submit */}
          <button
            onClick={async () => {
              try {
                setResult('Submitting...')

                const token = user?.token || localStorage.getItem('token')

                if (!token) {
                  setResult('Not logged in ❌')
                  return
                }

                await axios.post(
                  'http://localhost:5005/api/submissions',
                  {
                    problemId: problem._id,
                    status: 'solved',
                    language: 'javascript'
                  },
                  {
                    headers: {
                      Authorization: `Bearer ${token}`
                    }
                  }
                )

                setResult('Submitted successfully ✅')
              } catch (err) {
                console.error(err)
                setResult('Submission failed ❌')
              }
            }}
            className='px-4 py-2 bg-black text-white rounded hover:bg-gray-800'
          >
            Submit
          </button>
        </div>

        {result && <div className='mt-3 text-sm font-medium'>{result}</div>}
      </div>
    </div>
  )
}

export default ProblemDetail
