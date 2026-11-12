// Module 4 — useSyncExternalStore: the correct way to subscribe to state that lives
// OUTSIDE React (localStorage, window size, a websocket store...).
// Bonus: the 'storage' event means two open tabs stay in sync.
import { useCallback, useSyncExternalStore } from 'react'

const listeners = new Set<() => void>()

function subscribe(onChange: () => void) {
  listeners.add(onChange)
  window.addEventListener('storage', onChange) // fires for changes from OTHER tabs
  return () => {
    listeners.delete(onChange)
    window.removeEventListener('storage', onChange)
  }
}

export function useLocalStorage<T extends string>(key: string, fallback: T) {
  // getSnapshot must return a cached/primitive value — strings are compared by value, so this is safe.
  const value = useSyncExternalStore(
    subscribe,
    () => (localStorage.getItem(key) as T | null) ?? fallback,
    () => fallback, // server snapshot (SSR); harmless here
  )

  const setValue = useCallback(
    (next: T) => {
      localStorage.setItem(key, next)
      listeners.forEach((l) => l()) // notify subscribers in THIS tab
    },
    [key],
  )

  return [value, setValue] as const
}
