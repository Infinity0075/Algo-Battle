import { useState } from 'react'
import { login } from '../services/authService'
import { useNavigate } from 'react-router-dom'

const Login = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const navigate = useNavigate()

  const handleSubmit = async e => {
    e.preventDefault()

    if (!email || !password) {
      setError('Please fill all fields')
      return
    }

    setLoading(true)
    setError('')

    try {
      const data = await login({
        email: email.trim(),
        password: password.trim()
      })

      localStorage.setItem('token', data.token)
      navigate('/dashboard')
    } catch (error) {
      console.log('error', error)
      setError(error.response?.data?.message || 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className='min-h-screen flex items-center justify-center bg-black px-4'>
      <div className='w-full max-w-md bg-[#0f0f13] border border-gray-800 rounded-2xl shadow-lg'>
        {/* Header */}
        <div className='p-6 border-b border-gray-800'>
          <div className='flex items-center gap-3 mb-4'>
            <div className='w-9 h-9 bg-linear-to-br from-yellow-400 to-orange-500 rounded-lg flex items-center justify-center'>
              <span className='text-black font-bold'>A</span>
            </div>
            <span className='text-white font-bold text-lg'>AlgoBattle</span>
          </div>

          <h2 className='text-xl font-bold text-white'>Welcome back</h2>
          <p className='text-gray-500 text-sm'>Sign in to your account</p>
        </div>

        {/* Body */}
        <div className='p-6 space-y-4'>
          <form onSubmit={handleSubmit} className='space-y-4'>
            {error && <div className='text-red-500 text-sm'>{error}</div>}

            {/* Email */}
            <div>
              <label className='text-xs text-gray-400 uppercase font-semibold'>
                Email
              </label>
              <input
                type='email'
                placeholder='you@example.com'
                value={email}
                onChange={e => setEmail(e.target.value)}
                className='w-full mt-1 p-3 rounded-lg bg-[#1a1a24] border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-yellow-500'
              />
            </div>

            {/* Password */}
            <div>
              <div className='flex justify-between items-center'>
                <label className='text-xs text-gray-400 uppercase font-semibold'>
                  Password
                </label>
                <span className='text-xs text-yellow-400 cursor-pointer hover:underline'>
                  Forgot?
                </span>
              </div>

              <input
                type='password'
                placeholder='••••••••'
                value={password}
                onChange={e => setPassword(e.target.value)}
                className='w-full mt-1 p-3 rounded-lg bg-[#1a1a24] border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-yellow-500'
              />
            </div>

            {/* Submit */}
            <button
              disabled={loading}
              className='w-full py-3 bg-yellow-500 text-black font-semibold rounded-lg hover:bg-yellow-400 transition disabled:opacity-50'
            >
              {loading ? 'Signing in...' : 'Sign in'}
            </button>
          </form>

          {/* Divider */}
          <div className='flex items-center gap-2 text-gray-600 text-xs'>
            <div className='flex-1 h-px bg-gray-700'></div>
            <span>or continue with</span>
            <div className='flex-1 h-px bg-gray-700'></div>
          </div>

          {/* Google Button */}
          <button className='w-full py-2 border border-gray-700 rounded-lg text-gray-300 hover:bg-gray-800 transition'>
            Continue with Google
          </button>
        </div>

        {/* Footer */}
        <div className='p-4 border-t border-gray-800 text-center text-sm text-gray-500'>
          Don’t have an account?{' '}
          <a href='/register' className='text-yellow-400 hover:underline'>
            Create one
          </a>
        </div>
      </div>
    </div>
  )
}

export default Login
