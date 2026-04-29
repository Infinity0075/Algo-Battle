import { useEffect, useState } from 'react'
import { useAuth } from '../../../features/auth/context/useAuth'
import {
  getProblems,
  deleteProblem
} from '../../problem/services/problemService'
import { useNavigate } from 'react-router-dom'

const difficultyConfig = {
  Easy: {
    color: '#22c55e',
    bg: 'rgba(34,197,94,0.12)',
    border: 'rgba(34,197,94,0.3)'
  },
  Medium: {
    color: '#f59e0b',
    bg: 'rgba(245,158,11,0.12)',
    border: 'rgba(245,158,11,0.3)'
  },
  Hard: {
    color: '#ef4444',
    bg: 'rgba(239,68,68,0.12)',
    border: 'rgba(239,68,68,0.3)'
  }
}

function ManageProblems () {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [problems, setProblems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [deletingId, setDeletingId] = useState(null)
  const [confirmId, setConfirmId] = useState(null) // id pending confirmation

  useEffect(() => {
    if (user?.role !== 'admin') {
      setLoading(false)
      return
    }
    ;(async () => {
      try {
        const data = await getProblems()
        setProblems(data)
      } catch (err) {
        setError(err?.response?.data?.message || 'Failed to load problems')
      } finally {
        setLoading(false)
      }
    })()
  }, [user?.role])

  const handleDelete = async id => {
    try {
      setDeletingId(id)
      await deleteProblem(id)
      setProblems(prev => prev.filter(p => p._id !== id))
    } catch (err) {
      setError(err?.response?.data?.message || 'Delete failed')
    } finally {
      setDeletingId(null)
      setConfirmId(null)
    }
  }

  // ── Guard states ──────────────────────────────────────────────
  if (user?.role !== 'admin') {
    return (
      <div style={styles.denied}>
        <span style={{ fontSize: 40 }}>⛔</span>
        <p
          style={{ fontSize: 22, fontWeight: 700, color: '#f87171', margin: 0 }}
        >
          Access Denied
        </p>
        <p style={{ fontSize: 14, color: '#6b7280', margin: 0 }}>
          Admin privileges required.
        </p>
      </div>
    )
  }

  if (loading) {
    return (
      <div style={styles.denied}>
        <div style={styles.pulseRing} />
        <p
          style={{
            color: '#6b7280',
            fontSize: 14,
            margin: 0,
            fontFamily: "'Sora',sans-serif"
          }}
        >
          Loading problems…
        </p>
      </div>
    )
  }

  return (
    <div style={styles.page}>
      <div style={styles.bgGrid} aria-hidden='true' />

      <div style={styles.container}>
        {/* Header row */}
        <div style={styles.headerRow}>
          <div>
            <div style={styles.badge}>ADMIN PANEL</div>
            <h1 style={styles.title}>Manage Problems</h1>
            <p style={styles.subtitle}>
              {problems.length} problem{problems.length !== 1 ? 's' : ''} in the
              bank
            </p>
          </div>
          <button
            onClick={() => navigate('/dashboard/admin/add-problem')}
            style={styles.addBtn}
            onMouseEnter={e => {
              e.currentTarget.style.transform = 'translateY(-1px)'
              e.currentTarget.style.boxShadow =
                '0 8px 24px rgba(99,102,241,0.4)'
            }}
            onMouseLeave={e => {
              e.currentTarget.style.transform = 'none'
              e.currentTarget.style.boxShadow =
                '0 4px 14px rgba(99,102,241,0.25)'
            }}
          >
            + Add Problem
          </button>
        </div>

        {/* Error */}
        {error && (
          <div style={styles.errorBanner}>
            <span>⚠</span> {error}
          </div>
        )}

        {/* Table card */}
        <div style={styles.card}>
          {problems.length === 0 ? (
            <div style={styles.emptyState}>
              <span style={{ fontSize: 36 }}>📭</span>
              <p style={{ color: '#6b7280', margin: 0, fontSize: 14 }}>
                No problems yet — add one to get started.
              </p>
            </div>
          ) : (
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={{ ...styles.th, width: '5%' }}>#</th>
                  <th style={{ ...styles.th, width: '50%' }}>Title</th>
                  <th style={{ ...styles.th, width: '20%' }}>Difficulty</th>
                  <th
                    style={{ ...styles.th, width: '25%', textAlign: 'right' }}
                  >
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {problems.map((p, i) => {
                  const cfg =
                    difficultyConfig[p.difficulty] || difficultyConfig.Easy
                  const isConfirming = confirmId === p._id
                  const isDeleting = deletingId === p._id

                  return (
                    <tr
                      key={p._id}
                      style={styles.tr}
                      onMouseEnter={e =>
                        (e.currentTarget.style.background = '#16161f')
                      }
                      onMouseLeave={e =>
                        (e.currentTarget.style.background = 'transparent')
                      }
                    >
                      {/* # */}
                      <td
                        style={{
                          ...styles.td,
                          color: '#3a3a50',
                          fontFamily: "'Space Mono',monospace",
                          fontSize: 12
                        }}
                      >
                        {String(i + 1).padStart(2, '0')}
                      </td>

                      {/* Title */}
                      <td
                        style={{
                          ...styles.td,
                          fontWeight: 600,
                          color: '#e8e8f0'
                        }}
                      >
                        {p.title}
                      </td>

                      {/* Difficulty badge */}
                      <td style={styles.td}>
                        <span
                          style={{
                            ...styles.diffBadge,
                            color: cfg.color,
                            background: cfg.bg,
                            border: `1px solid ${cfg.border}`
                          }}
                        >
                          <span
                            style={{
                              width: 5,
                              height: 5,
                              borderRadius: '50%',
                              background: cfg.color,
                              display: 'inline-block',
                              boxShadow: `0 0 6px ${cfg.color}`
                            }}
                          />
                          {p.difficulty}
                        </span>
                      </td>

                      {/* Actions */}
                      <td style={{ ...styles.td, textAlign: 'right' }}>
                        {isConfirming ? (
                          // Inline confirmation
                          <span
                            style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: 8
                            }}
                          >
                            <span style={{ color: '#6b7280', fontSize: 12 }}>
                              Sure?
                            </span>
                            <button
                              onClick={() => handleDelete(p._id)}
                              disabled={isDeleting}
                              style={{
                                ...styles.actionBtn,
                                ...styles.dangerBtn
                              }}
                            >
                              {isDeleting ? '…' : 'Yes, delete'}
                            </button>
                            <button
                              onClick={() => setConfirmId(null)}
                              style={{
                                ...styles.actionBtn,
                                ...styles.ghostBtn
                              }}
                            >
                              Cancel
                            </button>
                          </span>
                        ) : (
                          <span style={{ display: 'inline-flex', gap: 8 }}>
                            <button
                              onClick={() =>
                                navigate(`/dashboard/admin/edit/${p._id}`)
                              }
                              style={{ ...styles.actionBtn, ...styles.editBtn }}
                              onMouseEnter={e =>
                                (e.currentTarget.style.background = '#23233a')
                              }
                              onMouseLeave={e =>
                                (e.currentTarget.style.background =
                                  'transparent')
                              }
                            >
                              ✎ Edit
                            </button>
                            <button
                              onClick={() => setConfirmId(p._id)}
                              style={{
                                ...styles.actionBtn,
                                ...styles.dangerBtn
                              }}
                              onMouseEnter={e =>
                                (e.currentTarget.style.background =
                                  'rgba(239,68,68,0.2)')
                              }
                              onMouseLeave={e =>
                                (e.currentTarget.style.background =
                                  'rgba(239,68,68,0.1)')
                              }
                            >
                              ✕ Delete
                            </button>
                          </span>
                        )}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Mono:wght@400;700&family=Sora:wght@400;500;600;700&display=swap');
        @keyframes fadeSlideIn { from { opacity:0; transform:translateY(18px); } to { opacity:1; transform:translateY(0); } }
        @keyframes pulse { 0%,100% { transform:scale(1); opacity:.6; } 50% { transform:scale(1.4); opacity:1; } }
      `}</style>
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
    maxWidth: 860,
    display: 'flex',
    flexDirection: 'column',
    gap: 28,
    animation: 'fadeSlideIn 0.5s ease both',
    position: 'relative',
    zIndex: 1
  },
  headerRow: {
    display: 'flex',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: 16
  },
  badge: {
    display: 'inline-block',
    fontSize: 10,
    fontWeight: 700,
    letterSpacing: '0.2em',
    color: '#6366f1',
    background: 'rgba(99,102,241,0.1)',
    border: '1px solid rgba(99,102,241,0.3)',
    borderRadius: 100,
    padding: '4px 14px',
    marginBottom: 10
  },
  title: {
    fontSize: 28,
    fontWeight: 700,
    color: '#f1f0ff',
    margin: '0 0 4px',
    letterSpacing: '-0.5px'
  },
  subtitle: { fontSize: 13, color: '#6b7280', margin: 0 },
  addBtn: {
    padding: '11px 22px',
    borderRadius: 10,
    background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
    border: 'none',
    color: '#fff',
    fontSize: 14,
    fontWeight: 600,
    cursor: 'pointer',
    fontFamily: "'Sora', sans-serif",
    boxShadow: '0 4px 14px rgba(99,102,241,0.25)',
    transition: 'transform 0.15s, box-shadow 0.15s',
    whiteSpace: 'nowrap'
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
  card: {
    background: '#13131e',
    border: '1px solid #1f1f30',
    borderRadius: 20,
    overflow: 'hidden',
    boxShadow: '0 0 0 1px rgba(99,102,241,0.05), 0 20px 60px rgba(0,0,0,0.5)'
  },
  table: { width: '100%', borderCollapse: 'collapse' },
  th: {
    padding: '14px 18px',
    textAlign: 'left',
    fontSize: 11,
    fontWeight: 700,
    letterSpacing: '0.08em',
    textTransform: 'uppercase',
    color: '#4b4b60',
    borderBottom: '1px solid #1a1a28',
    background: '#0f0f1a'
  },
  tr: { transition: 'background 0.15s', cursor: 'default' },
  td: {
    padding: '15px 18px',
    fontSize: 14,
    color: '#9898b0',
    borderBottom: '1px solid #1a1a28',
    verticalAlign: 'middle'
  },
  diffBadge: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 6,
    fontSize: 12,
    fontWeight: 600,
    padding: '4px 10px',
    borderRadius: 100
  },
  actionBtn: {
    padding: '6px 14px',
    borderRadius: 8,
    fontSize: 12,
    fontWeight: 600,
    cursor: 'pointer',
    fontFamily: "'Sora', sans-serif",
    transition: 'background 0.15s',
    border: 'none'
  },
  editBtn: {
    background: 'transparent',
    color: '#8b8ba0',
    border: '1.5px solid #2a2a3a'
  },
  dangerBtn: {
    background: 'rgba(239,68,68,0.1)',
    color: '#f87171',
    border: '1.5px solid rgba(239,68,68,0.25)'
  },
  ghostBtn: {
    background: 'transparent',
    color: '#6b7280',
    border: '1.5px solid #2a2a3a'
  },
  emptyState: {
    padding: '60px 20px',
    textAlign: 'center',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 12
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
  pulseRing: {
    width: 32,
    height: 32,
    borderRadius: '50%',
    border: '3px solid #6366f1',
    animation: 'pulse 1.2s ease-in-out infinite'
  }
}

export default ManageProblems
