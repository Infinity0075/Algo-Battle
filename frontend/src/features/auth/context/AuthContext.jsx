import { useEffect, useState } from 'react'
import { getMe } from '../services/authService'
import AuthContext from './AuthContextCore'

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  // 🔥 LOAD USER
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem('token')

        if (!token) {
          setUser(null)
          setLoading(false)
          return
        }

        const data = await getMe()

        // 🔧 FIX: backend returns { id, username, role }
        setUser({
          id: data.id, // 🔧 FIXED (_id ❌ → id ✅)
          username: data.username,
          role: data.role,
          token
        })
      } catch (err) {
        console.error('Auth error:', err.message)

        // 🔧 FIX: clear invalid token
        localStorage.removeItem('token')
        localStorage.removeItem('user')

        setUser(null)
      } finally {
        setLoading(false)
      }
    }

    fetchUser()
  }, [])

  // 🔥 LOGIN HELPER (ADD THIS)
  const login = data => {
    localStorage.setItem('token', data.token)

    setUser({
      id: data.user.id,
      username: data.user.username,
      role: data.user.role,
      token: data.token
    })
  }

  // 🔥 LOGOUT
  const logout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')

    setUser(null)

    window.location.href = '/login' // 🔧 redirect
  }

  return (
    <AuthContext.Provider value={{ user, setUser, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}
