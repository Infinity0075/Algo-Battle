import { Link, useLocation } from 'react-router-dom'

function Sidebar () {
  const location = useLocation()

  const menu = [
    { name: 'Dashboard', path: '/dashboard' },
    { name: 'Practice', path: '/dashboard/practice' },
    { name: 'Battle', path: '/dashboard/battle' },
    { name: 'Leaderboard', path: '/dashboard/leaderboard' },
    { name: 'Profile', path: '/dashboard/profile' }
  ]

  return (
    <div
      style={{
        width: '220px',
        background: '#111',
        color: '#fff',
        padding: '20px'
      }}
    >
      <h2>AlgoBattle</h2>

      <div style={{ marginTop: '20px' }}>
        {menu.map(item => (
          <Link
            key={item.path}
            to={item.path}
            style={{
              display: 'block',
              padding: '10px',
              marginBottom: '5px',
              textDecoration: 'none',
              color: location.pathname === item.path ? '#000' : '#fff',
              background:
                location.pathname === item.path ? '#fff' : 'transparent',
              borderRadius: '6px'
            }}
          >
            {item.name}
          </Link>
        ))}
      </div>
    </div>
  )
}

export default Sidebar
