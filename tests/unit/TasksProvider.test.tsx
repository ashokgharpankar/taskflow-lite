// Expected failures (storage full/blocked) must degrade gracefully, not crash the UI.
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, expect, it, vi } from 'vitest'
import { Board } from '../../src/components/Board'
import { TaskForm } from '../../src/components/TaskForm'
import { TasksProvider } from '../../src/state/TasksProvider'

afterEach(() => vi.restoreAllMocks())

it('keeps working in memory when localStorage.setItem throws', async () => {
  vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
    throw new DOMException('Quota exceeded', 'QuotaExceededError')
  })
  const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
  const user = userEvent.setup()

  render(
    <TasksProvider>
      <TaskForm />
      <Board />
    </TasksProvider>,
  )
  await user.type(screen.getByLabelText('New task'), 'Survive a full disk')
  await user.click(screen.getByRole('button', { name: 'Add' }))

  expect(screen.getByText('Survive a full disk')).toBeInTheDocument() // UI still works
  expect(warn).toHaveBeenCalledWith(expect.stringContaining('Could not save tasks'), expect.any(DOMException))
})

it('starts empty instead of crashing when stored JSON is corrupted', () => {
  localStorage.setItem('taskflow-lite:tasks', '{not json')
  render(
    <TasksProvider>
      <Board />
    </TasksProvider>,
  )
  expect(screen.getAllByText('Nothing here')).toHaveLength(3)
})
