import { useEffect, useState } from 'react'
import MonacoEditor from '@monaco-editor/react'

const LANGUAGES = {
  javascript: '// Write JavaScript code here',
  cpp: '// Write C++ code here',
  python: '# Write Python code here'
}

export default function Editor ({
  mode = 'practice',
  externalCode,
  setExternalCode,
  problem // ✅ received from parent
}) {
  const [language, setLanguage] = useState('javascript')
  const [code, setCode] = useState(LANGUAGES.javascript)
  const [output, setOutput] = useState('')
  const [running, setRunning] = useState(false)

  // ✅ set code when problem loads
  useEffect(() => {
    if (problem) {
      setCode(problem?.starterCode?.javascript || LANGUAGES.javascript)
    }
  }, [problem])

  const currentCode = externalCode ?? code

  const handleChange = value => {
    if (setExternalCode) {
      setExternalCode(value)
    } else {
      setCode(value)
    }
  }

  const handleLanguageChange = lang => {
    setLanguage(lang)
    setCode(LANGUAGES[lang])
  }

  const handleRun = () => {
    setRunning(true)
    setOutput('Running...')

    setTimeout(() => {
      setOutput('Output:\n[1, 2]')
      setRunning(false)
    }, 1000)
  }

  if (mode === 'practice' && !problem)
    return (
      <div className='flex items-center justify-center h-full text-white'>
        Loading editor...
      </div>
    )

  return (
    <div className='flex flex-col h-full bg-[#0b0b12] text-white'>
      {/* Top Bar */}
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

        <button
          onClick={handleRun}
          className='px-4 py-1.5 text-sm rounded-md border border-[#1a1a2e] text-slate-400 hover:bg-[#1a1a2e] hover:text-white transition'
        >
          ▶ Run
        </button>
      </div>

      {/* Editor */}
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

      {/* Output */}
      <div className='h-32 border-t border-[#1a1a2e] bg-black p-3 text-sm font-mono text-green-400 overflow-y-auto'>
        {running ? 'Running...' : output || 'Output will appear here...'}
      </div>
    </div>
  )
}
