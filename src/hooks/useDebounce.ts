// Module 4 — a generic custom hook built from useState + useEffect.
// The cleanup function is the key idea: every new value cancels the previous timer.
import { useEffect, useState } from 'react'

export function useDebounce<T>(value: T, delayMs = 300): T {
  const [debounced, setDebounced] = useState(value)
  useEffect(() => {
    const id = setTimeout(() => setDebounced(value), delayMs)
    return () => clearTimeout(id)   // ← uncomment this
  }, [value, delayMs])
  return debounced
}
