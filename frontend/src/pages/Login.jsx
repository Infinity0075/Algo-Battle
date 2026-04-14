import { useState } from 'react'
import { login } from '../services/authService'
import { useNavigate } from 'react-router-dom'

const Login = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  const navigate = useNavigate()

  const handleSubmit = async e => {
    e.preventDefault()

    if (!email || !password) {
      alert('Please fill all fields')
      return
    }

    setLoading(true)

    try {
      const data = await login({
        email: email.trim(),
        password: password.trim()
      })

      localStorage.setItem('token', data.token)
      navigate('/dashboard')
    } catch (error) {
      console.error(error)
      alert(error.response?.data?.message || 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ padding: '50px' }}>
      <h2>Login</h2>

      <form onSubmit={handleSubmit}>
        <input
          type='email'
          placeholder='Enter email'
          value={email}
          onChange={e => setEmail(e.target.value)}
        />
        <br />
        <br />

        <input
          type='password'
          placeholder='Enter password'
          value={password}
          onChange={e => setPassword(e.target.value)}
        />
        <br />
        <br />

        <button type='submit' disabled={loading}>
          {loading ? 'Logging in...' : 'Login'}
        </button>
      </form>

      <p>
        Don’t have an account? <a href='/register'>Register</a>
      </p>
    </div>
  )
}

export default Login
