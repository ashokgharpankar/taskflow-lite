import { describe, expect, it } from 'vitest'
import { tasksReducer } from '../../src/state/tasksReducer'
import type { Task } from '../../src/types'

const base: Task[] = [
  { id: 'a', title: 'Write spec', status: 'todo', priority: 'high', createdAt: 1 },
  { id: 'b', title: 'Ship it', status: 'done', priority: 'low', createdAt: 2 },
]

describe('tasksReducer', () => {
  it('adds a trimmed task in the todo column', () => {
    const next = tasksReducer([], { type: 'added', title: '  Plan sprint ', priority: 'medium', id: 'x', now: 5 })
    expect(next).toEqual([{ id: 'x', title: 'Plan sprint', status: 'todo', priority: 'medium', createdAt: 5 }])
  })

  it('returns the SAME reference for a blank title', () => {
    expect(tasksReducer(base, { type: 'added', title: '   ', priority: 'low' })).toBe(base)
  })

  it('moves a task without mutating the original', () => {
    const next = tasksReducer(base, { type: 'moved', id: 'a', status: 'doing' })
    expect(next[0].status).toBe('doing')
    expect(base[0].status).toBe('todo')
  })

  it('renames, deletes and clears done', () => {
    expect(tasksReducer(base, { type: 'renamed', id: 'a', title: 'New' })[0].title).toBe('New')
    expect(tasksReducer(base, { type: 'deleted', id: 'a' }).map((t) => t.id)).toEqual(['b'])
    expect(tasksReducer(base, { type: 'clearedDone' }).map((t) => t.id)).toEqual(['a'])
  })
})
