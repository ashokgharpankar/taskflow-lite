import type { Priority, Status, Task } from '../types'

export type TaskAction =
  | { type: 'added'; title: string; priority: Priority; id?: string; now?: number }
  | { type: 'moved'; id: string; status: Status }
  | { type: 'renamed'; id: string; title: string }
  | { type: 'deleted'; id: string }
  | { type: 'clearedDone' }

export function tasksReducer(state: Task[], action: TaskAction): Task[] {
  switch (action.type) {
    case 'added': {
      const title = action.title.trim()
      if (!title) return state // invalid → SAME reference → React skips the re-render
      return [
        ...state,
        {
          id: action.id ?? crypto.randomUUID(),
          title,
          priority: action.priority,
          status: 'todo',
          createdAt: action.now ?? Date.now(),
        },
      ]
    }
    case 'moved':
      return state.map((t) => (t.id === action.id ? { ...t, status: action.status } : t))
    case 'renamed': {
      const title = action.title.trim()
      if (!title) return state
      return state.map((t) => (t.id === action.id ? { ...t, title } : t))
    }
    case 'deleted':
      return state.filter((t) => t.id !== action.id)
    case 'clearedDone':
      return state.filter((t) => t.status !== 'done')
    default: {
      const _never: never = action // compile error if a new action type isn't handled
      return _never
    }
  }
}
