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

        // 🔥 if no token → just stop loading
        if (!token) {
          setUser(null)
          setLoading(false)
          return
        }

        const data = await getMe()

        // 🔥 attach token manually (VERY IMPORTANT)
        setUser({
          ...data,
          token
        })
      } catch (error) {
        console.error(error)
        setUser(null)
      } finally {
        setLoading(false)
      }
    }

    fetchUser()
  }, [])

  return (
    <AuthContext.Provider value={{ user, setUser, loading }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
