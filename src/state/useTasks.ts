import { use, type Dispatch } from 'react'
import type { Task } from '../types'
import { TasksDispatchContext, TasksStateContext } from './contexts'
import type { TaskAction } from './tasksReducer'

export function useTasks(): Task[] {
  const ctx = use(TasksStateContext)
  if (ctx === null) throw new Error('useTasks must be used inside <TasksProvider>')
  return ctx
}

export function useTasksDispatch(): Dispatch<TaskAction> {
  const ctx = use(TasksDispatchContext)
  if (ctx === null) throw new Error('useTasksDispatch must be used inside <TasksProvider>')
  return ctx
}
