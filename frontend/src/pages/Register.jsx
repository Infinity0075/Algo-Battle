import { useState } from 'react'
import { register } from '../services/authService'
import { useNavigate } from 'react-router-dom'

const Register = () => {
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleSubmit = e => {
    e.preventDefault()
    console.log(username, email, password)
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

        <button type='submit'>Register</button>
      </form>
    </div>
  )
}

export default Register
