/**
 * ============================================
 * 🌐 GLOBAL API CLIENT (AXIOS)
 * ============================================
 *
 * 📌 Why this exists:
 * - Centralized API calls
 * - Auto attach token
 * - Handle auth errors globally
 *
 * 📌 Flow:
 * request → interceptor → backend → response → interceptor
 */

import axios from 'axios'

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5005/api',
  withCredentials: true
})

/**
 * 🔐 Attach token automatically
 */
apiClient.interceptors.request.use(
  config => {
    const token = localStorage.getItem('token')

    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }

    return config
  },
  error => Promise.reject(error)
)

/**
 * ❌ Handle global errors
 */
apiClient.interceptors.response.use(
  res => res,
  error => {
    const status = error.response?.status

    // 🔥 Auto logout on invalid token
    if (status === 401) {
      localStorage.removeItem('token')

      // redirect safely
      if (window.location.pathname !== '/login') {
        window.location.href = '/login'
      }
    }

    return Promise.reject(error)
  }
)

export default apiClient
