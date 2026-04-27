import { useEffect, useState } from 'react'
import { getLeaderboard } from '../services/userService'
import { useNavigate } from 'react-router-dom'

const FONTS = `@import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@400;500&family=JetBrains+Mono:wght@400;500&display=swap');`

const medals = ['🥇', '🥈', '🥉']

const rankColors = {
  0: {
    bg: 'rgba(251,191,36,0.06)',
    border: 'rgba(251,191,36,0.2)',
    num: '#fbbf24'
  },
  1: {
    bg: 'rgba(148,163,184,0.06)',
    border: 'rgba(148,163,184,0.2)',
    num: '#94a3b8'
  },
  2: {
    bg: 'rgba(180,120,60,0.06)',
    border: 'rgba(180,120,60,0.2)',
    num: '#b4783c'
  }
}

function Leaderboard () {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const navigate = useNavigate()

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getLeaderboard()
        setUsers(data)
      } catch {
        setError('Failed to load leaderboard')
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

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
        <div
          style={{
            width: 34,
            height: 34,
            border: '2px solid #1a1a2e',
            borderTop: '2px solid #7c3aed',
            borderRadius: '50%',
            animation: 'spin 0.8s linear infinite'
          }}
        />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    )

  if (error)
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
        {error}
      </div>
    )

  return (
    <div
      style={{
        minHeight: '100vh',
        background: '#09090f',
        padding: '32px 24px',
        fontFamily: 'DM Sans, sans-serif'
      }}
    >
      <style>{FONTS}</style>
      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes fadeUp { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }
        .lb-row:hover { background: #141425 !important; transform: translateX(3px); }
      `}</style>

      <div style={{ maxWidth: 680, margin: '0 auto' }}>
        {/* Header */}
        <div style={{ marginBottom: 32, animation: 'fadeUp 0.4s ease' }}>
          <p
            style={{
              margin: '0 0 6px',
              fontSize: 12,
              color: '#64748b',
              fontFamily: 'JetBrains Mono, monospace',
              letterSpacing: '0.08em',
              textTransform: 'uppercase'
            }}
          >
            global rankings
          </p>
          <h1
            style={{
              fontFamily: 'Syne, sans-serif',
              fontSize: 30,
              fontWeight: 800,
              color: '#f1f5f9',
              margin: 0,
              letterSpacing: '-0.5px'
            }}
          >
            🏆 Leaderboard
          </h1>
        </div>

        {/* Top 3 Podium */}
        {users.length >= 3 && (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr 1fr',
              gap: 12,
              marginBottom: 24,
              animation: 'fadeUp 0.45s ease'
            }}
          >
            {[users[1], users[0], users[2]].map((u, podiumIdx) => {
              const actualRank = podiumIdx === 0 ? 1 : podiumIdx === 1 ? 0 : 2
              const heights = ['100px', '120px', '90px']
              const rc = rankColors[actualRank]
              return (
                <div
                  key={u.username}
                  onClick={() => navigate(`/dashboard/profile/${u.username}`)}
                  style={{
                    background: rc.bg,
                    border: `1px solid ${rc.border}`,
                    borderRadius: 14,
                    padding: '16px 12px',
                    textAlign: 'center',
                    cursor: 'pointer',
                    height: heights[podiumIdx],
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'flex-end',
                    transition: 'all 0.15s'
                  }}
                  onMouseEnter={e =>
                    (e.currentTarget.style.transform = 'translateY(-3px)')
                  }
                  onMouseLeave={e =>
                    (e.currentTarget.style.transform = 'translateY(0)')
                  }
                >
                  <div style={{ fontSize: 22, marginBottom: 4 }}>
                    {medals[actualRank]}
                  </div>
                  <p
                    style={{
                      margin: 0,
                      fontFamily: 'Syne, sans-serif',
                      fontSize: 13,
                      fontWeight: 700,
                      color: '#f1f5f9'
                    }}
                  >
                    {u.username}
                  </p>
                  <p
                    style={{
                      margin: '2px 0 0',
                      fontFamily: 'JetBrains Mono, monospace',
                      fontSize: 11,
                      color: rc.num
                    }}
                  >
                    {u.rating} ⭐
                  </p>
                </div>
              )
            })}
          </div>
        )}

        {/* Full List */}
        <div
          style={{
            background: '#0f0f1a',
            border: '1px solid #1a1a2e',
            borderRadius: 16,
            overflow: 'hidden',
            animation: 'fadeUp 0.5s ease'
          }}
        >
          {users.map((u, i) => {
            const rc = rankColors[i] || {}
            return (
              <div
                key={u.username}
                className='lb-row'
                onClick={() => navigate(`/dashboard/profile/${u.username}`)}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '14px 20px',
                  cursor: 'pointer',
                  borderBottom: '1px solid #1a1a2e',
                  transition: 'all 0.15s',
                  background: i < 3 ? rc.bg || 'transparent' : 'transparent'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                  <span
                    style={{
                      fontFamily: 'JetBrains Mono, monospace',
                      fontSize: 13,
                      fontWeight: 600,
                      color: i < 3 ? rc.num : '#64748b',
                      width: 28,
                      textAlign: 'center'
                    }}
                  >
                    {i < 3 ? medals[i] : `#${i + 1}`}
                  </span>
                  <span
                    style={{
                      fontFamily: 'DM Sans, sans-serif',
                      fontSize: 14,
                      fontWeight: 500,
                      color: '#e2e8f0'
                    }}
                  >
                    {u.username}
                  </span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                  <span
                    style={{
                      fontSize: 12,
                      color: '#64748b',
                      fontFamily: 'JetBrains Mono, monospace'
                    }}
                  >
                    <span style={{ color: '#10b981', fontWeight: 600 }}>
                      {u.solved}
                    </span>{' '}
                    solved
                  </span>
                  <span
                    style={{
                      fontFamily: 'JetBrains Mono, monospace',
                      fontSize: 12,
                      fontWeight: 600,
                      color: i < 3 ? rc.num : '#94a3b8',
                      background: '#09090f',
                      border: '1px solid #1a1a2e',
                      padding: '3px 10px',
                      borderRadius: 20
                    }}
                  >
                    {u.rating} ⭐
                  </span>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default Leaderboard
