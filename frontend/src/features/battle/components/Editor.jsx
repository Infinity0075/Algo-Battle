import { useEffect, useState } from 'react'
import MonacoEditor from '@monaco-editor/react'
import { createSubmission } from '../../submissions/services/submissionService' // 🔧 ADD

const DEFAULT_CODE = {
  javascript: '// Write JavaScript code here',
  cpp: '// Write C++ code here',
  python: '# Write Python code here'
}

export default function Editor ({
  mode = 'practice',
  externalCode,
  setExternalCode,
  problem
}) {
  const [language, setLanguage] = useState('javascript')
  const [code, setCode] = useState(DEFAULT_CODE.javascript)
  const [output, setOutput] = useState('')
  const [running, setRunning] = useState(false)
  const [submitting, setSubmitting] = useState(false) // 🔧 ADDED

  // 🔥 LOAD STARTER CODE PROPERLY
  useEffect(() => {
    if (problem) {
      const starter = problem?.starterCode?.[language] || DEFAULT_CODE[language]
      setCode(starter)
    }
  }, [problem, language]) // 🔧 FIX: react on language change

  const currentCode = externalCode ?? code

  const handleChange = value => {
    if (setExternalCode) setExternalCode(value)
    else setCode(value)
  }

  const handleLanguageChange = lang => {
    setLanguage(lang)
  }

  // 🔥 RUN (still mock for now)
  const handleRun = () => {
    setRunning(true)
    setOutput('Running...')

    setTimeout(() => {
      setOutput('Output:\n[Mock Result]')
      setRunning(false)
    }, 800)
  }

  // 🔥 SUBMIT (REAL API)
  const handleSubmit = async () => {
    if (!problem?._id) return

    try {
      setSubmitting(true)
      setOutput('Submitting...')

      const res = await createSubmission({
        problemId: problem._id,
        status: 'Accepted', // 🔧 later replace with real judge
        language
      })

      setOutput(res.data?.message || 'Submitted!')
    } catch (err) {
      console.error('Submit error:', err.message)
      setOutput('Submission failed')
    } finally {
      setSubmitting(false)
    }
  }

  if (mode === 'practice' && !problem) {
    return (
      <div className='flex items-center justify-center h-full text-white'>
        Loading editor...
      </div>
    )
  }

  return (
    <div className='flex flex-col h-full bg-[#0b0b12] text-white'>
      {/* TOP BAR */}
      <div className='flex justify-between items-center px-4 py-2 border-b border-[#1a1a2e]'>
        <select
          value={language}
          onChange={e => handleLanguageChange(e.target.value)}
          className='bg-[#0f0f1a] border border-[#1a1a2e] text-sm px-3 py-1 rounded-md'
        >
          <option value='javascript'>JavaScript</option>
          <option value='cpp'>C++</option>
          <option value='python'>Python</option>
        </select>

        <div className='flex gap-2'>
          <button
            onClick={handleRun}
            disabled={running}
            className='px-4 py-1.5 text-sm rounded-md border border-[#1a1a2e] text-slate-400 hover:bg-[#1a1a2e] hover:text-white'
          >
            ▶ Run
          </button>

          <button
            onClick={handleSubmit}
            disabled={submitting}
            className='px-4 py-1.5 text-sm rounded-md bg-emerald-600 hover:bg-emerald-700'
          >
            {submitting ? 'Submitting...' : 'Submit'}
          </button>
        </div>
      </div>

      {/* EDITOR */}
      <div className='flex-1'>
        <MonacoEditor
          height='100%'
          language={language === 'cpp' ? 'cpp' : language}
          theme='vs-dark'
          value={currentCode}
          onChange={handleChange}
          options={{
            fontSize: 14,
            fontFamily: 'JetBrains Mono',
            minimap: { enabled: false },
            automaticLayout: true,
            wordWrap: 'on'
          }}
        />
      </div>

      {/* OUTPUT */}
      <div className='h-32 border-t border-[#1a1a2e] bg-black p-3 text-sm font-mono text-green-400 overflow-y-auto'>
        {running || submitting
          ? 'Processing...'
          : output || 'Output will appear here...'}
      </div>
    </div>
  )
}
