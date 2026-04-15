import { useAuth } from '../../context/AuthContext'

function Topbar () {
  const { user, logout } = useAuth()

  return (
    <div
      style={{
        height: '60px',
        background: '#fff',
        borderBottom: '1px solid #eee',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '0 20px'
      }}
    >
      <h3>Welcome, {user?.name || 'User'}</h3>

      <button onClick={logout}>Logout</button>
    </div>
  )
}

export default Topbar
