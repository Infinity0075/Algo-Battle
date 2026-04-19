import { useNavigate } from 'react-router-dom'

function ProblemCard ({ problem, status }) {
  const navigate = useNavigate()

  if (!problem) return null

  const difficultyStyles = {
    Easy: 'text-green-400 bg-green-500/10 border-green-500/20',
    Medium: 'text-yellow-400 bg-yellow-500/10 border-yellow-500/20',
    Hard: 'text-red-400 bg-red-500/10 border-red-500/20'
  }

  const statusIcon =
    status === 'solved' ? '✓' : status === 'attempted' ? '◑' : null

  const statusStyles =
    status === 'solved'
      ? 'bg-green-500/10 text-green-400'
      : 'bg-yellow-500/10 text-yellow-400'

  // 🔥 SAFE PATH (slug > _id > id)
  const problemPath = problem.slug || problem._id || problem.id

  const handleClick = () => {
    if (!problemPath) return // 🔧 safety
    navigate(`/dashboard/practice/${problemPath}`)
  }

  return (
    <div
      onClick={handleClick}
      className='flex justify-between items-center px-4 py-3 rounded-xl cursor-pointer 
                 bg-[#0f0f1a] border border-[#1a1a2e]
                 hover:bg-[#151528] hover:border-[#2a2a40]
                 transition-all duration-200 hover:translate-x-1'
    >
      {/* LEFT */}
      <div className='flex items-center gap-3'>
        {/* STATUS */}
        {statusIcon ? (
          <span
            className={`w-5 h-5 flex items-center justify-center rounded-full text-[10px] font-bold ${statusStyles}`}
          >
            {statusIcon}
          </span>
        ) : (
          <span className='w-5 h-5 rounded-full border border-[#1a1a2e]' />
        )}

        {/* TITLE */}
        <span className='text-sm font-medium text-gray-200 truncate max-w-45'>
          {problem.title}
        </span>
      </div>

      {/* RIGHT */}
      <div className='flex items-center gap-2'>
        {/* DIFFICULTY */}
        <span
          className={`text-[11px] font-semibold px-3 py-1 rounded-full border whitespace-nowrap
          ${difficultyStyles[problem.difficulty]}`}
        >
          {problem.difficulty}
        </span>
      </div>
    </div>
  )
}

export default ProblemCard
