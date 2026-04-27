import { useState } from 'react'
import { useAuth } from '../../auth/context/useAuth'
import { useNavigate } from 'react-router-dom'
import { createProblem } from '../../problem/services/problemService'

// function AddProblem () {
//   const { user } = useAuth()
//   const navigate = useNavigate()

//   const [form, setForm] = useState({
//     title: '',
//     difficulty: 'Easy',
//     description: '',
//     input: '',
//     output: ''
//   })

//   const [loading, setLoading] = useState(false)
//   const [error, setError] = useState('')

//   // 🔐 Block non-admin
//   if (user?.role !== 'admin') {
//     return <div className='p-6 text-red-500'>Access denied</div>
//   }

//   const handleChange = e => {
//     setForm({ ...form, [e.target.name]: e.target.value })
//   }

//   const handleSubmit = async e => {
//     e.preventDefault()

//     // ✅ Validation
//     if (!form.title || !form.description) {
//       setError('Title and description are required')
//       return
//     }

//     try {
//       setLoading(true)
//       setError('')

//       await createProblem({
//         title: form.title,
//         difficulty: form.difficulty,
//         description: form.description,
//         examples: [
//           {
//             input: form.input,
//             output: form.output
//           }
//         ]
//       })

//       // ✅ Reset form
//       setForm({
//         title: '',
//         difficulty: 'Easy',
//         description: '',
//         input: '',
//         output: ''
//       })

//       navigate('/dashboard/practice')
//     } catch (err) {
//       console.error(err)
//       setError('Failed to add problem')
//     } finally {
//       setLoading(false)
//     }
//   }

//   return (
//     <div className='max-w-2xl mx-auto p-6'>
//       <h1 className='text-2xl font-bold mb-6'>Add New Problem</h1>

//       <form
//         onSubmit={handleSubmit}
//         className='space-y-4 bg-white p-6 rounded-xl shadow'
//       >
//         {error && <div className='text-red-500 text-sm'>{error}</div>}

//         <input
//           name='title'
//           value={form.title}
//           placeholder='Problem Title'
//           onChange={handleChange}
//           className='w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black'
//         />

//         <select
//           name='difficulty'
//           value={form.difficulty}
//           onChange={handleChange}
//           className='w-full p-3 border rounded-lg'
//         >
//           <option>Easy</option>
//           <option>Medium</option>
//           <option>Hard</option>
//         </select>

//         <textarea
//           name='description'
//           value={form.description}
//           placeholder='Problem Description'
//           onChange={handleChange}
//           rows={5}
//           className='w-full p-3 border rounded-lg'
//         />

//         <input
//           name='input'
//           value={form.input}
//           placeholder='Example Input'
//           onChange={handleChange}
//           className='w-full p-3 border rounded-lg'
//         />

//         <input
//           name='output'
//           value={form.output}
//           placeholder='Example Output'
//           onChange={handleChange}
//           className='w-full p-3 border rounded-lg'
//         />

//         <button
//           disabled={loading}
//           className='w-full bg-black text-white py-3 rounded-lg hover:bg-gray-800 transition disabled:opacity-50'
//         >
//           {loading ? 'Adding...' : 'Add Problem'}
//         </button>
//       </form>
//     </div>
//   )
// }

// export default AddProblem

function AddProblem () {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({
    title: '',
    difficulty: 'Easy',
    description: '',
    input: '',
    output: ''
  })

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  if (user?.role !== 'admin') {
    return <div className='p-6 text-red-500'>Access denied</div>
  }

  const handleChange = e => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async e => {
    e.preventDefault()

    if (!form.title || !form.description) {
      return setError('Title and description required')
    }

    try {
      setLoading(true)
      setError('')

      await createProblem({
        ...form,
        examples: [{ input: form.input, output: form.output }]
      })

      navigate('/dashboard/admin/manage-problems')
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to add problem')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className='max-w-2xl mx-auto p-6'>
      <h1 className='text-2xl font-bold mb-6'>Add Problem</h1>

      <form
        onSubmit={handleSubmit}
        className='space-y-4 bg-white p-6 rounded-xl shadow'
      >
        {error && <p className='text-red-500 text-sm'>{error}</p>}

        <input
          name='title'
          value={form.title}
          onChange={handleChange}
          placeholder='Title'
          className='input'
        />

        <select
          name='difficulty'
          value={form.difficulty}
          onChange={handleChange}
          className='input'
        >
          <option>Easy</option>
          <option>Medium</option>
          <option>Hard</option>
        </select>

        <textarea
          name='description'
          value={form.description}
          onChange={handleChange}
          rows={5}
          className='input'
        />

        <input
          name='input'
          value={form.input}
          onChange={handleChange}
          placeholder='Example Input'
          className='input'
        />

        <input
          name='output'
          value={form.output}
          onChange={handleChange}
          placeholder='Example Output'
          className='input'
        />

        <button disabled={loading} className='btn-primary'>
          {loading ? 'Adding...' : 'Add Problem'}
        </button>
      </form>
    </div>
  )
}

export default AddProblem
