// Module 4 — data fetching with useEffect done properly:
//  • AbortController cancels in-flight requests on unmount / url change (no race conditions).
//  • We never call setState synchronously in the effect. Instead the result is tagged
//    with the url it belongs to, and "loading" is DERIVED during render:
//    if the stored result is for a different url, we're loading.
import { useEffect, useState } from 'react'

export type FetchState<T> =
  | { status: 'loading' }
  | { status: 'success'; data: T }
  | { status: 'error'; error: Error }

type Settled<T> = { url: string } & ({ status: 'success'; data: T } | { status: 'error'; error: Error })

export function useFetch<T>(url: string): FetchState<T> {
  const [result, setResult] = useState<Settled<T> | null>(null)

  useEffect(() => {
    const controller = new AbortController()
    fetch(url, { signal: controller.signal })
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
        return res.json() as Promise<T>
      })
      .then((data) => setResult({ url, status: 'success', data }))
      .catch((err: unknown) => {
        if (controller.signal.aborted) return // ignore cancelled requests
        setResult({ url, status: 'error', error: err instanceof Error ? err : new Error(String(err)) })
      })
    return () => controller.abort()
  }, [url])

  if (!result || result.url !== url) return { status: 'loading' }
  return result
}
