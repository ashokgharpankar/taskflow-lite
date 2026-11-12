import { useEffect, useReducer, type ReactNode } from 'react'
import type { Task } from '../types'
import { STORAGE_KEY, TasksDispatchContext, TasksStateContext } from './contexts'
import { tasksReducer } from './tasksReducer'

function loadTasks(): Task[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? (JSON.parse(raw) as Task[]) : []
  } catch {
    return [] // corrupted JSON shouldn't crash the app
  }
}

export function TasksProvider({ children, initialTasks }: { children: ReactNode; initialTasks?: Task[] }) {
  // 3rd argument = lazy initializer: runs ONCE, not on every render
  const [tasks, dispatch] = useReducer(tasksReducer, initialTasks, (init) => init ?? loadTasks())

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks))
  }, [tasks])

  return (
    <TasksStateContext value={tasks}>
      <TasksDispatchContext value={dispatch}>{children}</TasksDispatchContext>
    </TasksStateContext>
  )
}
