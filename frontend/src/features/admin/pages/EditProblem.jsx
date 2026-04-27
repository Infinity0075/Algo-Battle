import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useAuth } from '../../auth/context/useAuth'
import { getProblemById, updateProblem } from '../../problem/services/problemService'

// function EditProblem () {
//   const { id } = useParams()
//   const { user } = useAuth()
//   const navigate = useNavigate()

//   const [form, setForm] = useState({
//     title: '',
//     difficulty: 'Easy',
//     description: '',
//     input: '',
//     output: ''
//   })

//   const [loading, setLoading] = useState(true)
//   const [saving, setSaving] = useState(false)

//   // 🔐 block non-admin
//   if (user?.role !== 'admin') {
//     return <div className='p-6 text-red-500'>Access denied</div>
//   }

//   // 🔥 fetch existing problem
//   useEffect(() => {
//     const fetchProblem = async () => {
//       try {
//         const data = await getProblem(id)

//         setForm({
//           title: data.title,
//           difficulty: data.difficulty,
//           description: data.description,
//           input: data.examples?.[0]?.input || '',
//           output: data.examples?.[0]?.output || ''
//         })
//       } catch (err) {
//         console.error(err)
//       } finally {
//         setLoading(false)
//       }
//     }

//     fetchProblem()
//   }, [id])

//   const handleChange = e => {
//     setForm({ ...form, [e.target.name]: e.target.value })
//   }

//   const handleSubmit = async e => {
//     e.preventDefault()

//     try {
//       setSaving(true)

//       await updateProblem(id, {
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

//       navigate('/dashboard/admin/manage-problems')
//     } catch (err) {
//       console.error(err)
//       alert('Update failed')
//     } finally {
//       setSaving(false)
//     }
//   }

//   if (loading) return <div className='p-6'>Loading...</div>

//   return (
//     <div className='max-w-2xl mx-auto p-6'>
//       <h1 className='text-2xl font-bold mb-6'>Edit Problem</h1>

//       <form
//         onSubmit={handleSubmit}
//         className='space-y-4 bg-white p-6 rounded-xl shadow'
//       >
//         <input
//           name='title'
//           value={form.title}
//           onChange={handleChange}
//           className='w-full p-3 border rounded-lg'
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
//           onChange={handleChange}
//           rows={5}
//           className='w-full p-3 border rounded-lg'
//         />

//         <input
//           name='input'
//           value={form.input}
//           onChange={handleChange}
//           className='w-full p-3 border rounded-lg'
//         />

//         <input
//           name='output'
//           value={form.output}
//           onChange={handleChange}
//           className='w-full p-3 border rounded-lg'
//         />

//         <button
//           disabled={saving}
//           className='w-full bg-black text-white py-3 rounded-lg'
//         >
//           {saving ? 'Updating...' : 'Update Problem'}
//         </button>
//       </form>
//     </div>
//   )
// }

// export default EditProblem

function EditProblem () {
  const { id } = useParams()
  const { user } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (user?.role !== 'admin') {
      setLoading(false)
      return
    }

    const fetchData = async () => {
      try {
        const data = await getProblemById(id)

        setForm({
          title: data.title,
          difficulty: data.difficulty,
          description: data.description,
          input: data.examples?.[0]?.input || '',
          output: data.examples?.[0]?.output || ''
        })
      } catch (err) {
        setError(err?.response?.data?.message || 'Failed to load problem')
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [id, user?.role])

  const handleChange = e => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async e => {
    e.preventDefault()

    try {
      setSaving(true)
      setError('')

      await updateProblem(id, {
        ...form,
        examples: [{ input: form.input, output: form.output }]
      })

      navigate('/dashboard/admin/manage-problems')
    } catch (err) {
      setError(err?.response?.data?.message || 'Update failed')
    } finally {
      setSaving(false)
    }
  }

  if (user?.role !== 'admin') {
    return <div className='p-6 text-red-500'>Access denied</div>
  }

  if (loading) return <div className='p-6'>Loading...</div>
  if (error && !form) return <div className='p-6 text-red-500'>{error}</div>

  return (
    <div className='max-w-2xl mx-auto p-6'>
      <h1 className='text-2xl font-bold mb-6'>Edit Problem</h1>

      <form
        onSubmit={handleSubmit}
        className='space-y-4 bg-white p-6 rounded-xl shadow'
      >
        {error && <p className='text-red-500 text-sm'>{error}</p>}

        <input
          name='title'
          value={form.title}
          onChange={handleChange}
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
          className='input'
        />
        <input
          name='output'
          value={form.output}
          onChange={handleChange}
          className='input'
        />

        <button disabled={saving} className='btn-primary'>
          {saving ? 'Updating...' : 'Update'}
        </button>
      </form>
    </div>
  )
}

export default EditProblem
