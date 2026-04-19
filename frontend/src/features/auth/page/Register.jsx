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

  const styles = {
    page: {
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: '#0a0a0f',
      fontFamily: "'Segoe UI', system-ui, sans-serif",
      padding: '1rem'
    },
    card: {
      width: '100%',
      maxWidth: '420px',
      background: '#0f0f13',
      border: '1px solid #2a2a35',
      borderRadius: '16px',
      overflow: 'hidden'
    },
    cardHeader: {
      padding: '2rem 2rem 1.5rem',
      borderBottom: '1px solid #1a1a24'
    },
    logo: {
      display: 'flex',
      alignItems: 'center',
      gap: '10px',
      marginBottom: '1.5rem'
    },
    logoMark: {
      width: '34px',
      height: '34px',
      background: 'linear-gradient(135deg, #f0a500, #e06b00)',
      borderRadius: '8px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    },
    logoText: {
      fontSize: '16px',
      fontWeight: '700',
      color: '#fff',
      letterSpacing: '-0.3px'
    },
    heading: {
      fontSize: '22px',
      fontWeight: '700',
      color: '#fff',
      margin: '0 0 4px 0',
      letterSpacing: '-0.5px'
    },
    subHeading: {
      fontSize: '14px',
      color: '#666',
      margin: 0
    },
    cardBody: {
      padding: '1.8rem 2rem 2rem'
    },
    fieldWrap: {
      marginBottom: '1rem'
    },
    label: {
      display: 'block',
      fontSize: '12px',
      fontWeight: '600',
      color: '#888',
      letterSpacing: '0.6px',
      textTransform: 'uppercase',
      marginBottom: '6px'
    },
    input: {
      width: '100%',
      boxSizing: 'border-box',
      padding: '12px 14px',
      background: '#1a1a24',
      border: '1px solid #2a2a35',
      borderRadius: '10px',
      color: '#fff',
      fontSize: '14px',
      outline: 'none',
      fontFamily: 'inherit',
      transition: 'border-color 0.2s'
    },
    submitBtn: {
      width: '100%',
      padding: '13px',
      background: '#f0a500',
      border: 'none',
      borderRadius: '10px',
      color: '#0f0f13',
      fontSize: '15px',
      fontWeight: '700',
      cursor: loading ? 'not-allowed' : 'pointer',
      marginTop: '0.4rem',
      letterSpacing: '0.2px',
      fontFamily: 'inherit',
      opacity: loading ? 0.75 : 1,
      transition: 'all 0.2s'
    },
    divider: {
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      margin: '1.2rem 0'
    },
    dividerLine: {
      flex: 1,
      height: '1px',
      background: '#2a2a35'
    },
    dividerText: {
      fontSize: '12px',
      color: '#555'
    },
    googleBtn: {
      width: '100%',
      padding: '11px',
      background: 'transparent',
      border: '1px solid #2a2a35',
      borderRadius: '10px',
      color: '#ccc',
      fontSize: '13px',
      fontWeight: '500',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '8px',
      fontFamily: 'inherit',
      transition: 'all 0.2s'
    },
    agreeText: {
      fontSize: '12px',
      color: '#555',
      marginTop: '1rem',
      textAlign: 'center',
      lineHeight: '1.6'
    },
    agreeLink: {
      color: '#f0a500',
      textDecoration: 'none'
    },
    cardFooter: {
      padding: '1rem 2rem 1.5rem',
      borderTop: '1px solid #1a1a24',
      textAlign: 'center'
    },
    footerText: {
      fontSize: '13px',
      color: '#666',
      margin: 0
    },
    footerLink: {
      color: '#f0a500',
      textDecoration: 'none',
      fontWeight: '600'
    }
  }

  const focusStyle = e => {
    e.target.style.borderColor = '#f0a500'
    e.target.style.background = '#1e1e28'
  }

  const blurStyle = e => {
    e.target.style.borderColor = '#2a2a35'
    e.target.style.background = '#1a1a24'
  }

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        {/* Header */}
        <div style={styles.cardHeader}>
          <div style={styles.logo}>
            <div style={styles.logoMark}>
              <svg
                width='18'
                height='18'
                viewBox='0 0 24 24'
                fill='none'
                stroke='#fff'
                strokeWidth='2.5'
                strokeLinecap='round'
                strokeLinejoin='round'
              >
                <polygon points='12 2 2 7 12 12 22 7 12 2' />
                <polyline points='2 17 12 22 22 17' />
                <polyline points='2 12 12 17 22 12' />
              </svg>
            </div>
            <span style={styles.logoText}>YourApp</span>
          </div>
          <h2 style={styles.heading}>Create your account</h2>
          <p style={styles.subHeading}>
            Join us today — it only takes a minute
          </p>
        </div>

        {/* Form */}
        <div style={styles.cardBody}>
          <form onSubmit={handleSubmit}>
            {/* Username */}
            <div style={styles.fieldWrap}>
              <label style={styles.label}>Username</label>
              <input
                type='text'
                placeholder='e.g. alex_smith'
                value={username}
                onChange={e => setUsername(e.target.value)}
                style={styles.input}
                onFocus={focusStyle}
                onBlur={blurStyle}
              />
            </div>

            {/* Email */}
            <div style={styles.fieldWrap}>
              <label style={styles.label}>Email</label>
              <input
                type='email'
                placeholder='you@example.com'
                value={email}
                onChange={e => setEmail(e.target.value)}
                style={styles.input}
                onFocus={focusStyle}
                onBlur={blurStyle}
              />
            </div>

            {/* Password */}
            <div style={styles.fieldWrap}>
              <label style={styles.label}>Password</label>
              <input
                type='password'
                placeholder='Min. 8 characters'
                value={password}
                onChange={e => setPassword(e.target.value)}
                style={styles.input}
                onFocus={focusStyle}
                onBlur={blurStyle}
              />
            </div>

            {/* Submit */}
            <button
              type='submit'
              disabled={loading}
              style={styles.submitBtn}
              onMouseEnter={e => {
                if (!loading) e.target.style.background = '#e09800'
              }}
              onMouseLeave={e => {
                if (!loading) e.target.style.background = '#f0a500'
              }}
            >
              {loading ? 'Creating account...' : 'Create account'}
            </button>
          </form>

          {/* Divider */}
          <div style={styles.divider}>
            <div style={styles.dividerLine} />
            <span style={styles.dividerText}>or sign up with</span>
            <div style={styles.dividerLine} />
          </div>

          {/* Google Button */}
          <button
            style={styles.googleBtn}
            onMouseEnter={e => {
              e.currentTarget.style.borderColor = '#555'
              e.currentTarget.style.background = '#1a1a24'
              e.currentTarget.style.color = '#fff'
            }}
            onMouseLeave={e => {
              e.currentTarget.style.borderColor = '#2a2a35'
              e.currentTarget.style.background = 'transparent'
              e.currentTarget.style.color = '#ccc'
            }}
          >
            <svg width='18' height='18' viewBox='0 0 24 24' fill='none'>
              <path
                d='M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z'
                fill='#4285F4'
              />
              <path
                d='M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z'
                fill='#34A853'
              />
              <path
                d='M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z'
                fill='#FBBC05'
              />
              <path
                d='M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z'
                fill='#EA4335'
              />
            </svg>
            Continue with Google
          </button>

          {/* Terms */}
          <p style={styles.agreeText}>
            By creating an account, you agree to our{' '}
            <a href='/terms' style={styles.agreeLink}>
              Terms of Service
            </a>{' '}
            and{' '}
            <a href='/privacy' style={styles.agreeLink}>
              Privacy Policy
            </a>
            .
          </p>
        </div>

        {/* Footer */}
        <div style={styles.cardFooter}>
          <p style={styles.footerText}>
            Already have an account?{' '}
            <a href='/login' style={styles.footerLink}>
              Sign in
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}

export default Register
