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

  if (loading) return <h2>Loading dashboard...</h2>

  return (
    // 🔥 CHANGED: added background + full height
    <div style={{ padding: '20px', background: '#f5f7fb', minHeight: '100vh' }}>
      <h1 style={{ marginBottom: '20px' }}>Dashboard</h1>

      {/* 🔥 CHANGED: grid layout instead of flex */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
          gap: '15px'
        }}
      >
        <StatCard title='Total Solved' value={stats.totalSolved || 0} />
        <StatCard title='Submissions' value={stats.totalSubmissions || 0} />
        <StatCard title='Easy' value={stats.easy || 0} />
        <StatCard title='Medium' value={stats.medium || 0} />
        <StatCard title='Hard' value={stats.hard || 0} />
      </div>

      {/* 🔥 CHANGED: wrapped in SectionCard */}
      <div style={{ marginTop: '30px' }}>
        <SectionCard title='Daily Activity'>
          <ActivityHeatmap data={activityData} />
        </SectionCard>
      </div>

      {/* 🔥 CHANGED: better card UI */}
      <div style={{ marginTop: '30px' }}>
        <SectionCard title='Recent Activity'>
          {recent.length === 0 ? (
            <p>No activity yet</p>
          ) : (
            recent.map(item => (
              <div
                key={item._id}
                onClick={() =>
                  navigate(`/dashboard/practice/${item.problem.slug}`)
                }
                style={{
                  padding: '10px',
                  borderBottom: '1px solid #eee',
                  display: 'flex',
                  justifyContent: 'space-between',
                  cursor: 'pointer'
                }}
              >
                <span>{item.problem?.title}</span>
                <span
                  style={{
                    color: item.status === 'solved' ? 'green' : 'orange',
                    fontWeight: 'bold'
                  }}
                >
                  {item.status}
                </span>
              </div>
            ))
          )}
        </SectionCard>
      </div>

      {/* 🔥 CHANGED: wrapped in SectionCard */}
      <div style={{ marginTop: '30px' }}>
        <SectionCard title='Quick Actions'>
          <div style={{ display: 'flex', gap: '10px' }}>
            <ActionButton
              label='Practice'
              onClick={() => navigate('/dashboard/practice')}
            />
            <ActionButton
              label='Battle'
              onClick={() => navigate('/dashboard/battle')}
            />
            <ActionButton
              label='Leaderboard'
              onClick={() => navigate('/dashboard/leaderboard')}
            />
          </div>
        </SectionCard>
      </div>
    </div>
  )
}

/* 🔹 UPDATED StatCard (modern look) */
function StatCard ({ title, value }) {
  return (
    <div
      style={{
        background: '#fff', // 🔥 CHANGED
        padding: '20px',
        borderRadius: '12px', // 🔥 CHANGED
        boxShadow: '0 2px 8px rgba(0,0,0,0.05)', // 🔥 CHANGED
        textAlign: 'center'
      }}
    >
      <p style={{ color: '#888', marginBottom: '5px' }}>{title}</p>{' '}
      {/* 🔥 CHANGED */}
      <h2>{value}</h2>
    </div>
  )
}
{
  /* 🔥 NEW: Streak Card */
}
;<div style={{ marginTop: '20px' }}>
  <SectionCard title='🔥 Streak'>
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}
    >
      <div>
        <h2 style={{ margin: 0 }}>{getStreak} days</h2>
        <p style={{ color: '#888' }}>
          {getStreak === 0 ? 'Start your streak today 🚀' : 'Keep it going!'}
        </p>
      </div>

      <div style={{ fontSize: '40px' }}>🔥</div>
    </div>
  </SectionCard>
</div>

/* 🔥 NEW COMPONENT: SectionCard */
function SectionCard ({ title, children }) {
  return (
    <div
      style={{
        background: '#fff',
        padding: '20px',
        borderRadius: '12px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
      }}
    >
      <h3 style={{ marginBottom: '15px' }}>{title}</h3>
      {children}
    </div>
  )
}

/* 🔹 UPDATED Button */
function ActionButton ({ label, onClick }) {
  return (
    <button
      onClick={onClick}
      style={{
        padding: '10px 16px', // 🔥 CHANGED
        borderRadius: '8px', // 🔥 CHANGED
        border: 'none',
        background: '#111',
        color: '#fff',
        cursor: 'pointer'
      }}
    >
      {label}
    </button>
  )
}

export default Overview
