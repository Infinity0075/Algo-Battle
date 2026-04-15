import { Outlet } from 'react-router-dom'

function DashboardLayout () {
  return (
    <div>
      {/* Sidebar here */}
      {/* Topbar optional */}

      <Outlet />
    </div>
  )
}

export default DashboardLayout
