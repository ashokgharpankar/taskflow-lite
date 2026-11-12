import { act, renderHook } from '@testing-library/react'
import { afterEach, beforeEach, expect, it, vi } from 'vitest'
import { useDebounce } from '../../src/hooks/useDebounce'

beforeEach(() => vi.useFakeTimers())
afterEach(() => vi.useRealTimers())

it('only emits the last value, 300ms after typing stops', () => {
  const { result, rerender } = renderHook(({ v }) => useDebounce(v, 300), { initialProps: { v: 'a' } })

  act(() => vi.advanceTimersByTime(100))
  rerender({ v: 'ab' })                      // typed at t=100
  act(() => vi.advanceTimersByTime(100))
  rerender({ v: 'abc' })                     // typed at t=200

  act(() => vi.advanceTimersByTime(200))     // now t=400
  expect(result.current).toBe('a')           // the 'ab' timer (due t=400) must NOT have fired

  act(() => vi.advanceTimersByTime(99))      // t=499
  expect(result.current).toBe('a')

  act(() => vi.advanceTimersByTime(1))       // t=500 = 300ms after the last keystroke
  expect(result.current).toBe('abc')
})
