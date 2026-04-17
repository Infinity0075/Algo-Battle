import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

import { problems } from '../../pages/dashboard/practice/problems'
import ActivityHeatmap from '../../components/ActivityHeatmap'

import {
  getStats,
  getActivity,
  getRecent,
  getStreak
} from '../../services/submissionService'

const FONTS = `@import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:wght@300;400;500&family=JetBrains+Mono:wght@400;500&display=swap');`

const theme = {
  bg: '#09090f',
  surface: '#0f0f1a',
  surfaceHover: '#141425',
  border: '#1a1a2e',
  accent: '#7c3aed',
  accentGlow: 'rgba(124,58,237,0.15)',
  cyan: '#06b6d4',
  green: '#10b981',
  orange: '#f59e0b',
  red: '#ef4444',
  textPrimary: '#f1f5f9',
  textMuted: '#64748b',
  textSub: '#94a3b8'
}

function Overview () {
  const navigate = useNavigate()
  const { user } = useAuth()

  const [stats, setStats] = useState({})
  const [activityData, setActivityData] = useState({})
  const [recent, setRecent] = useState([])
  const [streak, setStreak] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!user) return
        const token = user.token
        const statsData = await getStats(token)
        const activity = await getActivity(token)
        const recentData = await getRecent(token)
        const streakData = await getStreak(token)
        setStats(statsData)
        setActivityData(activity)
        setRecent(recentData)
        setStreak(streakData.streak)
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [user])

  if (loading)
    return (
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh',
          background: theme.bg
        }}
      >
        <style>{FONTS}</style>
        <div style={{ textAlign: 'center' }}>
          <div
            style={{
              width: 40,
              height: 40,
              border: `2px solid ${theme.border}`,
              borderTop: `2px solid ${theme.accent}`,
              borderRadius: '50%',
              animation: 'spin 0.8s linear infinite',
              margin: '0 auto 12px'
            }}
          />
          <p
            style={{
              color: theme.textMuted,
              fontFamily: 'DM Sans, sans-serif',
              fontSize: 14
            }}
          >
            Loading dashboard...
          </p>
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
      </div>
    )

  return (
    <div
      style={{
        padding: '32px 28px',
        background: theme.bg,
        minHeight: '100vh',
        fontFamily: 'DM Sans, sans-serif'
      }}
    >
      <style>{FONTS}</style>
      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes fadeUp { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }
        .stat-card:hover { transform: translateY(-2px); background: ${theme.surfaceHover} !important; }
        .recent-row:hover { background: ${theme.surfaceHover} !important; }
        .action-btn:hover { background: ${theme.accentGlow} !important; border-color: ${theme.accent} !important; color: ${theme.accent} !important; transform: translateY(-1px); }
      `}</style>

      {/* Header */}
      <div style={{ marginBottom: 32, animation: 'fadeUp 0.4s ease' }}>
        <p
          style={{
            color: theme.textMuted,
            fontSize: 13,
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            marginBottom: 6,
            fontFamily: 'JetBrains Mono, monospace'
          }}
        >
          Welcome back, {user?.username || 'coder'} 👋
        </p>
        <h1
          style={{
            fontFamily: 'Syne, sans-serif',
            fontSize: 32,
            fontWeight: 800,
            color: theme.textPrimary,
            margin: 0,
            letterSpacing: '-0.5px'
          }}
        >
          Dashboard
        </h1>
      </div>

      {/* Streak Banner */}
      <div
        style={{
          marginBottom: 24,
          background: `linear-gradient(135deg, #1a1025 0%, #0f0f1a 100%)`,
          border: `1px solid ${streak > 0 ? '#7c3aed44' : theme.border}`,
          borderRadius: 16,
          padding: '18px 24px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          animation: 'fadeUp 0.45s ease'
        }}
      >
        <div>
          <p
            style={{
              margin: 0,
              color: theme.textMuted,
              fontSize: 12,
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              fontFamily: 'JetBrains Mono, monospace'
            }}
          >
            Current Streak
          </p>
          <h2
            style={{
              margin: '4px 0 0',
              fontFamily: 'Syne, sans-serif',
              fontSize: 28,
              fontWeight: 700,
              color: streak > 0 ? '#f59e0b' : theme.textMuted
            }}
          >
            {streak} {streak === 1 ? 'day' : 'days'}
          </h2>
          <p
            style={{ margin: '2px 0 0', fontSize: 13, color: theme.textMuted }}
          >
            {streak === 0 ? 'Start your streak today 🚀' : 'Keep it going!'}
          </p>
        </div>
        <div
          style={{
            fontSize: 48,
            filter:
              streak > 0
                ? 'drop-shadow(0 0 12px #f59e0b88)'
                : 'grayscale(1) opacity(0.3)'
          }}
        >
          🔥
        </div>
      </div>

      {/* Stat Cards */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
          gap: 14,
          marginBottom: 28,
          animation: 'fadeUp 0.5s ease'
        }}
      >
        <StatCard
          title='Total Solved'
          value={stats.totalSolved || 0}
          accent={theme.accent}
        />
        <StatCard
          title='Submissions'
          value={stats.totalSubmissions || 0}
          accent={theme.cyan}
        />
        <StatCard title='Easy' value={stats.easy || 0} accent={theme.green} />
        <StatCard
          title='Medium'
          value={stats.medium || 0}
          accent={theme.orange}
        />
        <StatCard title='Hard' value={stats.hard || 0} accent={theme.red} />
      </div>

      {/* Activity Heatmap */}
      <SectionCard
        title='Daily Activity'
        icon='📊'
        style={{ marginBottom: 24, animation: 'fadeUp 0.55s ease' }}
      >
        <ActivityHeatmap data={activityData} />
      </SectionCard>

      {/* Recent Activity */}
      <SectionCard
        title='Recent Activity'
        icon='⏱'
        style={{ marginBottom: 24, animation: 'fadeUp 0.6s ease' }}
      >
        {recent.length === 0 ? (
          <div
            style={{
              textAlign: 'center',
              padding: '24px 0',
              color: theme.textMuted,
              fontSize: 14
            }}
          >
            <p style={{ margin: 0 }}>No submissions yet. Start solving! 💡</p>
          </div>
        ) : (
          recent.map(item => (
            <div
              key={item._id}
              className='recent-row'
              onClick={() =>
                navigate(`/dashboard/practice/${item.problem.slug}`)
              }
              style={{
                padding: '12px 14px',
                borderRadius: 10,
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                cursor: 'pointer',
                marginBottom: 4,
                transition: 'background 0.15s ease',
                borderBottom: `1px solid ${theme.border}`
              }}
            >
              <span style={{ color: theme.textPrimary, fontSize: 14 }}>
                {item.problem?.title}
              </span>
              <span
                style={{
                  color: item.status === 'solved' ? theme.green : theme.orange,
                  fontFamily: 'JetBrains Mono, monospace',
                  fontSize: 12,
                  background:
                    item.status === 'solved'
                      ? 'rgba(16,185,129,0.1)'
                      : 'rgba(245,158,11,0.1)',
                  padding: '3px 10px',
                  borderRadius: 20,
                  fontWeight: 500
                }}
              >
                {item.status === 'solved' ? '✓ solved' : '⏳ attempted'}
              </span>
            </div>
          ))
        )}
      </SectionCard>

      {/* Quick Actions */}
      <SectionCard
        title='Quick Actions'
        icon='⚡'
        style={{ animation: 'fadeUp 0.65s ease' }}
      >
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
          <ActionButton
            label='Practice'
            icon='🧠'
            onClick={() => navigate('/dashboard/practice')}
          />
          <ActionButton
            label='Battle'
            icon='⚔️'
            onClick={() => navigate('/dashboard/battle')}
          />
          <ActionButton
            label='Leaderboard'
            icon='🏆'
            onClick={() => navigate('/dashboard/leaderboard')}
          />
        </div>
      </SectionCard>
    </div>
  )
}

function StatCard ({ title, value, accent }) {
  return (
    <div
      className='stat-card'
      style={{
        background: theme.surface,
        border: `1px solid ${theme.border}`,
        padding: '20px 16px',
        borderRadius: 14,
        textAlign: 'center',
        transition: 'all 0.2s ease',
        cursor: 'default',
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
          color: theme.textMuted,
          marginBottom: 8,
          fontSize: 11,
          textTransform: 'uppercase',
          letterSpacing: '0.08em',
          fontFamily: 'JetBrains Mono, monospace'
        }}
      >
        {title}
      </p>
      <h2
        style={{
          margin: 0,
          fontFamily: 'Syne, sans-serif',
          fontSize: 30,
          fontWeight: 700,
          color: theme.textPrimary
        }}
      >
        {value}
      </h2>
    </div>
  )
}

function SectionCard ({ title, icon, children, style }) {
  return (
    <div
      style={{
        background: theme.surface,
        border: `1px solid ${theme.border}`,
        padding: '22px 20px',
        borderRadius: 16,
        marginBottom: 20,
        ...style
      }}
    >
      <h3
        style={{
          margin: '0 0 16px',
          fontFamily: 'Syne, sans-serif',
          fontSize: 15,
          fontWeight: 700,
          color: theme.textPrimary,
          display: 'flex',
          alignItems: 'center',
          gap: 8
        }}
      >
        <span>{icon}</span> {title}
      </h3>
      {children}
    </div>
  )
}

function ActionButton ({ label, icon, onClick }) {
  return (
    <button
      className='action-btn'
      onClick={onClick}
      style={{
        padding: '10px 20px',
        borderRadius: 10,
        border: `1px solid ${theme.border}`,
        background: 'transparent',
        color: theme.textSub,
        cursor: 'pointer',
        fontFamily: 'DM Sans, sans-serif',
        fontSize: 14,
        fontWeight: 500,
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        transition: 'all 0.18s ease'
      }}
    >
      <span>{icon}</span> {label}
    </button>
  )
}

export default Overview
