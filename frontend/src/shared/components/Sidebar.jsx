import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

function Sidebar () {
  const location = useLocation()
  const { user } = useAuth()

  const menu = [
    { name: 'Dashboard', path: '/dashboard', icon: '🏠' },
    { name: 'Practice', path: '/dashboard/practice', icon: '📘' },
    { name: 'Battle', path: '/dashboard/battle', icon: '⚔️' },
    { name: 'Leaderboard', path: '/dashboard/leaderboard', icon: '🏆' },
    { name: 'Profile', path: '/dashboard/profile', icon: '👤' }
  ]

  const adminMenu = [
    { name: 'Add Problem', path: '/dashboard/admin/add-problem', icon: '➕' },
    {
      name: 'Manage Problems',
      path: '/dashboard/admin/manage-problems',
      icon: '🛠️'
    }
  ]

  return (
    <div className='h-full flex flex-col bg-[#0b0b12] text-white px-4 py-6 w-64 border-r border-[#1a1a2e]'>
      {/* LOGO */}
      <div className='mb-8'>
        <h2 className='text-xl font-bold text-amber-500 tracking-wide'>
          AlgoBattle
        </h2>
        <p className='text-xs text-gray-500'>Code. Compete. Win.</p>
      </div>

      {/* MAIN MENU */}
      <div className='flex flex-col gap-1'>
        {menu.map(item => {
          const isActive =
            location.pathname === item.path ||
            location.pathname.startsWith(item.path + '/')

          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm transition ${
                isActive
                  ? 'bg-[#1a1a2e] text-amber-400 font-medium'
                  : 'text-gray-400 hover:bg-[#151528] hover:text-white'
              }`}
            >
              <span className='text-base'>{item.icon}</span>
              {item.name}
            </Link>
          )
        })}
      </div>

      {/* 🔥 ADMIN SECTION */}
      {user?.role === 'admin' && (
        <div className='mt-6'>
          <p className='text-xs text-gray-500 uppercase mb-2 px-2'>Admin</p>

          <div className='flex flex-col gap-1'>
            {adminMenu.map(item => {
              const isActive =
                location.pathname === item.path ||
                location.pathname.startsWith(item.path + '/')

              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm transition ${
                    isActive
                      ? 'bg-[#1a1a2e] text-amber-400 font-medium'
                      : 'text-gray-400 hover:bg-[#151528] hover:text-white'
                  }`}
                >
                  <span>{item.icon}</span>
                  {item.name}
                </Link>
              )
            })}
          </div>
        </div>
      )}

      {/* FOOTER */}
      <div className='mt-auto pt-6 border-t border-[#1a1a2e] text-xs text-gray-500'>
        <p>v1.0 AlgoBattle</p>
        <p className='mt-1'>Built for coders 🚀</p>
      </div>
    </div>
  )
}

export default Sidebar
