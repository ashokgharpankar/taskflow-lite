import { render, screen } from '@testing-library/react'
import { expect, it } from 'vitest'

it('jsdom + Testing Library + jest-dom are wired up', () => {
  render(<h1>Hello TaskFlow</h1>)
  expect(screen.getByRole('heading')).toHaveTextContent('Hello TaskFlow')
})
