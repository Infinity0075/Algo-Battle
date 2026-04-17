import { useState, useEffect } from 'react'
import ProblemCard from './ProblemCard'
import { useAuth } from '../../../context/AuthContext'
import { getProblemStatus } from '../../../services/submissionService'
import { getProblems } from '../../../services/problemService'

const FONTS = `@import url('https://fonts.googleapis.com/css2?family=Syne:wght@600;700;800&family=DM+Sans:wght@300;400;500&family=JetBrains+Mono:wght@400;500&display=swap');`

const diffLevels = ['All', 'Easy', 'Medium', 'Hard']

const filterStyles = {
  All: { active: { bg: '#7c3aed', border: '#7c3aed', color: '#fff' } },
  Easy: {
    active: { bg: 'rgba(16,185,129,0.15)', border: '#10b981', color: '#10b981' }
  },
  Medium: {
    active: { bg: 'rgba(245,158,11,0.15)', border: '#f59e0b', color: '#f59e0b' }
  },
  Hard: {
    active: { bg: 'rgba(239,68,68,0.15)', border: '#ef4444', color: '#ef4444' }
  }
}

function ProblemList () {
  const [search, setSearch] = useState('')
  const [difficulty, setDifficulty] = useState('All')
  const [problems, setProblems] = useState([])
  const [statusMap, setStatusMap] = useState({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const { user } = useAuth()

  // Fetch Problems
  useEffect(() => {
    const fetchProblems = async () => {
      try {
        const data = await getProblems()
        if (!Array.isArray(data)) throw new Error('Invalid data format')
        setProblems(data)
      } catch (err) {
        console.error('Problem fetch error:', err)
        setError('Failed to load problems')
      } finally {
        setLoading(false)
      }
    }
    fetchProblems()
  }, [])

  // Fetch Status
  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const token = user?.token || localStorage.getItem('token')
        if (!token) return
        const data = await getProblemStatus(token)
        const normalized = {}
        Object.keys(data).forEach(key => {
          normalized[key.toString()] = data[key]
        })
        setStatusMap(normalized)
      } catch (err) {
        console.error('Status fetch error:', err)
      }
    }
    fetchStatus()
  }, [user])

  // Filtering
  const filteredProblems = problems.filter(problem => {
    const matchesSearch = problem.title
      .toLowerCase()
      .includes(search.toLowerCase())
    const matchesDifficulty =
      difficulty === 'All' || problem.difficulty === difficulty
    return matchesSearch && matchesDifficulty
  })

  const solvedCount = Object.values(statusMap).filter(
    s => s === 'solved'
  ).length

  if (loading)
    return (
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          padding: '60px 0',
          background: '#09090f',
          minHeight: '60vh'
        }}
      >
        <div
          style={{
            width: 32,
            height: 32,
            border: '2px solid #1a1a2e',
            borderTop: '2px solid #7c3aed',
            borderRadius: '50%',
            animation: 'spin 0.8s linear infinite'
          }}
        />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    )

  if (error)
    return (
      <div
        style={{
          padding: 24,
          textAlign: 'center',
          color: '#ef4444',
          fontFamily: 'DM Sans, sans-serif'
        }}
      >
        {error}
      </div>
    )

  return (
    <div
      style={{
        fontFamily: 'DM Sans, sans-serif',
        background: '#09090f',
        minHeight: '60vh'
      }}
    >
      <style>{FONTS}</style>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } } @keyframes fadeUp { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }`}</style>

      {/* Stats bar */}
      <div
        style={{
          display: 'flex',
          gap: 12,
          marginBottom: 20,
          padding: '12px 16px',
          background: '#0f0f1a',
          border: '1px solid #1a1a2e',
          borderRadius: 12
        }}
      >
        <span
          style={{
            fontSize: 12,
            color: '#64748b',
            fontFamily: 'JetBrains Mono, monospace'
          }}
        >
          <span style={{ color: '#10b981', fontWeight: 600 }}>
            {solvedCount}
          </span>{' '}
          / {problems.length} solved
        </span>
        <span style={{ color: '#1a1a2e' }}>|</span>
        <span
          style={{
            fontSize: 12,
            color: '#64748b',
            fontFamily: 'JetBrains Mono, monospace'
          }}
        >
          showing{' '}
          <span style={{ color: '#e2e8f0', fontWeight: 600 }}>
            {filteredProblems.length}
          </span>{' '}
          problems
        </span>
      </div>

      {/* Search */}
      <div style={{ position: 'relative', marginBottom: 16 }}>
        <span
          style={{
            position: 'absolute',
            left: 14,
            top: '50%',
            transform: 'translateY(-50%)',
            color: '#64748b',
            fontSize: 15
          }}
        >
          🔍
        </span>
        <input
          type='text'
          placeholder='Search problems...'
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{
            width: '100%',
            padding: '12px 14px 12px 40px',
            background: '#0f0f1a',
            border: '1px solid #1a1a2e',
            borderRadius: 12,
            color: '#e2e8f0',
            fontSize: 14,
            fontFamily: 'DM Sans, sans-serif',
            outline: 'none',
            boxSizing: 'border-box',
            transition: 'border-color 0.15s'
          }}
          onFocus={e => (e.target.style.borderColor = '#7c3aed')}
          onBlur={e => (e.target.style.borderColor = '#1a1a2e')}
        />
      </div>

      {/* Difficulty Filters */}
      <div
        style={{ display: 'flex', gap: 8, marginBottom: 20, flexWrap: 'wrap' }}
      >
        {diffLevels.map(level => {
          const isActive = difficulty === level
          const activeStyle = filterStyles[level].active
          return (
            <button
              key={level}
              onClick={() => setDifficulty(level)}
              style={{
                padding: '6px 16px',
                borderRadius: 20,
                border: `1px solid ${
                  isActive ? activeStyle.border : '#1a1a2e'
                }`,
                background: isActive ? activeStyle.bg : 'transparent',
                color: isActive ? activeStyle.color : '#64748b',
                fontSize: 12,
                fontWeight: 600,
                fontFamily: 'JetBrains Mono, monospace',
                cursor: 'pointer',
                transition: 'all 0.15s ease',
                letterSpacing: '0.03em'
              }}
            >
              {level}
            </button>
          )
        })}
      </div>

      {/* Problem List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {filteredProblems.length > 0 ? (
          filteredProblems.map((problem, i) => (
            <div
              key={problem._id}
              style={{ animation: `fadeUp 0.3s ease ${i * 0.03}s both` }}
            >
              <ProblemCard
                problem={problem}
                status={statusMap[problem._id?.toString()]}
              />
            </div>
          ))
        ) : (
          <div
            style={{
              textAlign: 'center',
              padding: '48px 0',
              color: '#64748b',
              fontSize: 14
            }}
          >
            <p style={{ margin: 0 }}>No problems match your filters</p>
            <p style={{ margin: '6px 0 0', fontSize: 12 }}>
              Try adjusting your search or difficulty
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

export default ProblemList
