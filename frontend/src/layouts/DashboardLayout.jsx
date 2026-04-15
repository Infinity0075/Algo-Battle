import Sidebar from '../components/dashboard/Sidebar'
import Topbar from '../components/dashboard/Topbar'
import { Outlet } from 'react-router-dom'

function DashboardLayout () {
  return (
    <div
      style={{
        display: 'flex',
        height: '100vh',
        background: '#f5f5f5'
      }}
    >
      {/* Sidebar */}
      <Sidebar />

      {/* Right Side */}
      <div
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column'
        }}
      >
        {/* Topbar */}
        <Topbar />

        {/* Main Content */}
        <div
          style={{
            flex: 1,
            overflowY: 'auto',
            padding: '20px'
          }}
        >
          {/* 🔥 THIS IS THE MOST IMPORTANT LINE */}
          <Outlet />
        </div>
      </div>
    </div>
  )
}

export default DashboardLayout
