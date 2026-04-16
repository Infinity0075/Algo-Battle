import { useEffect, useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import { getProblems, deleteProblem } from '../../services/problemService'
import { useNavigate } from 'react-router-dom'

function ManageProblems () {
  const { user } = useAuth()
  const navigate = useNavigate()

  const [problems, setProblems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  // 🔐 block non-admin
  if (user?.role !== 'admin') {
    return <div className='p-6 text-red-500'>Access denied</div>
  }

  const fetchProblems = async () => {
    try {
      const data = await getProblems()
      setProblems(data)
    } catch (err) {
      console.error(err)
      setError('Failed to load problems')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProblems()
  }, [])

  const handleDelete = async id => {
    const confirmed = window.confirm('Delete this problem?')
    if (!confirmed) return

    try {
      await deleteProblem(id)

      setProblems(prev => prev.filter(p => p._id !== id))
    } catch (err) {
      console.error(err)
      setError('Delete failed')
    }
  }

  if (loading) {
    return <div className='p-6 text-gray-500'>Loading problems...</div>
  }

  return (
    <div className='p-6 max-w-5xl mx-auto space-y-6'>
      {/* Header */}
      <div className='flex justify-between items-center'>
        <h1 className='text-2xl font-bold'>Manage Problems</h1>

        <button
          onClick={() => navigate('/dashboard/admin/add-problem')}
          className='px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800'
        >
          Add Problem
        </button>
      </div>

      {/* Error */}
      {error && <div className='text-red-500 text-sm'>{error}</div>}

      {/* Table */}
      <div className='bg-white shadow rounded-xl overflow-hidden'>
        <table className='w-full text-sm'>
          <thead className='bg-gray-100 text-left'>
            <tr>
              <th className='p-3'>Title</th>
              <th className='p-3'>Difficulty</th>
              <th className='p-3 text-right'>Actions</th>
            </tr>
          </thead>

          <tbody>
            {problems.map(p => (
              <tr key={p._id} className='border-t hover:bg-gray-50 transition'>
                <td className='p-3 font-medium'>{p.title}</td>

                <td className='p-3'>
                  <span
                    className={`px-2 py-1 rounded text-xs font-medium ${
                      p.difficulty === 'Easy'
                        ? 'bg-green-100 text-green-700'
                        : p.difficulty === 'Medium'
                        ? 'bg-yellow-100 text-yellow-700'
                        : 'bg-red-100 text-red-700'
                    }`}
                  >
                    {p.difficulty}
                  </span>
                </td>

                <td className='p-3 text-right space-x-2'>
                  <button
                    onClick={() => navigate(`/dashboard/admin/edit/${p._id}`)}
                    className='px-3 py-1 text-sm bg-gray-200 rounded hover:bg-gray-300'
                  >
                    Edit
                  </button>

                  <button
                    onClick={() => handleDelete(p._id)}
                    className='px-3 py-1 text-sm bg-red-500 text-white rounded hover:bg-red-600'
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {problems.length === 0 && (
          <div className='p-6 text-center text-gray-500'>
            No problems available
          </div>
        )}
      </div>
    </div>
  )
}

export default ManageProblems
