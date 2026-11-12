import { useRef } from 'react'
import { TaskForm, type TaskFormHandle } from './components/TaskForm'
import { useKeyboardShortcut } from './hooks/useKeyboardShortcut'
import { Board } from './components/Board'
import { TasksProvider } from './state/TasksProvider'

export default function App() {
  const formRef = useRef<TaskFormHandle>(null)

  useKeyboardShortcut('n', (e) => {
    console.log('shortcut fired, ref =', formRef.current)   // 🔍 temp
    e.preventDefault()
    formRef.current?.focus()
  })

  return (
    <TasksProvider>
      <main className="mx-auto max-w-5xl p-6">
        <h1 className="mb-4 text-2xl font-bold text-blue-600 dark:text-blue-300">TaskFlow Lite</h1>
        <TaskForm ref={formRef} />
        <Board />
      </main>
    </TasksProvider>
  )
}
