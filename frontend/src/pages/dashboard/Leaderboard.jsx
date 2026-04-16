import { useEffect, useState } from 'react'
import { getLeaderboard } from '../../services/userService'
import { useNavigate } from 'react-router-dom'

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
      } catch (err) {
        setError('Failed to load leaderboard')
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  if (loading) return <div className='p-6 text-center'>Loading...</div>
  if (error) return <div className='p-6 text-red-500'>{error}</div>

  return (
    <div className='p-6 max-w-3xl mx-auto'>
      <h1 className='text-2xl font-bold mb-6'>🏆 Leaderboard</h1>

      <div className='bg-white shadow rounded-xl divide-y'>
        {users.map((u, i) => (
          <div
            key={u.username}
            onClick={() => navigate(`/dashboard/profile/${u.username}`)}
            className='flex justify-between items-center p-4 hover:bg-gray-50 cursor-pointer transition'
          >
            <span className='font-medium'>
              #{i + 1} {u.username}
            </span>

            <span className='text-sm text-gray-600'>
              {u.solved} solved •{' '}
              <span className='font-semibold text-black'>{u.rating} ⭐</span>
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Leaderboard
