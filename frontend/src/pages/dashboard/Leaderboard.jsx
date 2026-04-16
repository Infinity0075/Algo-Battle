import { useEffect, useState } from 'react'
import { getLeaderboard } from '../../services/userService'

function Leaderboard () {
  const [users, setUsers] = useState([])

  useEffect(() => {
    const fetch = async () => {
      const data = await getLeaderboard()
      setUsers(data)
    }

    fetch()
  }, [])

  return (
    <div style={{ padding: '20px' }}>
      <h1>🏆 Leaderboard</h1>

      {users.map((u, i) => (
        <div
          key={i}
          style={{
            padding: '10px',
            borderBottom: '1px solid #eee',
            display: 'flex',
            justifyContent: 'space-between'
          }}
        >
          <span>
            #{i + 1} {u.username}
          </span>
          <span style={{ fontWeight: 'bold' }}>
            {u.solved} solved • {u.rating} ⭐
          </span>{' '}
        </div>
      ))}
    </div>
  )
}

export default Leaderboard
