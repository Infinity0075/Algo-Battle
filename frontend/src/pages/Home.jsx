import { Link } from 'react-router-dom'

function Home () {
  return (
    <div className='bg-[#111111] text-white min-h-screen'>
      {/* NAVBAR */}
      <nav className='flex justify-between items-center px-10 py-6 border-b border-[#2A2A2A]'>
        <h1 className='text-xl font-semibold tracking-wide text-amber-500'>
          AlgoBattle
        </h1>

        <Link
          to='/login'
          className='px-5 py-2 bg-amber-600 hover:bg-amber-500 rounded-md transition font-medium'
        >
          Login
        </Link>
      </nav>

      {/* HERO */}
      <section className='max-w-7xl mx-auto px-10 py-28 grid md:grid-cols-2 gap-16 items-center'>
        <div>
          <h1 className='text-5xl font-semibold leading-tight mb-6 tracking-tight'>
            Sharpen Your Mind.
            <span className='block text-amber-500'>
              Compete Like It Matters.
            </span>
          </h1>

          <p className='text-gray-400 text-lg leading-relaxed mb-8 max-w-xl'>
            AlgoBattle is built for serious learners. Not passive scrolling. Not
            random practice.
            <br />
            <br />
            You compete. You think faster. You grow under pressure. That’s how
            real skill is built.
          </p>

          <div className='flex gap-4'>
            <Link
              to='/login'
              className='px-7 py-3 bg-amber-600 hover:bg-amber-500 rounded-md transition font-medium'
            >
              Start Competing
            </Link>

            <button className='px-7 py-3 border border-[#2A2A2A] hover:bg-[#1A1A1A] rounded-md transition'>
              Explore Platform
            </button>
          </div>
        </div>

        <div>
          <img
            src='https://images.unsplash.com/photo-1587620962725-abab7fe55159'
            className='rounded-lg border border-[#2A2A2A] shadow-lg'
          />
        </div>
      </section>

      {/* SECTION DIVIDER */}
      <div className='border-t border-[#2A2A2A]'></div>

      {/* FEATURE 1 */}
      <section className='max-w-7xl mx-auto px-10 py-24 grid md:grid-cols-2 gap-16 items-center'>
        <img
          src='https://images.unsplash.com/photo-1555066931-4365d14bab8c'
          className='rounded-lg border border-[#2A2A2A]'
        />

        <div>
          <h2 className='text-3xl font-semibold mb-4'>
            Real-Time Competitive Coding
          </h2>

          <p className='text-gray-400 leading-relaxed'>
            Most platforms isolate you. AlgoBattle doesn’t.
            <br />
            <br />
            You solve problems while others solve the same problem — at the same
            time.
            <br />
            <br />
            This builds speed, pressure handling, and clarity.
          </p>
        </div>
      </section>

      {/* FEATURE 2 */}
      <section className='max-w-7xl mx-auto px-10 py-24 grid md:grid-cols-2 gap-16 items-center'>
        <div>
          <h2 className='text-3xl font-semibold mb-4'>
            Built for Focused Growth
          </h2>

          <p className='text-gray-400 leading-relaxed'>
            No distractions. No noise.
            <br />
            <br />
            Just problems, logic, and improvement.
            <br />
            <br />
            Every submission teaches something — even the wrong ones.
          </p>
        </div>

        <img
          src='https://images.unsplash.com/photo-1518770660439-4636190af475'
          className='rounded-lg border border-[#2A2A2A]'
        />
      </section>

      {/* FEATURE 3 */}
      <section className='max-w-7xl mx-auto px-10 py-24 grid md:grid-cols-2 gap-16 items-center'>
        <img
          src='https://images.unsplash.com/photo-1537432376769-00a7f0a7f8b0'
          className='rounded-lg border border-[#2A2A2A]'
        />

        <div>
          <h2 className='text-3xl font-semibold mb-4'>Earn Your Position</h2>

          <p className='text-gray-400 leading-relaxed'>
            Leaderboards aren’t for show.
            <br />
            <br />
            They reflect consistency, discipline, and performance.
            <br />
            <br />
            You don’t climb by luck. You climb by thinking better.
          </p>
        </div>
      </section>

      {/* CTA */}
      <section className='text-center py-28 px-6 border-t border-[#2A2A2A]'>
        <h2 className='text-4xl font-semibold mb-6'>
          The only way to get better is to compete.
        </h2>

        <p className='text-gray-400 mb-8'>
          Start now. Don’t wait for the “perfect time”.
        </p>

        <Link
          to='/login'
          className='px-10 py-4 bg-amber-600 hover:bg-amber-500 rounded-md font-medium'
        >
          Enter AlgoBattle
        </Link>
      </section>

      {/* FOOTER */}
      <footer className='text-center py-6 border-t border-[#2A2A2A] text-gray-500 text-sm'>
        © 2026 AlgoBattle — Built for focused coders.
      </footer>
    </div>
  )
}

export default Home
