import { useId, useRef, useState, type FormEvent } from 'react'
import type { Priority } from '../types'
import { useTasksDispatch } from '../state/useTasks'

export function TaskForm() {
  const dispatch = useTasksDispatch()
  const [title, setTitle] = useState('')
  const [priority, setPriority] = useState<Priority>('medium')
  const inputRef = useRef<HTMLInputElement>(null)
  const titleId = useId()
  const priorityId = useId()
  const MAX = 120
  const remaining = MAX - title.length

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (!title.trim()) return
    dispatch({ type: 'added', title, priority })
    setTitle('')
    inputRef.current?.focus()
  }

  return (
    <form
      onSubmit={handleSubmit}
      aria-label="Add task"
      className="flex flex-wrap items-end gap-3 rounded-lg border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-800"
    >
      <div className="flex min-w-60 flex-1 flex-col gap-1">
        <label htmlFor={titleId} className="text-sm font-medium">New task</label>
        <input
          id={titleId}
          ref={inputRef}
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="What needs doing?"
          maxLength={MAX}
          className="rounded-md border border-slate-300 px-3 py-2 dark:border-slate-600 dark:bg-slate-900"
        />
        <span
          className={`text-xs ${remaining <= 10 ? 'text-red-600' : 'text-slate-500'}`}
          aria-live="polite"
        >
          {title.length} / {MAX}
        </span>
      </div>
      <div className="flex flex-col gap-1">
        <label htmlFor={priorityId} className="text-sm font-medium">Priority</label>
        <select
          id={priorityId}
          value={priority}
          onChange={(e) => setPriority(e.target.value as Priority)}
          className="rounded-md border border-slate-300 px-3 py-2 dark:border-slate-600 dark:bg-slate-900"
        >
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>
      </div>
      <button
        type="submit"
        disabled={!title.trim()}
        className="rounded-md bg-blue-600 px-4 py-2 font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-40"
      >
        Add
      </button>
    </form>
  )
}
