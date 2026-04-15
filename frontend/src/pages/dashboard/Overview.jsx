import { problems } from './practice/problems'

function Overview () {
  const total = problems.length

  const easy = problems.filter(p => p.difficulty === 'Easy').length
  const medium = problems.filter(p => p.difficulty === 'Medium').length
  const hard = problems.filter(p => p.difficulty === 'Hard').length

  const solved = 1 // fake for now
  const progress = Math.round((solved / total) * 100)

  return (
    <div style={{ padding: '20px' }}>
      <h1>Dashboard</h1>

      {/* Stats */}
      <div
        style={{
          display: 'flex',
          gap: '20px',
          marginTop: '20px',
          flexWrap: 'wrap'
        }}
      >
        <StatCard title='Total' value={total} />
        <StatCard title='Solved' value={solved} />
        <StatCard title='Easy' value={easy} />
        <StatCard title='Medium' value={medium} />
        <StatCard title='Hard' value={hard} />
      </div>

      {/* Progress */}
      <div style={{ marginTop: '30px' }}>
        <h3>Progress</h3>

        <div
          style={{
            height: '20px',
            background: '#eee',
            borderRadius: '10px',
            overflow: 'hidden'
          }}
        >
          <div
            style={{
              width: `${progress}%`,
              background: 'green',
              height: '100%'
            }}
          />
        </div>

        <p>{progress}% completed</p>
      </div>
    </div>
  )
}

function StatCard ({ title, value }) {
  return (
    <div
      style={{
        border: '1px solid #eee',
        padding: '20px',
        borderRadius: '10px',
        minWidth: '150px',
        textAlign: 'center',
        background: '#fff'
      }}
    >
      <h3 style={{ margin: 0 }}>{title}</h3>
      <p style={{ fontSize: '24px', marginTop: '10px' }}>{value}</p>
    </div>
  )
}

export default Overview
