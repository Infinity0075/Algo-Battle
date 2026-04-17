import { useNavigate } from 'react-router-dom'

const diffColors = {
  Easy: {
    text: '#10b981',
    bg: 'rgba(16,185,129,0.1)',
    border: 'rgba(16,185,129,0.25)'
  },
  Medium: {
    text: '#f59e0b',
    bg: 'rgba(245,158,11,0.1)',
    border: 'rgba(245,158,11,0.25)'
  },
  Hard: {
    text: '#ef4444',
    bg: 'rgba(239,68,68,0.1)',
    border: 'rgba(239,68,68,0.25)'
  }
}

function ProblemCard ({ problem, status }) {
  const navigate = useNavigate()

  if (!problem || !problem._id) {
    console.error('Invalid problem:', problem)
    return null
  }

  const diff = diffColors[problem.difficulty] || {
    text: '#64748b',
    bg: 'transparent',
    border: '#1a1a2e'
  }

  const statusIcon =
    status === 'solved' ? '✓' : status === 'attempted' ? '◑' : null
  const statusColor = status === 'solved' ? '#10b981' : '#f59e0b'

  return (
    <div
      onClick={() => {
        console.log('CLICKED:', problem._id)
        navigate(`/dashboard/practice/${problem._id}`)
      }}
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        border: '1px solid #1a1a2e',
        padding: '14px 18px',
        borderRadius: 12,
        cursor: 'pointer',
        background: '#0f0f1a',
        transition: 'all 0.18s ease',
        fontFamily: 'DM Sans, sans-serif'
      }}
      onMouseEnter={e => {
        e.currentTarget.style.background = '#141425'
        e.currentTarget.style.borderColor = '#2a2a40'
        e.currentTarget.style.transform = 'translateX(3px)'
      }}
      onMouseLeave={e => {
        e.currentTarget.style.background = '#0f0f1a'
        e.currentTarget.style.borderColor = '#1a1a2e'
        e.currentTarget.style.transform = 'translateX(0)'
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        {statusIcon && (
          <span
            style={{
              width: 22,
              height: 22,
              borderRadius: '50%',
              background:
                status === 'solved'
                  ? 'rgba(16,185,129,0.12)'
                  : 'rgba(245,158,11,0.12)',
              color: statusColor,
              fontSize: 11,
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0
            }}
          >
            {statusIcon}
          </span>
        )}
        {!statusIcon && (
          <span
            style={{
              width: 22,
              height: 22,
              borderRadius: '50%',
              border: '1px solid #1a1a2e',
              flexShrink: 0
            }}
          />
        )}
        <span style={{ color: '#e2e8f0', fontSize: 14, fontWeight: 500 }}>
          {problem.title}
        </span>
      </div>

      <span
        style={{
          color: diff.text,
          backgroundColor: diff.bg,
          border: `1px solid ${diff.border}`,
          padding: '3px 10px',
          borderRadius: 20,
          fontSize: 11,
          fontWeight: 600,
          fontFamily: 'JetBrains Mono, monospace',
          whiteSpace: 'nowrap'
        }}
      >
        {problem.difficulty}
      </span>
    </div>
  )
}

export default ProblemCard
