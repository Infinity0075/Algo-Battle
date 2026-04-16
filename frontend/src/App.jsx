import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './App.css'

// Public pages
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import Editor from './pages/Editor'

// Auth
import ProtectedRoute from './components/ProtectedRoute'

// Layout
import DashboardLayout from './layouts/DashboardLayout'

// Dashboard pages
import Overview from './pages/dashboard/Overview'
import Profile from './pages/dashboard/Profile'
import Battle from './pages/dashboard/Battle'
import Leaderboard from './pages/dashboard/Leaderboard'

// Practice (folder-based page)
import Practice from './pages/dashboard/practice'
import ProblemDetail from './pages/dashboard/practice/ProblemDetail'

function App () {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path='/' element={<Home />} />
        <Route path='/login' element={<Login />} />
        <Route path='/register' element={<Register />} />

        {/* Protected Dashboard Routes */}
        <Route
          path='/dashboard'
          element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route
            path='/dashboard/practice/:problemId'
            element={<ProblemDetail />}
          />{' '}
          <Route index element={<Overview />} />
          <Route path='practice' element={<Practice />} />
          <Route path='battle' element={<Battle />} />
          <Route path='/dashboard/leaderboard' element={<Leaderboard />} />
          <Route path='/dashboard/profile' element={<Profile />} />
          <Route
            path='/dashboard/profile/:username'
            element={<Profile />}
          />{' '}
        </Route>

        {/* Editor Route */}
        {/* <Route path='/editor/:roomId' element={<Editor />} /> */}
      </Routes>
    </BrowserRouter>
  )
}

export default App
