import { useEffect, useState } from 'react'

export default function Timer ({ startTime }) {
  const [time, setTime] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(Math.floor((Date.now() - startTime) / 1000))
    }, 1000)

    return () => clearInterval(interval)
  }, [startTime])

  return <div className='bg-gray-700 p-2 text-center'>Time: {time}s</div>
}
