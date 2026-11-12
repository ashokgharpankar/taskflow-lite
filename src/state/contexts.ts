import { createContext, type Dispatch } from 'react'
import type { Task } from '../types'
import type { TaskAction } from './tasksReducer'

export const STORAGE_KEY = 'taskflow-lite:tasks'
export const TasksStateContext = createContext<Task[] | null>(null)
export const TasksDispatchContext = createContext<Dispatch<TaskAction> | null>(null)
