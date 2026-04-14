import { useState } from 'react'
import { register } from '../services/authService'
import { useNavigate } from 'react-router-dom'

const Register = () => {
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  const navigate = useNavigate()

  const handleSubmit = async e => {
    e.preventDefault()

    if (!username || !email || !password) {
      alert('Please fill all fields')
      return
    }

    setLoading(true)

    try {
      const data = await register({
        username: username.trim(),
        email: email.trim(),
        password: password.trim()
      })

      localStorage.setItem('token', data.token)
      navigate('/dashboard')
    } catch (error) {
      console.error(error)
      alert(error.response?.data?.message || 'Registration failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ padding: '50px' }}>
      <h2>Register</h2>

      <form onSubmit={handleSubmit}>
        <input
          type='text'
          placeholder='Enter username'
          value={username}
          onChange={e => setUsername(e.target.value)}
        />
        <br />
        <br />

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
          {loading ? 'Registering...' : 'Register'}
        </button>
      </form>

      <p>
        Already have an account? <a href='/login'>Login</a>
      </p>
    </div>
  )
}

export default Register
