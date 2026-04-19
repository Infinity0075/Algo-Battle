import { Routes, Route } from 'react-router-dom'

// Public
import Home from '../public/Home'
import Login from '../features/auth/page/Login'
import Register from '../features/auth/page/Register'

// Auth
import ProtectedRoute from '../shared/components/ProtectedRoute'

// Layout (🔥 FIXED)
import DashboardLayout from '../shared/layouts/DashboardLayout'

// User
import Overview from '../features/user/pages/Overview'
import Profile from '../features/user/pages/Profile'
import Leaderboard from '../features/user/pages/Leaderboard'

// Problems
import Problems from '../features/problem/pages/Problems'
import ProblemDetail from '../features/problem/pages/ProblemDetail'

// Battle
import BattleHome from '../features/battle/pages/BattleHome'
import BattlePage from '../features/battle/pages/BattlePage'

// Admin
import AddProblem from '../features/admin/pages/AddProblem'
import ManageProblems from '../features/admin/pages/ManageProblems'

export default function AppRoutes () {
  return (
    <Routes>
      {/* 🔓 Public */}
      <Route path='/' element={<Home />} />
      <Route path='/login' element={<Login />} />
      <Route path='/register' element={<Register />} />

      {/* 🔐 Dashboard */}
      <Route
        path='/dashboard'
        element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Overview />} />

        {/* Problems */}
        <Route path='practice' element={<Problems />} />
        <Route path='practice/:problemId' element={<ProblemDetail />} />

        {/* Battle */}
        <Route path='battle' element={<BattleHome />} />

        {/* Others */}
        <Route path='leaderboard' element={<Leaderboard />} />
        <Route path='profile' element={<Profile />} />
        <Route path='profile/:username' element={<Profile />} />

        {/* Admin */}
        <Route path='admin/add-problem' element={<AddProblem />} />
        <Route path='admin/manage-problems' element={<ManageProblems />} />
      </Route>

      {/* 🔥 Battle Room (OUTSIDE DASHBOARD) */}
      <Route path='/battle/:id' element={<BattlePage />} />
    </Routes>
  )
}
