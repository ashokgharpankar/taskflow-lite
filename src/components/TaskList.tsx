import { useTasks, useTasksDispatch } from '../state/useTasks'

export function TaskList() {
  const tasks = useTasks()
  const dispatch = useTasksDispatch()
  if (tasks.length === 0) return <p className="mt-4 text-slate-500">No tasks yet</p>
  return (
    <ul className="mt-4 space-y-2">
      {tasks.map((t) => (
        <li key={t.id} className="flex items-center justify-between rounded-md border border-slate-200 p-3 dark:border-slate-700">
          <span>{t.title} <span className="text-xs text-slate-500">({t.priority} · {t.status})</span></span>
          <button
            onClick={() => dispatch({ type: 'deleted', id: t.id })}
            aria-label={`Delete "${t.title}"`}
            className="text-red-600 hover:underline"
          >
            Delete
          </button>
        </li>
      ))}
    </ul>
  )
}
