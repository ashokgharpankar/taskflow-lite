import { lazy, Suspense, useEffect, useRef, useState } from 'react'
import { Board } from './components/Board'
import { ErrorBoundary } from './components/ErrorBoundary'
import { TaskForm, type TaskFormHandle } from './components/TaskForm'
import { TipOfTheDay } from './components/TipOfTheDay'
import { useKeyboardShortcut } from './hooks/useKeyboardShortcut'
import { useLocalStorage } from './hooks/useLocalStorage'
import { TasksProvider } from './state/TasksProvider'

const StatsPanel = lazy(() => import('./components/StatsPanel'))

export default function App() {
  const [theme, setTheme] = useLocalStorage<'light' | 'dark'>('taskflow-lite:theme', 'light')
  const [showStats, setShowStats] = useState(false)
  const formRef = useRef<TaskFormHandle>(null)

  useEffect(() => {
    document.documentElement.dataset.theme = theme   // drives Tailwind's dark: variant
  }, [theme])

  useKeyboardShortcut('n', (e) => {
    e.preventDefault()
    formRef.current?.focus()
  })

  const btn = 'rounded-md border border-slate-300 px-3 py-1.5 text-sm hover:bg-slate-100 dark:border-slate-600 dark:hover:bg-slate-700'

  return (
    <TasksProvider>
      <div className="min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100">
        <main className="mx-auto max-w-5xl p-6">
          <header className="mb-4 flex items-center justify-between">
            <h1 className="text-2xl font-bold text-blue-600 dark:text-blue-300">TaskFlow Lite</h1>
            <div className="flex gap-2">
              <button onClick={() => setShowStats((s) => !s)} aria-expanded={showStats} className={btn}>
                {showStats ? 'Hide stats' : 'Show stats'}
              </button>
              <button onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')} aria-label="Toggle theme" className={btn}>
                {theme === 'light' ? '🌙' : '☀️'}
              </button>
            </div>
          </header>

          <TipOfTheDay />

          <ErrorBoundary
            fallback={(error, reset) => (
              <div role="alert" className="mt-4 rounded-lg border border-red-300 bg-red-50 p-4 text-red-800 dark:border-red-800 dark:bg-red-950 dark:text-red-200">
                <p className="mb-2 font-medium">Something went wrong: {error.message}</p>
                <button onClick={reset} className="rounded-md bg-red-600 px-3 py-1.5 text-sm text-white">Try again</button>
              </div>
            )}
          >
            {showStats && (
              <Suspense fallback={<p className="mt-4 text-sm text-slate-500">Loading stats…</p>}>
                <StatsPanel />
              </Suspense>
            )}
            <div className="mt-4"><TaskForm ref={formRef} /></div>
            <Board />
          </ErrorBoundary>
        </main>
      </div>
    </TasksProvider>
  )
}
