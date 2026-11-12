import '@testing-library/jest-dom/vitest'
import { cleanup } from '@testing-library/react'
import { afterEach } from 'vitest'

afterEach(() => {
  cleanup()             // unmount components rendered in the previous test
  localStorage.clear()  // so state from one test can't leak into the next
})
