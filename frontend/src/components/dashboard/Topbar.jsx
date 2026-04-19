import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

function Topbar () {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  return (
    <div className='w-full flex items-center justify-between'>
      {/* LEFT */}
      <div>
        <p className='text-xs text-gray-500'>Welcome back</p>
        <h3 className='text-sm font-medium text-white'>
          {user?.username || 'User'}
        </h3>
      </div>

      {/* RIGHT */}
      <div className='flex items-center gap-4'>
        {/* User badge */}
        <div className='px-3 py-1 text-xs rounded-md bg-[#1A1A1A] border border-[#2A2A2A] text-gray-300'>
          {user?.role || 'user'}
        </div>

        {/* Logout */}
        <button
          onClick={() => {
            logout()
            navigate('/login')
          }}
          className='px-4 py-2 text-sm bg-amber-600 hover:bg-amber-500 rounded-md transition font-medium'
        >
          Logout
        </button>
      </div>
    </div>
  )
}

export default Topbar
