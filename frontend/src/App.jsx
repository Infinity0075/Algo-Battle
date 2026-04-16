import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './App.css'

// Public pages
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'

// Auth
import ProtectedRoute from './components/ProtectedRoute'

// Layout
import DashboardLayout from './layouts/DashboardLayout'

// Dashboard pages
import Overview from './pages/dashboard/Overview'
import Profile from './pages/dashboard/Profile'
import Battle from './pages/dashboard/Battle'
import Leaderboard from './pages/dashboard/Leaderboard'
import Practice from './pages/dashboard/practice'
import ProblemDetail from './pages/dashboard/practice/ProblemDetail'

// Admin
import AddProblem from './pages/admin/AddProblem'
import ManageProblems from './pages/admin/ManageProblems'

function App () {
  return (
    <BrowserRouter>
      <Routes>
        {/* 🔓 Public Routes */}
        <Route path='/' element={<Home />} />
        <Route path='/login' element={<Login />} />
        <Route path='/register' element={<Register />} />

        {/* 🔐 Protected Dashboard */}
        <Route
          path='/dashboard'
          element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          {/* Dashboard Home */}
          <Route index element={<Overview />} />

          {/* Practice */}
          <Route path='practice' element={<Practice />} />
          <Route path='practice/:problemId' element={<ProblemDetail />} />

          {/* Other Pages */}
          <Route path='battle' element={<Battle />} />
          <Route path='leaderboard' element={<Leaderboard />} />

          {/* Profile */}
          <Route path='profile' element={<Profile />} />
          <Route path='profile/:username' element={<Profile />} />

          {/* 🔥 ADMIN ROUTE (PROTECTED INSIDE DASHBOARD) */}
          <Route path='admin/add-problem' element={<AddProblem />} />
          <Route path='admin/manage-problems' element={<ManageProblems />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
