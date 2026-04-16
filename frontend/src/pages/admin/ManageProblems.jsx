import { useEffect, useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import { getProblems, deleteProblem } from '../../services/problemService'

function ManageProblems () {
  const { user } = useAuth()
  const [problems, setProblems] = useState([])
  const [loading, setLoading] = useState(true)

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
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProblems()
  }, [])

  const handleDelete = async id => {
    if (!confirm('Are you sure you want to delete this problem?')) return

    try {
      await deleteProblem(id)

      // 🔥 remove from UI instantly
      setProblems(prev => prev.filter(p => p._id !== id))
    } catch (err) {
      console.error(err)
      alert('Failed to delete')
    }
  }

  if (loading) return <div className='p-6'>Loading...</div>

  return (
    <div className='p-6 max-w-5xl mx-auto'>
      <h1 className='text-2xl font-bold mb-6'>Manage Problems</h1>

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
              <tr key={p._id} className='border-t'>
                <td className='p-3'>{p.title}</td>

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

                <td className='p-3 text-right'>
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
          <div className='p-4 text-gray-500 text-center'>No problems found</div>
        )}
      </div>
    </div>
  )
}

export default ManageProblems
