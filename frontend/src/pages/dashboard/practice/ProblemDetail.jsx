import { useParams } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { useAuth } from '../../../context/AuthContext'
import { getProblem } from '../../../services/problemService'
import axios from 'axios'

const FONTS = `@import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@400;500&family=JetBrains+Mono:wght@400;500&display=swap');`

const diffConfig = {
  Easy: {
    color: '#10b981',
    bg: 'rgba(16,185,129,0.1)',
    border: 'rgba(16,185,129,0.2)'
  },
  Medium: {
    color: '#f59e0b',
    bg: 'rgba(245,158,11,0.1)',
    border: 'rgba(245,158,11,0.2)'
  },
  Hard: {
    color: '#ef4444',
    bg: 'rgba(239,68,68,0.1)',
    border: 'rgba(239,68,68,0.2)'
  }
}

function ProblemDetail () {
  const params = useParams()
  const id = params.id || params.problemId

  const { user } = useAuth()

  const [problem, setProblem] = useState(null)
  const [code, setCode] = useState('')
  const [result, setResult] = useState('')
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)

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
        if (!data) throw new Error('No data returned')
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

  const handleRun = () => {
    setResult('running')
    setTimeout(() => setResult('output:[1,2]'), 1000)
  }

  const handleSubmit = async () => {
    try {
      setSubmitting(true)
      setResult('submitting')
      const token = user?.token || localStorage.getItem('token')
      if (!token) {
        setResult('auth_error')
        return
      }
      await axios.post(
        'http://localhost:5005/api/submissions',
        { problemId: problem._id, status: 'solved', language: 'javascript' },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      setResult('success')
    } catch (err) {
      console.error(err)
      setResult('error')
    } finally {
      setSubmitting(false)
    }
  }

  const resultDisplay = {
    running: { text: '⏳ Running your code...', color: '#94a3b8' },
    submitting: { text: '⏳ Submitting...', color: '#94a3b8' },
    'output:[1,2]': { text: '▶ Output: [1, 2]', color: '#06b6d4' },
    success: { text: '✓ Submitted successfully', color: '#10b981' },
    auth_error: { text: '✗ Not logged in', color: '#ef4444' },
    error: { text: '✗ Submission failed', color: '#ef4444' }
  }

  if (loading)
    return (
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh',
          background: '#09090f'
        }}
      >
        <style>{FONTS}</style>
        <div style={{ textAlign: 'center' }}>
          <div
            style={{
              width: 36,
              height: 36,
              border: '2px solid #1a1a2e',
              borderTop: '2px solid #7c3aed',
              borderRadius: '50%',
              animation: 'spin 0.8s linear infinite',
              margin: '0 auto 10px'
            }}
          />
          <p
            style={{
              color: '#64748b',
              fontFamily: 'DM Sans, sans-serif',
              fontSize: 13
            }}
          >
            Loading problem...
          </p>
        </div>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    )

  if (!problem)
    return (
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh',
          background: '#09090f',
          color: '#ef4444',
          fontFamily: 'DM Sans, sans-serif'
        }}
      >
        Problem not found
      </div>
    )

  const diff = diffConfig[problem.difficulty] || diffConfig.Easy

  return (
    <div
      style={{
        background: '#09090f',
        minHeight: '100vh',
        fontFamily: 'DM Sans, sans-serif'
      }}
    >
      <style>{FONTS}</style>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } } @keyframes fadeUp { from { opacity:0; transform: translateY(12px); } to { opacity:1; transform: translateY(0); } }`}</style>

      <div style={{ maxWidth: 900, margin: '0 auto', padding: '32px 24px' }}>
        {/* Problem Header */}
        <div style={{ marginBottom: 28, animation: 'fadeUp 0.4s ease' }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              marginBottom: 10,
              flexWrap: 'wrap'
            }}
          >
            <span
              style={{
                color: diff.color,
                background: diff.bg,
                border: `1px solid ${diff.border}`,
                padding: '4px 12px',
                borderRadius: 20,
                fontSize: 11,
                fontWeight: 600,
                fontFamily: 'JetBrains Mono, monospace'
              }}
            >
              {problem.difficulty}
            </span>
            {problem.category && (
              <span
                style={{
                  color: '#64748b',
                  background: '#0f0f1a',
                  border: '1px solid #1a1a2e',
                  padding: '4px 12px',
                  borderRadius: 20,
                  fontSize: 11,
                  fontFamily: 'JetBrains Mono, monospace'
                }}
              >
                {problem.category}
              </span>
            )}
          </div>
          <h1
            style={{
              fontFamily: 'Syne, sans-serif',
              fontSize: 26,
              fontWeight: 800,
              color: '#f1f5f9',
              margin: '0 0 12px',
              letterSpacing: '-0.3px'
            }}
          >
            {problem.title}
          </h1>
          <p
            style={{
              color: '#94a3b8',
              fontSize: 15,
              lineHeight: 1.7,
              margin: 0
            }}
          >
            {problem.description}
          </p>
        </div>

        {/* Examples */}
        {problem.examples?.length > 0 && (
          <div style={{ marginBottom: 28, animation: 'fadeUp 0.45s ease' }}>
            <h3
              style={{
                fontFamily: 'Syne, sans-serif',
                fontSize: 14,
                fontWeight: 700,
                color: '#64748b',
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                marginBottom: 12
              }}
            >
              Examples
            </h3>
            {problem.examples.map((ex, i) => (
              <div
                key={i}
                style={{
                  background: '#0f0f1a',
                  border: '1px solid #1a1a2e',
                  borderRadius: 10,
                  padding: '14px 16px',
                  marginBottom: 8,
                  fontFamily: 'JetBrains Mono, monospace',
                  fontSize: 13
                }}
              >
                <div style={{ marginBottom: 4 }}>
                  <span style={{ color: '#64748b' }}>Input: </span>
                  <span style={{ color: '#06b6d4' }}>{ex.input}</span>
                </div>
                <div>
                  <span style={{ color: '#64748b' }}>Output: </span>
                  <span style={{ color: '#10b981' }}>{ex.output}</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Code Editor */}
        <div
          style={{
            background: '#0f0f1a',
            border: '1px solid #1a1a2e',
            borderRadius: 14,
            overflow: 'hidden',
            animation: 'fadeUp 0.5s ease'
          }}
        >
          {/* Editor Header */}
          <div
            style={{
              padding: '10px 16px',
              borderBottom: '1px solid #1a1a2e',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div
                style={{
                  width: 10,
                  height: 10,
                  borderRadius: '50%',
                  background: '#ef4444'
                }}
              />
              <div
                style={{
                  width: 10,
                  height: 10,
                  borderRadius: '50%',
                  background: '#f59e0b'
                }}
              />
              <div
                style={{
                  width: 10,
                  height: 10,
                  borderRadius: '50%',
                  background: '#10b981'
                }}
              />
            </div>
            <span
              style={{
                fontSize: 11,
                color: '#64748b',
                fontFamily: 'JetBrains Mono, monospace'
              }}
            >
              javascript
            </span>
          </div>

          {/* Textarea */}
          <textarea
            value={code}
            onChange={e => setCode(e.target.value)}
            rows={14}
            spellCheck={false}
            style={{
              width: '100%',
              padding: '18px',
              background: 'transparent',
              border: 'none',
              color: '#e2e8f0',
              fontFamily: 'JetBrains Mono, monospace',
              fontSize: 13.5,
              lineHeight: 1.7,
              resize: 'vertical',
              outline: 'none',
              boxSizing: 'border-box',
              caretColor: '#7c3aed'
            }}
          />

          {/* Action Bar */}
          <div
            style={{
              padding: '12px 16px',
              borderTop: '1px solid #1a1a2e',
              display: 'flex',
              alignItems: 'center',
              gap: 10
            }}
          >
            <button
              onClick={handleRun}
              style={{
                padding: '9px 20px',
                borderRadius: 8,
                border: '1px solid #1a1a2e',
                background: 'transparent',
                color: '#94a3b8',
                cursor: 'pointer',
                fontFamily: 'DM Sans, sans-serif',
                fontSize: 13,
                fontWeight: 500,
                transition: 'all 0.15s'
              }}
              onMouseEnter={e => {
                e.target.style.background = '#1a1a2e'
                e.target.style.color = '#e2e8f0'
              }}
              onMouseLeave={e => {
                e.target.style.background = 'transparent'
                e.target.style.color = '#94a3b8'
              }}
            >
              ▶ Run
            </button>

            <button
              onClick={handleSubmit}
              disabled={submitting}
              style={{
                padding: '9px 22px',
                borderRadius: 8,
                border: 'none',
                background: submitting ? '#3b0764' : '#7c3aed',
                color: '#fff',
                cursor: submitting ? 'not-allowed' : 'pointer',
                fontFamily: 'DM Sans, sans-serif',
                fontSize: 13,
                fontWeight: 600,
                transition: 'all 0.15s',
                opacity: submitting ? 0.7 : 1
              }}
              onMouseEnter={e => {
                if (!submitting) e.target.style.background = '#6d28d9'
              }}
              onMouseLeave={e => {
                if (!submitting) e.target.style.background = '#7c3aed'
              }}
            >
              Submit
            </button>

            {/* Result */}
            {result && resultDisplay[result] && (
              <span
                style={{
                  fontSize: 13,
                  color: resultDisplay[result].color,
                  fontFamily: 'JetBrains Mono, monospace',
                  marginLeft: 4
                }}
              >
                {resultDisplay[result].text}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProblemDetail
