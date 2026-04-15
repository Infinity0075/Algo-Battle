import { problems } from './problems'
import ProblemCard from './ProblemCard'

function ProblemList () {
  return (
    <div>
      {problems.map(problem => (
        <ProblemCard key={problem.id} problem={problem} />
      ))}
    </div>
  )
}

export default ProblemList
