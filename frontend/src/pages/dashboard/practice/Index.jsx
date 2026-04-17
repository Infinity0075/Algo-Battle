import ProblemList from './ProblemList'

const FONTS = `@import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@400;500&display=swap');`

function Practice () {
  return (
    <div
      style={{
        padding: '32px 28px',
        maxWidth: 860,
        margin: '0 auto',
        background: '#09090f',
        minHeight: '100vh'
      }}
    >
      <style>{FONTS}</style>
      <style>{`@keyframes fadeUp { from { opacity: 0; transform: translateY(14px); } to { opacity: 1; transform: translateY(0); } }`}</style>

      <div style={{ marginBottom: 28, animation: 'fadeUp 0.4s ease' }}>
        <p
          style={{
            margin: '0 0 6px',
            fontSize: 12,
            color: '#64748b',
            fontFamily: 'JetBrains Mono, monospace',
            letterSpacing: '0.08em',
            textTransform: 'uppercase'
          }}
        >
          sharpen your skills
        </p>
        <h1
          style={{
            margin: 0,
            fontFamily: 'Syne, sans-serif',
            fontSize: 30,
            fontWeight: 800,
            color: '#f1f5f9',
            letterSpacing: '-0.5px'
          }}
        >
          Practice Problems
        </h1>
      </div>

      <ProblemList />
    </div>
  )
}

export default Practice
