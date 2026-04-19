import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useAuth } from '../../auth/context/AuthContext.jsx'
import { getUserProfile } from '../services/userService'

const G = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600&family=JetBrains+Mono:wght@400;500&display=swap');
  .fd { font-family: 'Playfair Display', serif !important; }
  .fm { font-family: 'JetBrains Mono', monospace !important; }
  body, * { font-family: 'DM Sans', sans-serif; }
  @keyframes spin { to { transform: rotate(360deg); } }
  @keyframes fadeUp { from { opacity:0; transform:translateY(14px);} to { opacity:1; transform:translateY(0);} }
  .a1 { animation: fadeUp .4s ease both; }
  .a2 { animation: fadeUp .4s .08s ease both; }
  .a3 { animation: fadeUp .4s .16s ease both; }
  .act-row:hover { background: #1c1917; }
`

function Profile () {
  const { username } = useParams()
  const { user } = useAuth()
  const finalUsername = (username || user?.username)?.toLowerCase()
  const [data, setData] = useState(null)

  useEffect(() => {
    if (!finalUsername) return
    const fetch = async () => {
      try {
        const res = await getUserProfile(finalUsername)
        setData(res)
      } catch (err) {
        console.log('error', err)
        setData(null)
      }
    }
    fetch()
  }, [finalUsername])

  if (!finalUsername)
    return (
      <div className='min-h-screen flex items-center justify-center bg-stone-950'>
        <style>{G}</style>
        <div
          style={{
            width: 36,
            height: 36,
            border: '2px solid #292524',
            borderTopColor: '#d97706',
            borderRadius: '50%',
            animation: 'spin .7s linear infinite'
          }}
        />
      </div>
    )

  if (!data)
    return (
      <div className='min-h-screen flex items-center justify-center bg-stone-950 text-stone-600 text-sm'>
        <style>{G}</style>
        User not found.
      </div>
    )

  const isOwn = user?.username?.toLowerCase() === finalUsername
  const initials = data.username.slice(0, 2).toUpperCase()

  return (
    <div className='min-h-screen bg-stone-950 pb-12'>
      <style>{G}</style>

      {/* Hero */}
      <div className='a1 border-b border-stone-800/60 bg-stone-900 px-5 py-10 md:px-12'>
        <div className='max-w-3xl mx-auto flex items-end gap-5 flex-wrap'>
          {/* Avatar */}
          <div
            className='w-20 h-20 rounded-2xl flex items-center justify-center fd text-2xl text-stone-950 font-bold flex-shrink-0'
            style={{
              background: 'linear-gradient(135deg, #d97706 0%, #b45309 100%)'
            }}
          >
            {initials}
          </div>

          <div className='flex-1 min-w-0'>
            <div className='flex flex-wrap items-center gap-2 mb-1'>
              <h1 className='fd text-3xl text-stone-50'>{data.username}</h1>
              {isOwn && (
                <span className='fm text-[10px] text-amber-500 bg-amber-500/10 border border-amber-500/25 px-2.5 py-0.5 rounded-full uppercase tracking-wider'>
                  You
                </span>
              )}
            </div>
            <p className='fm text-xs text-stone-600'>{data.email}</p>
          </div>

          <div className='text-right'>
            <p className='fm text-xs text-stone-600 uppercase tracking-wider mb-1'>
              Rating
            </p>
            <p className='fd text-3xl text-amber-400'>★ {data.rating}</p>
          </div>
        </div>
      </div>

      <div className='max-w-3xl mx-auto px-5 md:px-12 pt-8'>
        {/* Stat cards */}
        <div className='a2 grid grid-cols-2 gap-4 mb-6'>
          <StatCard
            label='Problems Solved'
            value={data.totalSolved}
            accent='text-amber-400'
          />
          <StatCard
            label='Total Submissions'
            value={data.totalSubmissions}
            accent='text-stone-300'
          />
        </div>

        {/* Recent activity */}
        <div className='a3 bg-stone-900 border border-stone-800/80 rounded-2xl overflow-hidden'>
          <div className='flex items-center gap-4 px-6 py-4 border-b border-stone-800'>
            <h3 className='fd text-lg text-stone-200'>Recent Activity</h3>
            <div className='flex-1 h-px bg-stone-800' />
          </div>

          {data.recent.length === 0 ? (
            <p className='text-stone-600 text-sm text-center py-10'>
              No activity yet. Start solving problems!
            </p>
          ) : (
            data.recent.map((item, i) => (
              <div
                key={item._id}
                className='act-row flex items-center justify-between px-6 py-3.5 border-b border-stone-800/60 last:border-none transition-colors duration-150'
              >
                <span className='text-stone-300 text-sm'>
                  {item.problem?.title}
                </span>
                {item.status === 'solved' ? (
                  <span className='fm text-[11px] font-semibold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-3 py-0.5 rounded-full'>
                    ✓ solved
                  </span>
                ) : (
                  <span className='fm text-[11px] font-semibold text-amber-400 bg-amber-500/10 border border-amber-500/20 px-3 py-0.5 rounded-full'>
                    ◑ attempted
                  </span>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}

function StatCard ({ label, value, accent }) {
  return (
    <div className='bg-stone-900 border border-stone-800/80 rounded-xl p-5 text-center'>
      <p className='fm text-[10px] text-stone-500 uppercase tracking-wider mb-2'>
        {label}
      </p>
      <p className={`fd text-4xl ${accent}`}>{value}</p>
    </div>
  )
}

export default Profile
