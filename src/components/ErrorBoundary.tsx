// Module 7 — Error boundaries are still class components (no hook equivalent yet).
// They catch errors thrown while RENDERING children — not in event handlers or async code.
import { Component, type ErrorInfo, type ReactNode } from 'react'

interface Props {
  fallback: (error: Error, reset: () => void) => ReactNode
  children: ReactNode
}
interface State {
  error: Error | null
}

export class ErrorBoundary extends Component<Props, State> {
  state: State = { error: null }

  static getDerivedStateFromError(error: Error): State {
    return { error }
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    // In production you'd send this to CloudWatch RUM / Sentry.
    console.error('Caught by ErrorBoundary:', error, info.componentStack)
  }

  reset = () => this.setState({ error: null })

  render() {
    if (this.state.error) return this.props.fallback(this.state.error, this.reset)
    return this.props.children
  }
}
