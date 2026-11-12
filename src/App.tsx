import { TaskForm } from './components/TaskForm'

export default function App() {
  return (
    <main className="mx-auto max-w-5xl p-6">
      <h1 className="mb-4 text-2xl font-bold text-blue-600 dark:text-blue-300">TaskFlow Lite</h1>
      <TaskForm />
    </main>
  )
}
