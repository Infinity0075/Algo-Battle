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
    if (!count) return '#ebedf0'
    if (count === 1) return '#9be9a8'
    if (count === 2) return '#40c463'
    return '#30a14e'
  }

  return (
    <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
      {days.map(date => (
        <div
          key={date}
          title={`${date} - ${data[date] || 0}`}
          style={{
            width: '15px',
            height: '14px',
            borderRadius: '2px',
            background: getColor(data[date])
          }}
        />
      ))}
    </div>
  )
}

export default ActivityHeatmap
