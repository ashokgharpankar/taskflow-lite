import { act, renderHook } from '@testing-library/react'
import { expect, it } from 'vitest'
import { useLocalStorage } from '../../src/hooks/useLocalStorage'

it('reads the fallback, writes through, and notifies every subscriber', () => {
  const a = renderHook(() => useLocalStorage<'light' | 'dark'>('theme', 'light'))
  const b = renderHook(() => useLocalStorage<'light' | 'dark'>('theme', 'light'))
  expect(a.result.current[0]).toBe('light')
  act(() => a.result.current[1]('dark'))
  expect(localStorage.getItem('theme')).toBe('dark')
  expect(b.result.current[0]).toBe('dark') // the second hook re-rendered too
})
