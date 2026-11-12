import { useEffect, useState } from 'react'

function pad(n: number) {
  return String(n).padStart(2, '0')
}

/** HH:MM clock for the OS chrome. Wakes at each minute boundary; no seconds, no blinking. */
export function Clock({ className = '' }: { className?: string }) {
  const [now, setNow] = useState(() => new Date())

  useEffect(() => {
    const ms = 60_000 - (now.getSeconds() * 1000 + now.getMilliseconds())
    const t = window.setTimeout(() => setNow(new Date()), ms)
    return () => window.clearTimeout(t)
  }, [now])

  const hhmm = `${pad(now.getHours())}:${pad(now.getMinutes())}`
  return (
    <time dateTime={hhmm} className={`px-1 tabular-nums ${className}`}>
      {hhmm}
    </time>
  )
}
