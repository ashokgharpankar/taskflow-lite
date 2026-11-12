// Module 4 — consumes the useFetch custom hook. Uses a discriminated union, so
// TypeScript knows `data` exists only when status === 'success'.
import { useMemo, useState } from 'react'
import { useFetch } from '../hooks/useFetch'

interface Tip {
  hook: string
  tip: string
}

export function TipOfTheDay() {
  const state = useFetch<Tip[]>(`${import.meta.env.BASE_URL}tips.json`)
  // Date.now() is impure — calling it in render gives different output each render.
  // A lazy useState initializer captures it ONCE, keeping render pure.
  const [day] = useState(() => Math.floor(Date.now() / 86_400_000))
  const tip = useMemo(() => {
    if (state.status !== 'success' || state.data.length === 0) return null
    return state.data[day % state.data.length]
  }, [state, day])

  if (state.status === 'loading') return <p className="tip muted">Loading tip…</p>
  if (state.status === 'error') return <p className="tip muted">Tip unavailable ({state.error.message})</p>
  if (!tip) return null
  return (
    <p className="tip" data-testid="tip">
      💡 <code>{tip.hook}</code> — {tip.tip}
    </p>
  )
}
