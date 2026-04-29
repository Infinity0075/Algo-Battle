import { useEffect, useState } from 'react'
import Editor from './Editor'
import { getSocket, sendCodeChange, sendSubmit } from '../services/socket'

export default function BattleArena ({ problem, startTime, leaderboard }) {
  const [code, setCode] = useState('')
  const [submissions, setSubmissions] = useState([])
  const [activeTab, setActiveTab] = useState('problem') // 'problem' | 'leaderboard' | 'activity'

  useEffect(() => {
    if (!problem) return
    const starter = problem?.starterCode?.javascript || '// Start coding...'
    setCode(starter)
  }, [problem])

  useEffect(() => {
    const socket = getSocket()
    if (!socket) return

    socket.on('code_update', payload => {
      setCode(typeof payload === 'string' ? payload : payload.code)
    })

    socket.on('submission_result', data => {
      setSubmissions(prev => [...prev, data])
    })

    return () => {
      socket.off('code_update')
      socket.off('submission_result')
    }
  }, [])

  const handleCodeChange = val => {
    setCode(val)
    sendCodeChange(val)
  }

  const handleSubmit = () => sendSubmit(code, 'javascript')

  if (!problem) {
    return (
      <div style={s.loading}>
        <div style={s.loadingRing} />
        <p style={s.loadingText}>Loading battle…</p>
      </div>
    )
  }

  const tabs = ['problem', 'leaderboard', 'activity']

  return (
    <div style={s.root}>
      {/* ── LEFT PANEL ── */}
      <div style={s.left}>
        {/* Problem header */}
        <div style={s.problemHeader}>
          <div style={s.problemMeta}>
            <span style={{ ...s.diffBadge, ...diffStyle(problem.difficulty) }}>
              <span
                style={{
                  width: 6,
                  height: 6,
                  borderRadius: '50%',
                  background: 'currentColor',
                  display: 'inline-block',
                  boxShadow: '0 0 6px currentColor'
                }}
              />
              {problem.difficulty}
            </span>
          </div>
          <h2 style={s.problemTitle}>{problem.title}</h2>
        </div>

        {/* Tabs */}
        <div style={s.tabs}>
          {tabs.map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              style={{
                ...s.tab,
                color: activeTab === tab ? '#e8e8f0' : '#4b4b60',
                borderBottom: `2px solid ${
                  activeTab === tab ? '#6366f1' : 'transparent'
                }`
              }}
            >
              {tab === 'problem'
                ? '📄 Problem'
                : tab === 'leaderboard'
                ? '🏆 Board'
                : '⚡ Activity'}
              {tab === 'leaderboard' && leaderboard?.length > 0 && (
                <span style={s.tabBadge}>{leaderboard.length}</span>
              )}
              {tab === 'activity' && submissions.length > 0 && (
                <span style={s.tabBadge}>{submissions.length}</span>
              )}
            </button>
          ))}
        </div>

        {/* Tab content */}
        <div style={s.tabContent}>
          {activeTab === 'problem' && (
            <div style={s.scrollArea}>
              <p style={s.description}>{problem.description}</p>

              {problem.examples?.length > 0 && (
                <div style={{ marginTop: 20 }}>
                  <p style={s.sectionLabel}>EXAMPLES</p>
                  {problem.examples.map((ex, i) => (
                    <div key={i} style={s.exampleBox}>
                      <div style={s.exampleRow}>
                        <span style={s.exLabel}>Input</span>
                        <pre style={{ ...s.exCode, color: '#67e8f9' }}>
                          {ex.input}
                        </pre>
                      </div>
                      <div style={s.exampleRow}>
                        <span style={s.exLabel}>Output</span>
                        <pre style={{ ...s.exCode, color: '#4ade80' }}>
                          {ex.output}
                        </pre>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'leaderboard' && (
            <div style={s.scrollArea}>
              {leaderboard?.length === 0 ? (
                <div style={s.emptyState}>
                  <span style={{ fontSize: 28 }}>🏆</span>
                  <p style={s.emptyText}>No submissions yet</p>
                </div>
              ) : (
                <div
                  style={{ display: 'flex', flexDirection: 'column', gap: 8 }}
                >
                  {leaderboard.map((p, i) => (
                    <div
                      key={i}
                      style={{
                        ...s.leaderRow,
                        background:
                          i === 0 ? 'rgba(99,102,241,0.08)' : '#0d0d14',
                        borderColor:
                          i === 0 ? 'rgba(99,102,241,0.3)' : '#1f1f30'
                      }}
                    >
                      <div style={s.leaderLeft}>
                        <span
                          style={{
                            ...s.rank,
                            color:
                              i === 0
                                ? '#fbbf24'
                                : i === 1
                                ? '#9ca3af'
                                : '#cd7c4a'
                          }}
                        >
                          {i === 0 ? '🥇' : i === 1 ? '🥈' : '🥉'}
                        </span>
                        <span style={s.leaderName}>{p.username}</span>
                      </div>
                      <span style={s.leaderTime}>
                        {(p.time / 1000).toFixed(2)}s
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'activity' && (
            <div style={s.scrollArea}>
              {submissions.length === 0 ? (
                <div style={s.emptyState}>
                  <span style={{ fontSize: 28 }}>⚡</span>
                  <p style={s.emptyText}>No activity yet</p>
                </div>
              ) : (
                <div
                  style={{ display: 'flex', flexDirection: 'column', gap: 6 }}
                >
                  {submissions.map((sub, i) => (
                    <div key={i} style={s.activityRow}>
                      <span style={{ color: '#8b8ba0', fontSize: 13 }}>
                        {sub.username || 'You'}
                      </span>
                      <span
                        style={{
                          fontSize: 12,
                          fontWeight: 600,
                          padding: '2px 10px',
                          borderRadius: 100,
                          background:
                            sub.status === 'Accepted'
                              ? 'rgba(34,197,94,0.1)'
                              : 'rgba(239,68,68,0.1)',
                          color:
                            sub.status === 'Accepted' ? '#4ade80' : '#f87171'
                        }}
                      >
                        {sub.status}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* ── RIGHT PANEL ── */}
      <div style={s.right}>
        <Editor
          mode='battle'
          externalCode={code}
          setExternalCode={handleCodeChange}
          problem={problem}
          onBattleSubmit={handleSubmit}
        />
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Mono:wght@400;700&family=Sora:wght@400;500;600;700&display=swap');
        @keyframes spin { to{transform:rotate(360deg)} }
      `}</style>
    </div>
  )
}

const diffStyle = d =>
  ({
    Easy: {
      color: '#4ade80',
      background: 'rgba(34,197,94,0.1)',
      border: '1px solid rgba(34,197,94,0.3)'
    },
    Medium: {
      color: '#fbbf24',
      background: 'rgba(245,158,11,0.1)',
      border: '1px solid rgba(245,158,11,0.3)'
    },
    Hard: {
      color: '#f87171',
      background: 'rgba(239,68,68,0.1)',
      border: '1px solid rgba(239,68,68,0.3)'
    }
  }[d] || {})

const s = {
  root: {
    display: 'flex',
    height: '100%',
    background: '#09090f',
    fontFamily: "'Sora', sans-serif",
    color: '#fff',
    overflow: 'hidden'
  },
  left: {
    width: '38%',
    minWidth: 300,
    borderRight: '1px solid #1a1a2e',
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
    background: '#0d0d14'
  },
  problemHeader: {
    padding: '20px 20px 0',
    flexShrink: 0
  },
  problemMeta: { marginBottom: 8 },
  diffBadge: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 6,
    fontSize: 11,
    fontWeight: 700,
    padding: '3px 10px',
    borderRadius: 100
  },
  problemTitle: {
    fontSize: 18,
    fontWeight: 700,
    color: '#f1f0ff',
    margin: '8px 0 0',
    letterSpacing: '-0.3px',
    lineHeight: 1.3
  },
  tabs: {
    display: 'flex',
    gap: 0,
    padding: '12px 20px 0',
    flexShrink: 0,
    borderBottom: '1px solid #1a1a2e'
  },
  tab: {
    padding: '8px 14px',
    fontSize: 12,
    fontWeight: 600,
    background: 'none',
    border: 'none',
    borderBottom: '2px solid transparent',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: 6,
    fontFamily: "'Sora', sans-serif",
    transition: 'color 0.15s',
    marginBottom: -1
  },
  tabBadge: {
    fontSize: 10,
    fontWeight: 700,
    padding: '1px 6px',
    borderRadius: 100,
    background: 'rgba(99,102,241,0.2)',
    color: '#818cf8'
  },
  tabContent: { flex: 1, overflow: 'hidden' },
  scrollArea: { height: '100%', overflowY: 'auto', padding: 20 },
  description: {
    fontSize: 13.5,
    color: '#9898b0',
    lineHeight: 1.8,
    margin: 0,
    whiteSpace: 'pre-wrap'
  },
  sectionLabel: {
    fontSize: 10,
    fontWeight: 700,
    letterSpacing: '0.15em',
    color: '#4b4b60',
    margin: '0 0 10px'
  },
  exampleBox: {
    background: '#13131e',
    border: '1px solid #1f1f30',
    borderRadius: 10,
    padding: '12px 14px',
    marginBottom: 10,
    display: 'flex',
    flexDirection: 'column',
    gap: 8
  },
  exampleRow: { display: 'flex', alignItems: 'flex-start', gap: 10 },
  exLabel: {
    fontSize: 11,
    fontWeight: 600,
    color: '#4b4b60',
    minWidth: 40,
    paddingTop: 2
  },
  exCode: {
    fontFamily: "'Space Mono', monospace",
    fontSize: 12,
    margin: 0,
    flex: 1
  },
  leaderRow: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '10px 14px',
    borderRadius: 10,
    border: '1px solid'
  },
  leaderLeft: { display: 'flex', alignItems: 'center', gap: 10 },
  rank: { fontSize: 16 },
  leaderName: { fontSize: 13, color: '#e8e8f0', fontWeight: 500 },
  leaderTime: {
    fontFamily: "'Space Mono', monospace",
    fontSize: 12,
    color: '#4ade80'
  },
  activityRow: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '8px 12px',
    background: '#13131e',
    border: '1px solid #1f1f30',
    borderRadius: 8
  },
  emptyState: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingTop: 40
  },
  emptyText: { color: '#4b4b60', fontSize: 13, margin: 0 },
  right: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden'
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
