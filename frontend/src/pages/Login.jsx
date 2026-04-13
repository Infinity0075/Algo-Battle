import { useState } from 'react'

const Login = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleSubmit = e => {
    e.preventDefault()
    console.log(email, password)
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

        <button type='submit'>Login</button>
      </form>
    </div>
  )
}

export default Login
