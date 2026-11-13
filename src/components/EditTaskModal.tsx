import { useState, type FormEvent } from 'react'
import { useTasksDispatch } from '../state/useTasks'
import type { Task } from '../types'
import { Modal } from './Modal'

export function EditTaskModal({ task, onClose }: { task: Task; onClose: () => void }) {
  const dispatch = useTasksDispatch()
  // Initialising state from props is fine here because the parent mounts a fresh modal
  // per task (key={task.id}) — the "reset state with a key" pattern.
  const [title, setTitle] = useState(task.title)

  function save(e: FormEvent) {
    e.preventDefault()
    dispatch({ type: 'renamed', id: task.id, title })
    onClose()
  }

  return (
    <Modal title="Edit task" onClose={onClose}>
      <form onSubmit={save} className="flex flex-col gap-3">
        <label className="flex flex-col gap-1 text-sm font-medium">
          Title
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="rounded-md border border-slate-300 px-3 py-2 font-normal focus:outline-2 focus:outline-blue-600 dark:border-slate-600 dark:bg-slate-900"
          />
        </label>
        <p className="text-xs text-slate-500">Created {new Date(task.createdAt).toLocaleString()}</p>
        <div className="flex justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="rounded-md border border-slate-300 px-4 py-2 hover:bg-slate-100 dark:border-slate-600 dark:hover:bg-slate-700"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={!title.trim()}
            className="rounded-md bg-blue-600 px-4 py-2 font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-40"
          >
            Save
          </button>
        </div>
      </form>
    </Modal>
  )
}
