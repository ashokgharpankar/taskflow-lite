// Module 7 — this file is code-split: it's loaded with React.lazy only when the
// user opens the panel. Check `npm run build` output — it becomes its own chunk.
import { useMemo } from 'react'
import { useTasks, useTasksDispatch } from '../state/useTasks'

export default function StatsPanel() {
  const tasks = useTasks()
  const dispatch = useTasksDispatch()

  const stats = useMemo(() => {
    const done = tasks.filter((t) => t.status === 'done').length
    const high = tasks.filter((t) => t.priority === 'high' && t.status !== 'done').length
    const pct = tasks.length ? Math.round((done / tasks.length) * 100) : 0
    return { total: tasks.length, done, high, pct }
  }, [tasks])

  return (
  <aside aria-label="Stats" className="mt-4 flex flex-wrap items-center gap-6 rounded-lg border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-800">
    <div><strong className="text-xl">{stats.total}</strong> <span className="text-sm text-slate-500">total</span></div>
    <div><strong className="text-xl">{stats.done}</strong> <span className="text-sm text-slate-500">done</span></div>
    <div><strong data-testid="completion" className="text-xl">{stats.pct}%</strong> <span className="text-sm text-slate-500">complete</span></div>
    <div><strong className="text-xl">{stats.high}</strong> <span className="text-sm text-slate-500">open high-priority</span></div>
    <button
      onClick={() => dispatch({ type: 'clearedDone' })}
      disabled={stats.done === 0}
      className="ml-auto rounded-md border border-slate-300 px-3 py-1.5 text-sm hover:bg-slate-100 disabled:opacity-40 dark:border-slate-600 dark:hover:bg-slate-700"
    >
      Clear done
    </button>
  </aside>
)
}
