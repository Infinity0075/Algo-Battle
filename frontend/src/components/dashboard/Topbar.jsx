import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

function Topbar () {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  return (
    <div className='h-14 bg-white border-b flex items-center justify-between px-6'>
      <h3 className='font-semibold text-lg'>
        Welcome, {user?.username || 'User'}
      </h3>

      <button
        onClick={() => {
          logout()
          navigate('/login')
        }}
        className='px-4 py-1.5 bg-black text-white rounded-lg text-sm hover:bg-gray-800'
      >
        Logout
      </button>
    </div>
  )
}

export default Topbar
