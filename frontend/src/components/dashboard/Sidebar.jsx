import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

function Sidebar () {
  const location = useLocation()
  const { user } = useAuth()

  const menu = [
    { name: 'Dashboard', path: '/dashboard' },
    { name: 'Practice', path: '/dashboard/practice' },
    { name: 'Battle', path: '/dashboard/battle' },
    { name: 'Leaderboard', path: '/dashboard/leaderboard' },
    { name: 'Profile', path: '/dashboard/profile' }
  ]

  if (user?.role === 'admin') {
    menu.push({ name: 'Add Problem', path: '/dashboard/admin/add-problem' })
    menu.push({
      name: 'Manage Problems',
      path: '/dashboard/admin/manage-problems'
    })
  }

  return (
    <div className='h-full flex flex-col bg-[#1A1A1A] text-white px-5 py-6'>
      {/* LOGO */}
      <h2 className='text-lg font-semibold tracking-wide text-amber-500 mb-10'>
        AlgoBattle
      </h2>

      {/* MENU */}
      <div className='flex flex-col gap-1'>
        {menu.map(item => {
          const isActive =
            location.pathname === item.path ||
            location.pathname.startsWith(item.path + '/')

          return (
            <Link
              key={item.path}
              to={item.path}
              className={`px-4 py-2 rounded-md text-sm transition flex items-center ${
                isActive
                  ? 'bg-[#2A2A2A] text-amber-500 font-medium'
                  : 'text-gray-400 hover:bg-[#222222] hover:text-white'
              }`}
            >
              {item.name}
            </Link>
          )
        })}
      </div>

      {/* FOOTER */}
      <div className='mt-auto pt-6 border-t border-[#2A2A2A] text-xs text-gray-500'>
        v1.0 AlgoBattle
      </div>
    </div>
  )
}

export default Sidebar
