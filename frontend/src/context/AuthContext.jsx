import { createContext, useContext, useEffect, useState } from 'react'
import { getMe } from '../services/authService'

const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

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

        // ✅ ensure required fields exist
        setUser({
          _id: data._id,
          username: data.username,
          role: data.role || 'user',
          token
        })
      } catch (err) {
        console.error('Auth error:', err)
        setUser(null)
      } finally {
        setLoading(false)
      }
    }

    fetchUser()
  }, [])

  const logout = () => {
    localStorage.removeItem('token')
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, setUser, loading, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
