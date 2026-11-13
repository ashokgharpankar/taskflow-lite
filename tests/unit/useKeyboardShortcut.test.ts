// Module 6 — proves the latest-ref pattern: subscribe ONCE, but always call the NEWEST handler.
import { fireEvent, renderHook } from '@testing-library/react'
import { expect, it, vi } from 'vitest'
import { useKeyboardShortcut } from '../../src/hooks/useKeyboardShortcut'

it('calls the latest handler without re-subscribing', () => {
  const addSpy = vi.spyOn(window, 'addEventListener')
  const first = vi.fn()
  const second = vi.fn()
  const { rerender } = renderHook(({ h }) => useKeyboardShortcut('n', h), { initialProps: { h: first } })

  rerender({ h: second }) // parent re-rendered with a new inline function
  fireEvent.keyDown(window, { key: 'n' })

  expect(first).not.toHaveBeenCalled() // no stale closure
  expect(second).toHaveBeenCalledTimes(1)
  // StrictMode isn't on in tests, so exactly one keydown subscription should exist
  expect(addSpy.mock.calls.filter(([type]) => type === 'keydown')).toHaveLength(1)
  addSpy.mockRestore()
})

it('ignores the shortcut while the user is typing in an input', () => {
  const handler = vi.fn()
  renderHook(() => useKeyboardShortcut('n', handler))
  const input = document.createElement('input')
  document.body.appendChild(input)
  fireEvent.keyDown(input, { key: 'n' }) // bubbles to window, target is the input
  expect(handler).not.toHaveBeenCalled()
  input.remove()
})

it('removes the listener on unmount', () => {
  const handler = vi.fn()
  const { unmount } = renderHook(() => useKeyboardShortcut('n', handler))
  unmount()
  fireEvent.keyDown(window, { key: 'n' })
  expect(handler).not.toHaveBeenCalled()
})
