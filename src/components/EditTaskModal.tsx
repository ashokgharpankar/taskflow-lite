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
      <form onSubmit={save}>
        <label>
          Title
          <input value={title} onChange={(e) => setTitle(e.target.value)} />
        </label>
        <p className="muted">Created {new Date(task.createdAt).toLocaleString()}</p>
        <div className="row">
          <button type="button" onClick={onClose}>
            Cancel
          </button>
          <button type="submit" disabled={!title.trim()}>
            Save
          </button>
        </div>
      </form>
    </Modal>
  )
}
