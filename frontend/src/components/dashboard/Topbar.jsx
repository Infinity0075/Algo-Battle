import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

function Topbar () {
  const navigate = useNavigate()
  const { logout } = useAuth()
  const { user } = useAuth()

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        padding: '15px',
        borderBottom: '1px solid #eee'
      }}
    >
      <h3>Welcome, {user?.username}</h3>
      <button
        onClick={() => {
          logout() // ✅ clear user + token
          navigate('/login') // ✅ redirect
        }}
        style={{
          background: 'transparent',
          border: 'none',
          cursor: 'pointer'
        }}
      >
        Logout
      </button>
    </div>
  )
}

export default Topbar
