import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { getUserProfile } from '../../services/userService'

const FONTS = `@import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@400;500&family=JetBrains+Mono:wght@400;500&display=swap');`

function Profile () {
  const { username } = useParams()
  const { user } = useAuth()

  // auto fallback to logged-in user
  const finalUsername = (username || user?.username)?.toLowerCase()
  const [data, setData] = useState(null)

  useEffect(() => {
    if (!finalUsername) return
    const fetch = async () => {
      try {
        const res = await getUserProfile(finalUsername)
        setData(res)
      } catch (err) {
        console.log('error', err)
        setData(null)
      }
    }
    fetch()
  }, [finalUsername])

  if (!finalUsername)
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

  if (!data)
    return (
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh',
          background: '#09090f',
          color: '#64748b',
          fontFamily: 'DM Sans, sans-serif',
          fontSize: 16
        }}
      >
        <style>{FONTS}</style>
        User not found
      </div>
    )

  const isOwnProfile = user?.username?.toLowerCase() === finalUsername

  return (
    <div
      style={{
        minHeight: '100vh',
        background: '#09090f',
        fontFamily: 'DM Sans, sans-serif',
        padding: '0 0 40px'
      }}
    >
      <style>{FONTS}</style>
      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes fadeUp { from { opacity: 0; transform: translateY(14px); } to { opacity: 1; transform: translateY(0); } }
        .activity-row:hover { background: #141425 !important; }
      `}</style>

      {/* Profile Hero Banner */}
      <div
        style={{
          background:
            'linear-gradient(135deg, #1e0a3c 0%, #0f0f1a 60%, #09090f 100%)',
          borderBottom: '1px solid #1a1a2e',
          padding: '40px 24px 32px',
          animation: 'fadeUp 0.4s ease'
        }}
      >
        <div
          style={{
            maxWidth: 760,
            margin: '0 auto',
            display: 'flex',
            alignItems: 'flex-end',
            gap: 20,
            flexWrap: 'wrap'
          }}
        >
          {/* Avatar */}
          <div
            style={{
              width: 80,
              height: 80,
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #7c3aed, #06b6d4)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 32,
              flexShrink: 0,
              border: '3px solid #1a1a2e',
              boxShadow: '0 0 30px rgba(124,58,237,0.3)'
            }}
          >
            {data.username[0].toUpperCase()}
          </div>

          <div style={{ flex: 1 }}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                marginBottom: 4,
                flexWrap: 'wrap'
              }}
            >
              <h1
                style={{
                  fontFamily: 'Syne, sans-serif',
                  fontSize: 26,
                  fontWeight: 800,
                  color: '#f1f5f9',
                  margin: 0,
                  letterSpacing: '-0.3px'
                }}
              >
                {data.username}
              </h1>
              {isOwnProfile && (
                <span
                  style={{
                    fontSize: 10,
                    color: '#7c3aed',
                    background: 'rgba(124,58,237,0.12)',
                    border: '1px solid rgba(124,58,237,0.3)',
                    padding: '2px 8px',
                    borderRadius: 20,
                    fontFamily: 'JetBrains Mono, monospace'
                  }}
                >
                  YOU
                </span>
              )}
            </div>
            <p
              style={{
                margin: 0,
                color: '#64748b',
                fontSize: 13,
                fontFamily: 'JetBrains Mono, monospace'
              }}
            >
              {data.email}
            </p>
          </div>

          {/* Rating */}
          <div style={{ textAlign: 'right' }}>
            <p
              style={{
                margin: '0 0 4px',
                fontSize: 11,
                color: '#64748b',
                fontFamily: 'JetBrains Mono, monospace',
                textTransform: 'uppercase',
                letterSpacing: '0.08em'
              }}
            >
              Rating
            </p>
            <p
              style={{
                margin: 0,
                fontFamily: 'Syne, sans-serif',
                fontSize: 24,
                fontWeight: 800,
                color: '#fbbf24'
              }}
            >
              ⭐ {data.rating}
            </p>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 760, margin: '0 auto', padding: '28px 24px 0' }}>
        {/* Stat Cards */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))',
            gap: 14,
            marginBottom: 24,
            animation: 'fadeUp 0.45s ease'
          }}
        >
          <StatCard
            title='Problems Solved'
            value={data.totalSolved}
            accent='#7c3aed'
          />
          <StatCard
            title='Total Submissions'
            value={data.totalSubmissions}
            accent='#06b6d4'
          />
        </div>

        {/* Recent Activity */}
        <div
          style={{
            background: '#0f0f1a',
            border: '1px solid #1a1a2e',
            borderRadius: 16,
            overflow: 'hidden',
            animation: 'fadeUp 0.5s ease'
          }}
        >
          <div
            style={{ padding: '18px 20px', borderBottom: '1px solid #1a1a2e' }}
          >
            <h3
              style={{
                fontFamily: 'Syne, sans-serif',
                fontSize: 15,
                fontWeight: 700,
                color: '#f1f5f9',
                margin: 0
              }}
            >
              ⏱ Recent Activity
            </h3>
          </div>

          {data.recent.length === 0 ? (
            <div
              style={{
                padding: '32px 20px',
                textAlign: 'center',
                color: '#64748b',
                fontSize: 14
              }}
            >
              No activity yet. Start solving problems! 💡
            </div>
          ) : (
            data.recent.map((item, i) => (
              <div
                key={item._id}
                className='activity-row'
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '13px 20px',
                  borderBottom:
                    i < data.recent.length - 1 ? '1px solid #1a1a2e' : 'none',
                  transition: 'background 0.15s'
                }}
              >
                <span style={{ color: '#e2e8f0', fontSize: 14 }}>
                  {item.problem?.title}
                </span>
                <span
                  style={{
                    fontSize: 11,
                    fontFamily: 'JetBrains Mono, monospace',
                    fontWeight: 600,
                    color: item.status === 'solved' ? '#10b981' : '#f59e0b',
                    background:
                      item.status === 'solved'
                        ? 'rgba(16,185,129,0.1)'
                        : 'rgba(245,158,11,0.1)',
                    border: `1px solid ${
                      item.status === 'solved'
                        ? 'rgba(16,185,129,0.25)'
                        : 'rgba(245,158,11,0.25)'
                    }`,
                    padding: '3px 10px',
                    borderRadius: 20
                  }}
                >
                  {item.status === 'solved' ? '✓ solved' : '⏳ attempted'}
                </span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}

function StatCard ({ title, value, accent }) {
  return (
    <div
      style={{
        background: '#0f0f1a',
        border: '1px solid #1a1a2e',
        borderRadius: 14,
        padding: '20px 16px',
        textAlign: 'center',
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: 2,
          background: accent,
          borderRadius: '14px 14px 0 0'
        }}
      />
      <p
        style={{
          margin: '0 0 8px',
          color: '#64748b',
          fontSize: 11,
          textTransform: 'uppercase',
          letterSpacing: '0.08em',
          fontFamily: 'JetBrains Mono, monospace'
        }}
      >
        {title}
      </p>
      <h3
        style={{
          margin: 0,
          fontFamily: 'Syne, sans-serif',
          fontSize: 28,
          fontWeight: 700,
          color: '#f1f5f9'
        }}
      >
        {value}
      </h3>
    </div>
  )
}

export default Profile
