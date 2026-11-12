import { memo } from 'react'
import { useTasksDispatch } from '../state/useTasks'
import { STATUSES, STATUS_LABEL, type Priority, type Task } from '../types'

// Tailwind only generates classes it can SEE as complete strings in your code.
// `border-${color}-500` would never be generated, so map each priority to full class names.
const PRIORITY_STYLE: Record<Priority, string> = {
  high: 'border-l-red-500',
  medium: 'border-l-amber-500',
  low: 'border-l-slate-400',
}

interface Props {
  task: Task
  onOpen: (id: string) => void
}

export const TaskCard = memo(function TaskCard({ task, onOpen }: Props) {
  const dispatch = useTasksDispatch()
  return (
    <li
      data-testid="task-card"
      className={`rounded-md border border-l-4 border-slate-200 bg-white p-3 shadow-sm dark:border-slate-700 dark:bg-slate-800 ${PRIORITY_STYLE[task.priority]}`}
    >
      <button onClick={() => onOpen(task.id)} className="w-full text-left font-medium hover:underline">
        {task.title}
      </button>
      <div className="mt-2 flex items-center gap-2 text-sm">
        <span className="rounded bg-slate-100 px-2 py-0.5 text-xs dark:bg-slate-700">{task.priority}</span>
        <select
          aria-label={`Move "${task.title}"`}
          value={task.status}
          onChange={(e) => dispatch({ type: 'moved', id: task.id, status: e.target.value as Task['status'] })}
          className="rounded border border-slate-300 px-1 py-0.5 dark:border-slate-600 dark:bg-slate-900"
        >
          {STATUSES.map((s) => (
            <option key={s} value={s}>{STATUS_LABEL[s]}</option>
          ))}
        </select>
        <button
          aria-label={`Delete "${task.title}"`}
          onClick={() => dispatch({ type: 'deleted', id: task.id })}
          className="ml-auto text-slate-400 hover:text-red-600"
        >
          ✕
        </button>
      </div>
    </li>
  )
})
