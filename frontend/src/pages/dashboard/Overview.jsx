import { problems } from '../dashboard/practice/problems'
import { useNavigate } from 'react-router-dom'
import ActivityHeatmap from '../../components/ActivityHeatmap'
import { activityData } from '../../data/activityData'

function Overview () {
  const navigate = useNavigate()

  const total = problems.length

  const easy = problems.filter(p => p.difficulty === 'Easy').length
  const medium = problems.filter(p => p.difficulty === 'Medium').length
  const hard = problems.filter(p => p.difficulty === 'Hard').length

  const solved = 1 // temp

  const activities = [
    { id: 1, title: 'Solved Two Sum', status: 'Solved' },
    { id: 2, title: 'Attempted Binary Search', status: 'Attempted' },
    { id: 3, title: 'Solved Palindrome', status: 'Solved' }
  ]

  return (
    <div style={{ padding: '20px' }}>
      <h1>Dashboard</h1>

      {/* 📊 Stats */}
      <div
        style={{
          display: 'flex',
          gap: '20px',
          marginTop: '20px',
          flexWrap: 'wrap'
        }}
      >
        <StatCard title='Total' value={total} />
        <StatCard title='Solved' value={solved} />
        <StatCard title='Easy' value={easy} />
        <StatCard title='Medium' value={medium} />
        <StatCard title='Hard' value={hard} />
      </div>

      {/* 🔥 Activity Heatmap */}
      <div style={{ marginTop: '30px' }}>
        <h3>Daily Activity</h3>
        <ActivityHeatmap data={activityData} />
      </div>

      {/* 📜 Recent Activity */}
      <div style={{ marginTop: '30px' }}>
        <h3>Recent Activity</h3>

        <div style={{ marginTop: '10px' }}>
          {activities.map(item => (
            <div
              key={item.id}
              style={{
                padding: '10px',
                border: '1px solid #eee',
                borderRadius: '8px',
                marginBottom: '10px',
                background: '#fff',
                display: 'flex',
                justifyContent: 'space-between'
              }}
            >
              <span>{item.title}</span>

              <span
                style={{
                  color: item.status === 'Solved' ? 'green' : 'orange',
                  fontWeight: 'bold'
                }}
              >
                {item.status}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* 🚀 Quick Actions */}
      <div style={{ marginTop: '30px' }}>
        <h3>Quick Actions</h3>

        <div
          style={{
            display: 'flex',
            gap: '15px',
            marginTop: '10px',
            flexWrap: 'wrap'
          }}
        >
          <ActionButton
            label='🚀 Practice'
            onClick={() => navigate('/dashboard/practice')}
          />

          <ActionButton
            label='⚔️ Battle'
            onClick={() => navigate('/dashboard/battle')}
          />

          <ActionButton
            label='📊 Leaderboard'
            onClick={() => navigate('/dashboard/leaderboard')}
          />
        </div>
      </div>
    </div>
  )
}

/* 🔹 Stat Card */
function StatCard ({ title, value }) {
  return (
    <div
      style={{
        border: '1px solid #eee',
        padding: '20px',
        borderRadius: '10px',
        minWidth: '150px',
        textAlign: 'center',
        background: '#fff'
      }}
    >
      <h3 style={{ margin: 0 }}>{title}</h3>
      <p style={{ fontSize: '24px', marginTop: '10px' }}>{value}</p>
    </div>
  )
}

/* 🔹 Action Button */
function ActionButton ({ label, onClick }) {
  return (
    <button
      onClick={onClick}
      style={{
        padding: '10px 16px',
        borderRadius: '8px',
        border: 'none',
        background: '#111',
        color: '#fff',
        cursor: 'pointer',
        fontSize: '14px'
      }}
    >
      {label}
    </button>
  )
}

export default Overview
