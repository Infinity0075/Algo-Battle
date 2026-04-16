import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { getUserProfile } from '../../services/userService'

function Profile () {
  const { username } = useParams()
  const { user } = useAuth()

  // ✅ FIX: auto fallback to logged-in user
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

  // ✅ FIX: proper states
  if (!finalUsername) return <h2>Loading...</h2>
  if (!data) return <h2>User not found</h2>

  return (
    <div style={{ padding: '20px', background: '#f5f7fb', minHeight: '100vh' }}>
      <h1>👤 {data.username}</h1>
      <p>
        <strong>Rating:</strong> ⭐ {data.rating}
      </p>
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
                <span>
                  {item.problemId} {item.status === 'solved' ? '✅' : '⏳'}
                </span>
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
