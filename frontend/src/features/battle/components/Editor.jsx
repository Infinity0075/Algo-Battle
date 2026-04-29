import { useEffect, useState } from 'react'
import MonacoEditor from '@monaco-editor/react'
import { runCode } from '../../judge/services/judgeService'
import { createSubmission } from '../../submission/services/submissionService'

const DEFAULT_CODE = {
  javascript: '// Write JavaScript code here',
  python: '# Write Python code here'
}

export default function Editor ({
  mode = 'practice',
  externalCode,
  setExternalCode,
  problem,
  onBattleSubmit
}) {
  const [language, setLanguage] = useState('javascript')
  const [code, setCode] = useState(DEFAULT_CODE.javascript)
  const [output, setOutput] = useState('')
  const [running, setRunning] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [outputStatus, setOutputStatus] = useState('idle') // idle | success | error | running

  useEffect(() => {
    if (!problem) return
    const starter = problem?.starterCode?.[language] || DEFAULT_CODE[language]
    if (externalCode === undefined) setCode(starter)
  }, [problem, language, externalCode])

  const currentCode = externalCode ?? code

  const handleChange = value => {
    if (setExternalCode) setExternalCode(value || ' ')
    else setCode(value || ' ')
  }

  const handleLanguageChange = lang => {
    setLanguage(lang)
    setOutput('')
    setOutputStatus('idle')
  }

  const handleRun = async () => {
    if (!currentCode) return
    try {
      setRunning(true)
      setOutputStatus('running')
      setOutput('Running your code…')

      const res = await runCode({
        code: currentCode,
        language,
        problemId: problem?._id
      })

      const isOk = res.status === 'Accepted' || res.status === 'Success'
      setOutputStatus(isOk ? 'success' : 'error')
      setOutput(
        `Status: ${res.status || 'Success'}\n\nOutput:\n${
          res.output || 'No output'
        }`
      )
    } catch {
      setOutputStatus('error')
      setOutput('Run failed ❌')
    } finally {
      setRunning(false)
    }
  }

  const handleSubmit = async () => {
    if (mode === 'battle') {
      onBattleSubmit?.()
      return
    }
    if (!problem?._id) return
    try {
      setSubmitting(true)
      setOutputStatus('running')
      setOutput('Submitting…')

      const res = await runCode({
        code: currentCode,
        language,
        problemId: problem._id
      })
      await createSubmission({
        problemId: problem._id,
        status: res.status,
        language
      })

      const isOk = res.status === 'Accepted'
      setOutputStatus(isOk ? 'success' : 'error')
      setOutput(
        `Status: ${res.status}\n\nOutput:\n${res.output || 'No output'}`
      )
    } catch {
      setOutputStatus('error')
      setOutput('Submission failed ❌')
    } finally {
      setSubmitting(false)
    }
  }

  if (mode === 'practice' && !problem) {
    return (
      <div style={s.loading}>
        <div style={s.loadingRing} />
        <p style={s.loadingText}>Loading editor…</p>
      </div>
    )
  }

  const outputColor = {
    idle: '#4b4b60',
    running: '#fbbf24',
    success: '#4ade80',
    error: '#f87171'
  }[outputStatus]

  return (
    <div style={s.root}>
      {/* TOP BAR */}
      <div style={s.topBar}>
        {/* Language selector */}
        <div style={s.langGroup}>
          {['javascript', 'python'].map(lang => (
            <button
              key={lang}
              onClick={() => handleLanguageChange(lang)}
              style={{
                ...s.langBtn,
                color: language === lang ? '#e8e8f0' : '#4b4b60',
                background: language === lang ? '#1a1a2e' : 'transparent',
                borderColor: language === lang ? '#2a2a3a' : 'transparent'
              }}
            >
              {lang === 'javascript' ? 'JS' : 'PY'}
            </button>
          ))}
        </div>

        {/* Action buttons */}
        <div style={s.btnGroup}>
          <button
            onClick={handleRun}
            disabled={running}
            style={{ ...s.runBtn, opacity: running ? 0.6 : 1 }}
            onMouseEnter={e => (e.currentTarget.style.background = '#1a1a2e')}
            onMouseLeave={e =>
              (e.currentTarget.style.background = 'transparent')
            }
          >
            {running ? '⏳ Running…' : '▶ Run'}
          </button>

          <button
            onClick={handleSubmit}
            disabled={submitting}
            style={{ ...s.submitBtn, opacity: submitting ? 0.6 : 1 }}
            onMouseEnter={e => {
              if (!submitting) {
                e.currentTarget.style.transform = 'translateY(-1px)'
                e.currentTarget.style.boxShadow =
                  '0 6px 20px rgba(34,197,94,0.4)'
              }
            }}
            onMouseLeave={e => {
              e.currentTarget.style.transform = 'none'
              e.currentTarget.style.boxShadow = '0 2px 10px rgba(34,197,94,0.2)'
            }}
          >
            {submitting
              ? 'Submitting…'
              : mode === 'battle'
              ? 'Submit ⚡'
              : 'Submit'}
          </button>
        </div>
      </div>

      {/* MONACO EDITOR */}
      <div style={s.editorWrap}>
        <MonacoEditor
          height='100%'
          language={language}
          theme='vs-dark'
          value={currentCode}
          onChange={handleChange}
          options={{
            fontSize: 14,
            fontFamily: 'JetBrains Mono, Space Mono, monospace',
            minimap: { enabled: false },
            automaticLayout: true,
            wordWrap: 'on',
            lineNumbers: 'on',
            scrollBeyondLastLine: false,
            padding: { top: 12 }
          }}
        />
      </div>

      {/* OUTPUT PANEL */}
      <div style={s.outputPanel}>
        <div style={s.outputHeader}>
          <span style={s.outputLabel}>OUTPUT</span>
          {outputStatus !== 'idle' && (
            <span
              style={{
                ...s.statusDot,
                background: outputColor,
                boxShadow: `0 0 6px ${outputColor}`
              }}
            />
          )}
        </div>
        <div style={s.outputBody}>
          {outputStatus === 'running' ? (
            <span
              style={{
                color: '#fbbf24',
                fontFamily: "'Space Mono', monospace",
                fontSize: 12
              }}
            >
              Processing…
            </span>
          ) : output ? (
            <pre style={{ ...s.outputText, color: outputColor }}>{output}</pre>
          ) : (
            <span style={s.outputPlaceholder}>
              Output will appear here after running…
            </span>
          )}
        </div>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Mono:wght@400;700&family=Sora:wght@400;500;600;700&display=swap');
        @keyframes spin { to{transform:rotate(360deg)} }
      `}</style>
    </div>
  )
}

const s = {
  root: {
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    background: '#0b0b12',
    fontFamily: "'Sora', sans-serif"
  },
  topBar: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '8px 16px',
    borderBottom: '1px solid #1a1a2e',
    flexShrink: 0,
    background: '#0f0f1a'
  },
  langGroup: { display: 'flex', gap: 4 },
  langBtn: {
    padding: '5px 14px',
    borderRadius: 8,
    border: '1px solid',
    fontSize: 12,
    fontWeight: 700,
    cursor: 'pointer',
    fontFamily: "'Space Mono', monospace",
    transition: 'all 0.15s',
    letterSpacing: '0.05em'
  },
  btnGroup: { display: 'flex', gap: 8 },
  runBtn: {
    padding: '6px 16px',
    borderRadius: 8,
    background: 'transparent',
    border: '1px solid #2a2a3a',
    color: '#8b8ba0',
    fontSize: 13,
    fontWeight: 600,
    cursor: 'pointer',
    fontFamily: "'Sora', sans-serif",
    transition: 'background 0.15s'
  },
  submitBtn: {
    padding: '6px 18px',
    borderRadius: 8,
    border: 'none',
    background: 'linear-gradient(135deg, #16a34a, #22c55e)',
    color: '#fff',
    fontSize: 13,
    fontWeight: 700,
    cursor: 'pointer',
    fontFamily: "'Sora', sans-serif",
    boxShadow: '0 2px 10px rgba(34,197,94,0.2)',
    transition: 'transform 0.15s, box-shadow 0.15s'
  },
  editorWrap: { flex: 1, overflow: 'hidden' },
  outputPanel: {
    height: 140,
    flexShrink: 0,
    borderTop: '1px solid #1a1a2e',
    background: '#080810',
    display: 'flex',
    flexDirection: 'column'
  },
  outputHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    padding: '6px 16px',
    borderBottom: '1px solid #1a1a2e',
    flexShrink: 0
  },
  outputLabel: {
    fontSize: 10,
    fontWeight: 700,
    letterSpacing: '0.15em',
    color: '#4b4b60'
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: '50%',
    display: 'inline-block'
  },
  outputBody: { flex: 1, overflow: 'auto', padding: '10px 16px' },
  outputText: {
    fontFamily: "'Space Mono', monospace",
    fontSize: 12,
    margin: 0,
    whiteSpace: 'pre-wrap',
    lineHeight: 1.6
  },
  outputPlaceholder: {
    fontFamily: "'Space Mono', monospace",
    fontSize: 12,
    color: '#2a2a3a'
  },
  loading: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16
  },
  loadingRing: {
    width: 32,
    height: 32,
    borderRadius: '50%',
    border: '3px solid #1f1f30',
    borderTopColor: '#6366f1',
    animation: 'spin 0.8s linear infinite'
  },
  loadingText: { color: '#6b7280', fontSize: 14, margin: 0 }
}
