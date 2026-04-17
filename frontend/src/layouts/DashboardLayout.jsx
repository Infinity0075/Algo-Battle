import Sidebar from '../components/dashboard/Sidebar'
import Topbar from '../components/dashboard/Topbar'
import { Outlet } from 'react-router-dom'

function DashboardLayout () {
  return (
    <div className='flex h-screen bg-[#111111] text-white'>
      {/* SIDEBAR */}
      <div className='w-64 border-r border-[#2A2A2A] bg-[#1A1A1A]'>
        <Sidebar />
      </div>

      {/* RIGHT SIDE */}
      <div className='flex-1 flex flex-col'>
        {/* TOPBAR */}
        <div className='h-16 border-b border-[#2A2A2A] bg-[#111111] flex items-center px-6'>
          <Topbar />
        </div>

        {/* MAIN CONTENT */}
        <div className='flex-1 overflow-y-auto px-6 py-6 bg-[#111111]'>
          <Outlet />
        </div>
      </div>
    </div>
  )
}

export default DashboardLayout
