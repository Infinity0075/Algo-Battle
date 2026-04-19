function ActivityHeatmap ({ data }) {
  const days = []
  const today = new Date()

  // last 90 days
  for (let i = 89; i >= 0; i--) {
    const d = new Date()
    d.setDate(today.getDate() - i)
    days.push(d.toISOString().split('T')[0])
  }

  const getColor = count => {
    if (!count) return '#1f2937' // 🔧 darker (theme match)
    if (count === 1) return '#4ade80'
    if (count === 2) return '#22c55e'
    return '#16a34a'
  }

  return (
    <div className='flex gap-1 flex-wrap'>
      {days.map(date => {
        const count = data[date] || 0

        return (
          <div key={date} className='relative group'>
            {/* BOX */}
            <div
              className='w-[14px] h-[14px] rounded-sm'
              style={{ background: getColor(count) }}
            />

            {/* 🔥 TOOLTIP */}
            <div
              className='absolute bottom-6 left-1/2 -translate-x-1/2 
                         bg-black text-white text-[10px] px-2 py-1 rounded 
                         opacity-0 group-hover:opacity-100 transition whitespace-nowrap z-10'
            >
              {count} solved on {date}
            </div>
          </div>
        )
      })}
    </div>
  )
}

export default ActivityHeatmap
