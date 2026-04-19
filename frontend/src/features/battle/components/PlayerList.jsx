export default function PlayerList ({ players = [], hostId }) {
  return (
    <div>
      <h3 className='text-lg font-semibold mb-3'>👥 Players</h3>

      <div className='space-y-2'>
        {players.length === 0 && (
          <p className='text-slate-500 text-sm'>No players joined</p>
        )}

        {players.map((p, i) => (
          <div
            key={p.id || i}
            className='flex justify-between items-center bg-[#0f0f1a] border border-[#1a1a2e] px-3 py-2 rounded-lg'
          >
            <span className='text-sm text-white'>
              {p.username}
              {p.id === hostId && (
                <span className='ml-2 text-xs text-amber-400'>(Host)</span>
              )}
            </span>

            <span className='text-xs text-slate-400'>#{i + 1}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
