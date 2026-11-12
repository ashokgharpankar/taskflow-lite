export type Status = 'todo' | 'doing' | 'done'
export type Priority = 'low' | 'medium' | 'high'

export interface Task {
  id: string
  title: string
  status: Status
  priority: Priority
  createdAt: number
}

export const STATUSES: readonly Status[] = ['todo', 'doing', 'done'] as const
export const STATUS_LABEL: Record<Status, string> = {
  todo: 'To do',
  doing: 'In progress',
  done: 'Done',
}
