import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import ActivityHeatmap from '../../../shared/components/ActivityHeatmap'

import {
  getStats,
  getActivity,
  getRecent,
  getStreak
} from '../../submission/services/submissionService'

function Overview () {
  const navigate = useNavigate()
  const { user } = useAuth()

  const [stats, setStats] = useState({})
  const [activityData, setActivityData] = useState({})
  const [recent, setRecent] = useState([])
  const [streak, setStreak] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!user) return

        const token = user.token
        const statsData = await getStats(token)
        const activity = await getActivity(token)
        const recentData = await getRecent(token)
        const streakData = await getStreak(token)

        setStats(statsData)
        setActivityData(activity)
        setRecent(recentData)
        setStreak(streakData.streak)
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [user])

  if (loading) {
    return (
      <div className='flex items-center justify-center h-full text-gray-400'>
        Loading dashboard...
      </div>
    )
  }

  return (
    <div className='space-y-6'>
      {/* HEADER */}
      <div>
        <p className='text-xs text-gray-500 uppercase tracking-wider'>
          Welcome back
        </p>
        <h1 className='text-2xl font-semibold'>{user?.username || 'Coder'}</h1>
      </div>

      {/* STREAK */}
      <div className='bg-[#1A1A1A] border border-[#2A2A2A] rounded-lg p-5 flex justify-between items-center'>
        <div>
          <p className='text-xs text-gray-500 uppercase'>Current Streak</p>
          <h2 className='text-2xl font-semibold text-amber-500'>
            {streak} {streak === 1 ? 'day' : 'days'}
          </h2>
          <p className='text-sm text-gray-400'>
            {streak === 0 ? 'Start today 🚀' : 'Keep going 🔥'}
          </p>
        </div>

        <span className='text-4xl opacity-80'>🔥</span>
      </div>

      {/* STATS */}
      <div className='grid grid-cols-2 md:grid-cols-5 gap-4'>
        <Stat title='Solved' value={stats.totalSolved} />
        <Stat title='Submissions' value={stats.totalSubmissions} />
        <Stat title='Easy' value={stats.easy} />
        <Stat title='Medium' value={stats.medium} />
        <Stat title='Hard' value={stats.hard} />
      </div>

      {/* ACTIVITY */}
      <div className='bg-[#1A1A1A] border border-[#2A2A2A] rounded-lg p-5'>
        <h3 className='text-sm font-medium mb-4'>Daily Activity</h3>
        <ActivityHeatmap data={activityData} />
      </div>

      {/* RECENT */}
      <div className='bg-[#1A1A1A] border border-[#2A2A2A] rounded-lg p-5'>
        <h3 className='text-sm font-medium mb-4'>Recent Activity</h3>

        {recent.length === 0 ? (
          <p className='text-gray-400 text-sm'>No activity yet</p>
        ) : (
          <div className='space-y-2'>
            {recent.map(item => (
              <div
                key={item._id}
                onClick={() =>
                  navigate(`/dashboard/practice/${item.problem.slug}`)
                }
                className='flex justify-between items-center px-3 py-2 rounded-md hover:bg-[#222222] cursor-pointer'
              >
                <span className='text-sm text-gray-200'>
                  {item.problem?.title}
                </span>

                <span
                  className={`text-xs px-2 py-1 rounded-full ${
                    item.status === 'solved'
                      ? 'bg-green-500/10 text-green-400'
                      : 'bg-yellow-500/10 text-yellow-400'
                  }`}
                >
                  {item.status === 'solved' ? 'Solved' : 'Attempted'}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ACTIONS */}
      <div className='bg-[#1A1A1A] border border-[#2A2A2A] rounded-lg p-5'>
        <h3 className='text-sm font-medium mb-4'>Quick Actions</h3>

        <div className='flex gap-3 flex-wrap'>
          <Action
            label='Practice'
            onClick={() => navigate('/dashboard/practice')}
          />
          <Action
            label='Battle'
            onClick={() => navigate('/dashboard/battle')}
          />
          <Action
            label='Leaderboard'
            onClick={() => navigate('/dashboard/leaderboard')}
          />
        </div>
      </div>
    </div>
  )
}

function Stat ({ title, value }) {
  return (
    <div className='bg-[#1A1A1A] border border-[#2A2A2A] rounded-lg p-4 text-center'>
      <p className='text-xs text-gray-500 uppercase mb-1'>{title}</p>
      <h2 className='text-xl font-semibold'>{value || 0}</h2>
    </div>
  )
}

function Action ({ label, onClick }) {
  return (
    <button
      onClick={onClick}
      className='px-4 py-2 text-sm border border-[#2A2A2A] rounded-md hover:bg-[#222222] transition'
    >
      {label}
    </button>
  )
}

export default Overview
