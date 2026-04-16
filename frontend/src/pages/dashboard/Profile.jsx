import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { getUserProfile } from '../../services/userService'

function Profile () {
  const { username } = useParams()

  const [data, setData] = useState(null)

  useEffect(() => {
    const fetch = async () => {
      const res = await getUserProfile(username)
      setData(res)
    }

    fetch()
  }, [username])

  if (!data) return <h2>Loading...</h2>

  return (
    <div style={{ padding: '20px', background: '#f5f7fb', minHeight: '100vh' }}>
      <h1>👤 {data.username}</h1>

      {/* 🔥 Info Card */}
      <div
        style={{
          marginTop: '20px',
          background: '#fff',
          padding: '20px',
          borderRadius: '12px'
        }}
      >
        <p>
          <strong>Email:</strong> {data.email}
        </p>
      </div>

      {/* 🔥 Stats */}
      <div
        style={{
          marginTop: '20px',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
          gap: '10px'
        }}
      >
        <StatCard title='Solved' value={data.totalSolved} />
        <StatCard title='Submissions' value={data.totalSubmissions} />
      </div>

      {/* 🔥 Recent */}
      <div style={{ marginTop: '20px' }}>
        <div
          style={{
            background: '#fff',
            padding: '20px',
            borderRadius: '12px'
          }}
        >
          <h3>Recent Activity</h3>

          {data.recent.length === 0 ? (
            <p>No activity</p>
          ) : (
            data.recent.map(item => (
              <div
                key={item._id}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  borderBottom: '1px solid #eee',
                  padding: '8px 0'
                }}
              >
                <span>{item.problemId}</span>
                <span>{item.status}</span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}

function StatCard ({ title, value }) {
  return (
    <div
      style={{
        background: '#fff',
        padding: '15px',
        borderRadius: '10px',
        textAlign: 'center'
      }}
    >
      <p style={{ color: '#888' }}>{title}</p>
      <h3>{value}</h3>
    </div>
  )
}

export default Profile
