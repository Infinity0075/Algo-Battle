import { useState } from 'react'
import { useAuth } from '../../auth/context/useAuth'
import { useNavigate } from 'react-router-dom'
import { createProblem } from '../../problem/services/problemService'

const DIFFICULTIES = ['Easy', 'Medium', 'Hard']

const difficultyConfig = {
  Easy: {
    color: '#22c55e',
    bg: 'rgba(34,197,94,0.12)',
    border: 'rgba(34,197,94,0.35)'
  },
  Medium: {
    color: '#f59e0b',
    bg: 'rgba(245,158,11,0.12)',
    border: 'rgba(245,158,11,0.35)'
  },
  Hard: {
    color: '#ef4444',
    bg: 'rgba(239,68,68,0.12)',
    border: 'rgba(239,68,68,0.35)'
  }
}

function AddProblem () {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({
    title: '',
    difficulty: 'Easy',
    description: '',
    input: '',
    output: ''
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  if (user?.role !== 'admin') {
    return (
      <div style={styles.denied}>
        <span style={styles.deniedIcon}>⛔</span>
        <p style={styles.deniedText}>Access Denied</p>
        <p style={styles.deniedSub}>Admin privileges required.</p>
      </div>
    )
  }

  const handleChange = e => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async e => {
    e.preventDefault()
    if (!form.title || !form.description) {
      return setError('Title and description are required.')
    }
    try {
      setLoading(true)
      setError('')
      await createProblem({
        ...form,
        examples: [{ input: form.input, output: form.output }]
      })
      navigate('/dashboard/admin/manage-problems')
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to add problem.')
    } finally {
      setLoading(false)
    }
  }

  const diff = difficultyConfig[form.difficulty]

  return (
    <div style={styles.page}>
      {/* Background grid */}
      <div style={styles.bgGrid} aria-hidden='true' />

      <div style={styles.container}>
        {/* Header */}
        <div style={styles.header}>
          <div style={styles.badge}>ADMIN PANEL</div>
          <h1 style={styles.title}>Add New Problem</h1>
          <p style={styles.subtitle}>Craft a challenge for the community</p>
        </div>

        {/* Card */}
        <div style={styles.card}>
          {error && (
            <div style={styles.errorBanner}>
              <span style={{ fontSize: 16 }}>⚠</span>
              {error}
            </div>
          )}

          {/* Title field */}
          <Field label='Problem Title' required>
            <input
              name='title'
              value={form.title}
              onChange={handleChange}
              placeholder='e.g. Two Sum, Longest Palindrome…'
              style={styles.input}
              onFocus={e => Object.assign(e.target.style, styles.inputFocus)}
              onBlur={e => Object.assign(e.target.style, styles.input)}
            />
          </Field>

          {/* Difficulty selector */}
          <Field label='Difficulty'>
            <div style={styles.diffGroup}>
              {DIFFICULTIES.map(d => {
                const cfg = difficultyConfig[d]
                const active = form.difficulty === d
                return (
                  <button
                    key={d}
                    type='button'
                    onClick={() =>
                      setForm(prev => ({ ...prev, difficulty: d }))
                    }
                    style={{
                      ...styles.diffBtn,
                      color: active ? cfg.color : '#6b7280',
                      background: active ? cfg.bg : 'transparent',
                      border: `1.5px solid ${active ? cfg.border : '#2d2d3a'}`
                    }}
                  >
                    <span
                      style={{
                        width: 7,
                        height: 7,
                        borderRadius: '50%',
                        background: active ? cfg.color : '#6b7280',
                        display: 'inline-block',
                        boxShadow: active ? `0 0 8px ${cfg.color}` : 'none',
                        transition: 'box-shadow 0.2s'
                      }}
                    />
                    {d}
                  </button>
                )
              })}
            </div>
          </Field>

          {/* Description */}
          <Field label='Description' required>
            <textarea
              name='description'
              value={form.description}
              onChange={handleChange}
              placeholder="Describe the problem clearly. Include constraints, edge cases, and what's expected…"
              rows={6}
              style={{
                ...styles.input,
                resize: 'vertical',
                minHeight: 120,
                lineHeight: 1.6
              }}
              onFocus={e =>
                Object.assign(e.target.style, {
                  ...styles.input,
                  ...styles.inputFocus,
                  resize: 'vertical',
                  minHeight: '120px',
                  lineHeight: '1.6'
                })
              }
              onBlur={e =>
                Object.assign(e.target.style, {
                  ...styles.input,
                  resize: 'vertical',
                  minHeight: '120px',
                  lineHeight: '1.6'
                })
              }
            />
          </Field>

          {/* I/O row */}
          <div style={styles.ioRow}>
            <Field label='Example Input' style={{ flex: 1 }}>
              <textarea
                name='input'
                value={form.input}
                onChange={handleChange}
                placeholder='[1,2,3]&#10;target = 9'
                rows={4}
                style={{ ...styles.input, ...styles.mono, resize: 'vertical' }}
                onFocus={e =>
                  Object.assign(e.target.style, {
                    ...styles.input,
                    ...styles.mono,
                    ...styles.inputFocus,
                    resize: 'vertical'
                  })
                }
                onBlur={e =>
                  Object.assign(e.target.style, {
                    ...styles.input,
                    ...styles.mono,
                    resize: 'vertical'
                  })
                }
              />
            </Field>
            <div style={styles.ioArrow}>→</div>
            <Field label='Expected Output' style={{ flex: 1 }}>
              <textarea
                name='output'
                value={form.output}
                onChange={handleChange}
                placeholder='[0, 2]'
                rows={4}
                style={{ ...styles.input, ...styles.mono, resize: 'vertical' }}
                onFocus={e =>
                  Object.assign(e.target.style, {
                    ...styles.input,
                    ...styles.mono,
                    ...styles.inputFocus,
                    resize: 'vertical'
                  })
                }
                onBlur={e =>
                  Object.assign(e.target.style, {
                    ...styles.input,
                    ...styles.mono,
                    resize: 'vertical'
                  })
                }
              />
            </Field>
          </div>

          {/* Actions */}
          <div style={styles.actions}>
            <button
              type='button'
              onClick={() => navigate(-1)}
              style={styles.cancelBtn}
              onMouseEnter={e => (e.target.style.background = '#1e1e2a')}
              onMouseLeave={e => (e.target.style.background = 'transparent')}
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={loading}
              style={{
                ...styles.submitBtn,
                opacity: loading ? 0.65 : 1,
                cursor: loading ? 'not-allowed' : 'pointer',
                background: loading
                  ? '#3a3a4a'
                  : 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)'
              }}
              onMouseEnter={e => {
                if (!loading) e.target.style.transform = 'translateY(-1px)'
                e.target.style.boxShadow = '0 8px 24px rgba(99,102,241,0.4)'
              }}
              onMouseLeave={e => {
                e.target.style.transform = 'none'
                e.target.style.boxShadow = '0 4px 14px rgba(99,102,241,0.25)'
              }}
            >
              {loading ? (
                <span style={styles.loadingRow}>
                  <span style={styles.spinner} />
                  Publishing…
                </span>
              ) : (
                '+ Publish Problem'
              )}
            </button>
          </div>
        </div>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Mono:wght@400;700&family=Sora:wght@400;500;600;700&display=swap');
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes fadeSlideIn {
          from { opacity: 0; transform: translateY(18px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        ::placeholder { color: #4b4b60 !important; }
      `}</style>
    </div>
  )
}

function Field ({ label, required, children, style }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8, ...style }}>
      <label style={styles.label}>
        {label}
        {required && <span style={{ color: '#6366f1', marginLeft: 3 }}>*</span>}
      </label>
      {children}
    </div>
  )
}

const styles = {
  page: {
    minHeight: '100vh',
    background: '#0d0d14',
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'center',
    padding: '48px 16px 80px',
    position: 'relative',
    overflow: 'hidden',
    fontFamily: "'Sora', sans-serif"
  },
  bgGrid: {
    position: 'absolute',
    inset: 0,
    pointerEvents: 'none',
    backgroundImage: `
      linear-gradient(rgba(99,102,241,0.04) 1px, transparent 1px),
      linear-gradient(90deg, rgba(99,102,241,0.04) 1px, transparent 1px)
    `,
    backgroundSize: '40px 40px',
    maskImage:
      'radial-gradient(ellipse 80% 60% at 50% 0%, black 60%, transparent 100%)'
  },
  container: {
    width: '100%',
    maxWidth: 680,
    display: 'flex',
    flexDirection: 'column',
    gap: 32,
    animation: 'fadeSlideIn 0.5s ease both',
    position: 'relative',
    zIndex: 1
  },
  header: {
    textAlign: 'center',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 10
  },
  badge: {
    fontSize: 10,
    fontWeight: 700,
    letterSpacing: '0.2em',
    color: '#6366f1',
    background: 'rgba(99,102,241,0.1)',
    border: '1px solid rgba(99,102,241,0.3)',
    borderRadius: 100,
    padding: '4px 14px'
  },
  title: {
    fontSize: 30,
    fontWeight: 700,
    color: '#f1f0ff',
    margin: 0,
    letterSpacing: '-0.5px'
  },
  subtitle: { fontSize: 14, color: '#6b7280', margin: 0 },
  card: {
    background: '#13131e',
    border: '1px solid #1f1f30',
    borderRadius: 20,
    padding: 32,
    display: 'flex',
    flexDirection: 'column',
    gap: 24,
    boxShadow: '0 0 0 1px rgba(99,102,241,0.05), 0 20px 60px rgba(0,0,0,0.5)'
  },
  errorBanner: {
    background: 'rgba(239,68,68,0.08)',
    border: '1px solid rgba(239,68,68,0.25)',
    borderRadius: 10,
    padding: '12px 16px',
    color: '#f87171',
    fontSize: 13.5,
    display: 'flex',
    alignItems: 'center',
    gap: 10
  },
  label: {
    fontSize: 12,
    fontWeight: 600,
    color: '#8b8ba0',
    letterSpacing: '0.06em',
    textTransform: 'uppercase'
  },
  input: {
    width: '100%',
    boxSizing: 'border-box',
    background: '#0d0d14',
    border: '1.5px solid #1f1f30',
    borderRadius: 10,
    padding: '12px 14px',
    color: '#e8e8f0',
    fontSize: 14,
    outline: 'none',
    transition: 'border-color 0.2s, box-shadow 0.2s',
    fontFamily: "'Sora', sans-serif"
  },
  inputFocus: {
    borderColor: 'rgba(99,102,241,0.6)',
    boxShadow: '0 0 0 3px rgba(99,102,241,0.1)',
    background: '#0d0d14',
    color: '#e8e8f0'
  },
  mono: { fontFamily: "'Space Mono', monospace", fontSize: 13 },
  diffGroup: { display: 'flex', gap: 10 },
  diffBtn: {
    flex: 1,
    padding: '9px 12px',
    borderRadius: 10,
    cursor: 'pointer',
    fontSize: 13,
    fontWeight: 600,
    display: 'flex',
    alignItems: 'center',
    gap: 7,
    transition: 'all 0.18s',
    fontFamily: "'Sora', sans-serif"
  },
  ioRow: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: 12
  },
  ioArrow: {
    color: '#3a3a50',
    fontSize: 20,
    paddingTop: 34,
    flexShrink: 0
  },
  actions: {
    display: 'flex',
    gap: 12,
    justifyContent: 'flex-end',
    paddingTop: 8,
    borderTop: '1px solid #1a1a28'
  },
  cancelBtn: {
    padding: '11px 22px',
    borderRadius: 10,
    background: 'transparent',
    border: '1.5px solid #2a2a3a',
    color: '#8b8ba0',
    fontSize: 14,
    cursor: 'pointer',
    fontFamily: "'Sora', sans-serif",
    fontWeight: 500,
    transition: 'background 0.15s'
  },
  submitBtn: {
    padding: '11px 28px',
    borderRadius: 10,
    border: 'none',
    color: '#fff',
    fontSize: 14,
    fontWeight: 600,
    fontFamily: "'Sora', sans-serif",
    boxShadow: '0 4px 14px rgba(99,102,241,0.25)',
    transition: 'transform 0.15s, box-shadow 0.15s',
    letterSpacing: 0.2
  },
  loadingRow: {
    display: 'flex',
    alignItems: 'center',
    gap: 10
  },
  spinner: {
    width: 14,
    height: 14,
    border: '2px solid rgba(255,255,255,0.25)',
    borderTopColor: '#fff',
    borderRadius: '50%',
    display: 'inline-block',
    animation: 'spin 0.7s linear infinite'
  },
  denied: {
    minHeight: '100vh',
    background: '#0d0d14',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    fontFamily: "'Sora', sans-serif"
  },
  deniedIcon: { fontSize: 40 },
  deniedText: { fontSize: 22, fontWeight: 700, color: '#f87171', margin: 0 },
  deniedSub: { fontSize: 14, color: '#6b7280', margin: 0 }
}

export default AddProblem
