import { useCallback, useDeferredValue, useMemo, useState, useTransition } from 'react'
import { useTasks } from '../state/useTasks'
import { STATUSES, STATUS_LABEL, type Priority, type Status, type Task } from '../types'
import { TaskCard } from './TaskCard'

type PriorityFilter = Priority | 'all'

export function Board() {
  const tasks = useTasks()
  const [query, setQuery] = useState('')
  const deferredQuery = useDeferredValue(query)
  const [filter, setFilter] = useState<PriorityFilter>('all')
  const [isPending, startTransition] = useTransition()
  const [openId, setOpenId] = useState<string | null>(null)

  // Derived, never stored: recompute only when inputs change.
  const columns = useMemo(() => {
    const q = deferredQuery.trim().toLowerCase()
    const grouped: Record<Status, Task[]> = { todo: [], doing: [], done: [] }
    for (const t of tasks) {
      if (filter !== 'all' && t.priority !== filter) continue
      if (q && !t.title.toLowerCase().includes(q)) continue
      grouped[t.status].push(t) // mutating arrays WE created this render, so allowed
    }
    return grouped
  }, [tasks, deferredQuery, filter])

  // Stable identity → memo(TaskCard) can skip re-renders.
  const handleOpen = useCallback((id: string) => setOpenId(id), [])

  const isStale = query !== deferredQuery
  const openTask = openId ? tasks.find((t) => t.id === openId) : undefined

  return (
    <section aria-label="Board" className="mt-6">
      <div className="mb-4 flex flex-wrap items-center gap-3">
        <input
          type="search"
          aria-label="Search tasks"
          placeholder="Search…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="min-w-52 flex-1 rounded-md border border-slate-300 px-3 py-2 dark:border-slate-600 dark:bg-slate-900"
        />
        <div role="group" aria-label="Filter by priority" className="flex gap-1">
          {(['all', 'high', 'medium', 'low'] as const).map((p) => (
            <button
              key={p}
              aria-pressed={filter === p}
              onClick={() => startTransition(() => setFilter(p))}
              className="rounded-md border border-slate-300 px-3 py-1.5 text-sm capitalize aria-pressed:bg-blue-600 aria-pressed:text-white dark:border-slate-600"
            >
              {p}
            </button>
          ))}
        </div>
        {isPending && <span className="text-sm text-slate-500">Updating…</span>}
      </div>

      {openTask && <p className="mb-3 text-sm text-slate-500">Selected: {openTask.title}</p>}

      <div className={`grid gap-4 md:grid-cols-3 transition-opacity ${isStale ? 'opacity-60' : ''}`}>
        {STATUSES.map((status) => (
          <div key={status} data-testid={`column-${status}`} className="rounded-lg bg-slate-100 p-3 dark:bg-slate-900">
            <h2 className="mb-3 flex items-center justify-between font-semibold">
              {STATUS_LABEL[status]}
              <span className="rounded-full bg-white px-2 text-xs dark:bg-slate-800">{columns[status].length}</span>
            </h2>
            {columns[status].length === 0 ? (
              <p className="text-sm text-slate-500">Nothing here</p>
            ) : (
              <ul className="space-y-2">
                {columns[status].map((t) => (
                  <TaskCard key={t.id} task={t} onOpen={handleOpen} />
                ))}
              </ul>
            )}
          </div>
        ))}
      </div>
    </section>
  )

}
