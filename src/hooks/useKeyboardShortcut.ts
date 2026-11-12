// Module 6 — the "latest ref" pattern. We want the listener registered ONCE,
// but always calling the newest handler. Storing the handler in a ref avoids
// re-subscribing on every render and avoids stale closures.
import { useEffect, useRef } from 'react'

export function useKeyboardShortcut(key: string, handler: (e: KeyboardEvent) => void) {
  const handlerRef = useRef(handler)
  useEffect(() => {
    handlerRef.current = handler
  })

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      console.log('keydown', e.key, (e.target as HTMLElement)?.tagName)
      const target = e.target as HTMLElement | null
      const typing = target?.tagName === 'INPUT' || target?.tagName === 'TEXTAREA' || target?.tagName === 'SELECT'
      if (!typing && e.key === key) handlerRef.current(e)
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [key])
}
