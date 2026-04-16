import { useParams } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { useAuth } from '../../../context/AuthContext'
import { getProblem } from '../../../services/problemService'
import { createSubmission } from '../../../services/submissionService'

function ProblemDetail () {
  const { problemId } = useParams()
  const { user } = useAuth()

  const [problem, setProblem] = useState(null)
  const [code, setCode] = useState('')
  const [result, setResult] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const fetchProblem = async () => {
      try {
        const data = await getProblem(problemId)
        setProblem(data)
        setCode(data?.starterCode?.javascript || '')
      } catch (err) {
        console.error(err)
      }
    }

    fetchProblem()
  }, [problemId])

  if (!problem) return <div className='p-6'>Loading...</div>

  const handleSubmit = async () => {
    if (!user) {
      setResult('Not logged in')
      return
    }

    try {
      setLoading(true)
      setResult('Submitting...')
      await createSubmission({
        problemId: problem._id,
        status: 'solved',
        language: 'javascript'
      })
      setResult('Submitted successfully')
    } catch (err) {
      console.error(err)
      setResult('Submission failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className='p-6 max-w-4xl mx-auto space-y-6'>
      ...
      <div>
        <h3 className='font-semibold mb-2'>Examples:</h3>
        {(problem.examples || []).map((ex, i) => (
          <div key={i} className='bg-gray-100 p-3 rounded mb-2'>
            ...
          </div>
        ))}
      </div>
      ...
      <button
        onClick={handleSubmit}
        disabled={loading}
        className='px-4 py-2 bg-black text-white rounded hover:bg-gray-800 disabled:opacity-50'
      >
        Submit
      </button>
      ...
    </div>
  )
}
