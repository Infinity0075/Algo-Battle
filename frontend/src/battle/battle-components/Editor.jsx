import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import MonacoEditor from '@monaco-editor/react'
import { getProblem } from '../../services/problemService'

export default function Editor ({
  mode = 'practice', // "practice" or "battle"
  externalCode,
  setExternalCode
}) {
  const { id } = useParams()

  const [problem, setProblem] = useState(null)
  const [code, setCode] = useState('// Start coding...')

  // 👉 Fetch problem ONLY in practice mode
  useEffect(() => {
    if (mode !== 'practice') return

    const fetchProblem = async () => {
      try {
        const data = await getProblem(id)
        setProblem(data)

        // set starter code
        setCode(data?.starterCode?.javascript || '// Write your code here')
      } catch (err) {
        console.error(err)
      }
    }

    fetchProblem()
  }, [id, mode])

  // 👉 Decide which code to use
  const currentCode = externalCode ?? code

  const handleChange = value => {
    if (setExternalCode) {
      setExternalCode(value) // battle mode
    } else {
      setCode(value) // practice mode
    }
  }

  if (mode === 'practice' && !problem) return <p>Loading...</p>

  return (
    <div className='flex flex-col h-full'>
      {/* Problem Section (only for practice) */}
      {mode === 'practice' && (
        <div className='p-4 bg-gray-800 text-white'>
          <h2 className='text-lg font-bold'>{problem.title}</h2>
        </div>
      )}

      {/* Editor */}
      <div className='flex-1'>
        <MonacoEditor
          height='100%'
          language='javascript'
          theme='vs-dark'
          value={currentCode}
          onChange={handleChange}
          options={{
            fontSize: 14,
            minimap: { enabled: false },
            automaticLayout: true
          }}
        />
      </div>
    </div>
  )
}
