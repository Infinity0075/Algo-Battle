import { useEffect, useState } from 'react'
import MonacoEditor from '@monaco-editor/react'
import { createSubmission } from '../../submission/services/submissionService'

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
  const [submitting, setSubmitting] = useState(false)

  // 🔥 LOAD STARTER CODE (SAFE)
  useEffect(() => {
    if (!problem) return

    const starter = problem?.starterCode?.[language] || DEFAULT_CODE[language]

    // 🔧 don't override external (battle sync)
    if (!externalCode) {
      setCode(starter)
    }
  }, [problem, language])

  const currentCode = externalCode ?? code

  const handleChange = value => {
    if (setExternalCode) setExternalCode(value)
    else setCode(value)
  }

  const handleLanguageChange = lang => {
    setLanguage(lang)
    setOutput('') // 🔧 reset output
  }

  // 🔥 RUN (mock for now)
  const handleRun = () => {
    if (!currentCode) return

    setRunning(true)
    setOutput('Running...')

    setTimeout(() => {
      setOutput('Output:\n[Mock Result]')
      setRunning(false)
    }, 700)
  }

  // 🔥 SUBMIT (only for practice mode)
  const handleSubmit = async () => {
    if (!problem?._id) return

    try {
      setSubmitting(true)
      setOutput('Submitting...')

      const result = await judgeCode({
        code,
        language,
        problemId: problem._id
      })

      // 🔥 SHOW RESULT
      const statusColor =
        result.status === 'Accepted' ? 'text-green-400' : 'text-red-400'

      setOutput(`
Status: ${result.status}
Time: ${result.time} ms
Output:
${result.output}
`)

      setOutput(`
Status: ${result.status}
Time: ${result.time} ms
Output:
${result.output}
    `)
    } catch (err) {
      console.error(err)
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

        {/* 🔥 buttons */}
        <div className='flex gap-2'>
          <button
            onClick={handleRun}
            disabled={running}
            className='px-4 py-1.5 text-sm rounded-md border border-[#1a1a2e] text-slate-400 hover:bg-[#1a1a2e] hover:text-white'
          >
            ▶ Run
          </button>

          {mode === 'practice' && (
            <button
              onClick={handleSubmit}
              disabled={submitting}
              className='px-4 py-1.5 text-sm rounded-md bg-emerald-600 hover:bg-emerald-700'
            >
              {submitting ? 'Submitting...' : 'Submit'}
            </button>
          )}
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
      <div className='h-32 border-t border-[#1a1a2e] bg-black p-3 text-sm font-mono overflow-y-auto'>
        {running || submitting ? (
          <span className='text-yellow-400'>Processing...</span>
        ) : output ? (
          <pre className='text-green-400 whitespace-pre-wrap'>{output}</pre>
        ) : (
          <span className='text-gray-500'>Output will appear here...</span>
        )}
      </div>
    </div>
  )
}
