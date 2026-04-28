import { Routes, Route } from 'react-router-dom'
import { lazy, Suspense } from 'react'

// 🔓 Public
const Home = lazy(() => import('../public/Home'))
const Login = lazy(() => import('../features/auth/page/Login'))
const Register = lazy(() => import('../features/auth/page/Register'))

// 🔐 Core
import ProtectedRoute from '../shared/components/ProtectedRoute'
import DashboardLayout from '../shared/layouts/DashboardLayout'

// User
const Overview = lazy(() => import('../features/user/pages/Overview'))
const Profile = lazy(() => import('../features/user/pages/Profile'))
const Leaderboard = lazy(() => import('../features/user/pages/Leaderboard'))

// Problems
const Problems = lazy(() => import('../features/problem/pages/Problems'))
const ProblemDetail = lazy(() =>
  import('../features/problem/pages/ProblemDetail')
)

// Battle
const BattleHome = lazy(() => import('../features/battle/pages/BattleHome'))
const BattlePage = lazy(() => import('../features/battle/pages/BattlePage'))

// Admin
const AddProblem = lazy(() => import('../features/admin/pages/AddProblem'))
const EditProblem = lazy(() => import('../features/admin/pages/EditProblem'))
const ManageProblems = lazy(() =>
  import('../features/admin/pages/ManageProblems')
)

export default function AppRoutes () {
  return (
    <Suspense fallback={<div className='text-white p-6'>Loading...</div>}>
      <Routes>
        {/* PUBLIC */}
        <Route path='/' element={<Home />} />
        <Route path='/login' element={<Login />} />
        <Route path='/register' element={<Register />} />

        {/* PROTECTED */}
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

          {/* User */}
          <Route path='leaderboard' element={<Leaderboard />} />
          <Route path='profile' element={<Profile />} />
          <Route path='profile/:username' element={<Profile />} />

          {/* Admin */}
          <Route path='admin/add-problem' element={<AddProblem />} />
          <Route path='admin/edit/:id' element={<EditProblem />} />
          <Route path='admin/manage-problems' element={<ManageProblems />} />
        </Route>

        {/* 🔥 BATTLE ROOM (PROTECTED) */}
        <Route
          path='/battle/:id'
          element={
            <ProtectedRoute>
              <BattlePage />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Suspense>
  )
}
