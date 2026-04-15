function ActivityHeatmap ({ data }) {
  const generateDays = () => {
    const days = []
    const today = new Date()

    for (let i = 69; i >= 0; i--) {
      const d = new Date()
      d.setDate(today.getDate() - i)

      const dateStr = d.toISOString().split('T')[0]
      days.push(dateStr)
    }

    return days
  }

  const days = generateDays()

  const getColor = count => {
    if (!count) return '#e5e7eb' // gray
    if (count === 1) return '#86efac'
    if (count === 2) return '#4ade80'
    return '#16a34a'
  }

  return (
    <div style={{ marginTop: '10px' }}>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(10, 1fr)',
          gap: '6px'
        }}
      >
        {days.map(date => {
          const count = data[date]

          return (
            <div
              key={date}
              title={`${date} - ${count || 0} solved`}
              style={{
                width: '20px',
                height: '20px',
                borderRadius: '4px',
                background: getColor(count)
              }}
            />
          )
        })}
      </div>
    </div>
  )
}

export default ActivityHeatmap
