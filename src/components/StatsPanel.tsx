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
    <aside className="stats" aria-label="Stats">
      <div><strong>{stats.total}</strong> total</div>
      <div><strong>{stats.done}</strong> done</div>
      <div><strong data-testid="completion">{stats.pct}%</strong> complete</div>
      <div><strong>{stats.high}</strong> open high-priority</div>
      <button onClick={() => dispatch({ type: 'clearedDone' })} disabled={stats.done === 0}>
        Clear done
      </button>
    </aside>
  )
}
