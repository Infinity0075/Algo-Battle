import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

function Topbar () {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <div className='w-full flex items-center justify-between px-4 py-3 border-b border-[#1a1a2e] bg-[#0b0b12]'>
      {/* LEFT */}
      <div>
        <p className='text-xs text-gray-500'>Welcome back</p>
        <h3 className='text-sm font-semibold text-white'>
          {user?.username || 'User'}
        </h3>
      </div>

      {/* RIGHT */}
      <div className='flex items-center gap-3'>
        {/* ROLE BADGE */}
        <span className='px-3 py-1 text-xs rounded-full bg-[#151528] border border-[#1a1a2e] text-amber-400 capitalize'>
          {user?.role || 'user'}
        </span>

        {/* PROFILE QUICK ACCESS */}
        <button
          onClick={() => navigate('/dashboard/profile')}
          className='px-3 py-1 text-xs rounded-md border border-[#1a1a2e] text-gray-400 hover:bg-[#151528] hover:text-white transition'
        >
          Profile
        </button>

        {/* LOGOUT */}
        <button
          onClick={handleLogout}
          className='px-4 py-1.5 text-sm bg-amber-600 hover:bg-amber-500 rounded-md transition font-medium'
        >
          Logout
        </button>
      </div>
    </div>
  )
}

export default Topbar
