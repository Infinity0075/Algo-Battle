import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

function Sidebar () {
  const location = useLocation()
  const { user } = useAuth()

  // 🔹 Base menu
  const menu = [
    { name: 'Dashboard', path: '/dashboard' },
    { name: 'Practice', path: '/dashboard/practice' },
    { name: 'Battle', path: '/dashboard/battle' },
    { name: 'Leaderboard', path: '/dashboard/leaderboard' },
    { name: 'Profile', path: '/dashboard/profile' }
  ]

  // 🔥 Add admin menu ONLY if admin
  if (user?.role === 'admin') {
    menu.push({
      name: 'Add Problem',
      path: '/dashboard/admin/add-problem'
    })

    menu.push({
      name: 'Manage Problems',
      path: '/dashboard/admin/manage-problems'
    })
  }
  return (
    <div className='w-56 bg-black text-white p-5 flex flex-col'>
      {/* Logo */}
      <h2 className='text-xl font-bold mb-8 tracking-wide'>AlgoBattle</h2>

      {/* Menu */}
      <div className='flex flex-col gap-1'>
        {menu.map(item => {
          const isActive =
            location.pathname === item.path ||
            location.pathname.startsWith(item.path + '/')

          return (
            <Link
              key={item.path}
              to={item.path}
              className={`px-3 py-2 rounded-lg text-sm transition ${
                isActive
                  ? 'bg-white text-black font-medium'
                  : 'text-gray-400 hover:bg-gray-800 hover:text-white'
              }`}
            >
              {item.name}
            </Link>
          )
        })}
      </div>

      {/* Footer (optional polish) */}
      <div className='mt-auto pt-6 text-xs text-gray-500'>v1.0 AlgoBattle</div>
    </div>
  )
}

export default Sidebar
