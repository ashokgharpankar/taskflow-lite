// Module 6 — portal, Escape, focus in, focus restore, backdrop vs content clicks.
import { fireEvent, render, screen } from '@testing-library/react'
import { expect, it, vi } from 'vitest'
import { Modal } from '../../src/components/Modal'

function setup() {
  const onClose = vi.fn()
  const opener = document.createElement('button')
  opener.textContent = 'open'
  document.body.appendChild(opener)
  opener.focus() // pretend the user clicked this to open the modal
  const view = render(
    <div data-testid="app-root">
      <Modal title="Edit task" onClose={onClose}>
        <input aria-label="Title" />
      </Modal>
    </div>,
  )
  return { onClose, opener, ...view }
}

it('renders through a portal into document.body, outside the parent tree', () => {
  setup()
  const dialog = screen.getByRole('dialog', { name: 'Edit task' })
  expect(screen.getByTestId('app-root')).not.toContainElement(dialog)
  expect(dialog.closest('body')).toBe(document.body)
})

it('moves focus into the dialog on open', () => {
  setup()
  expect(screen.getByLabelText('Title')).toHaveFocus()
})

it('closes on Escape', () => {
  const { onClose } = setup()
  fireEvent.keyDown(document, { key: 'Escape' })
  expect(onClose).toHaveBeenCalledTimes(1)
})

it('closes on backdrop mousedown but not on mousedown inside the dialog', () => {
  const { onClose } = setup()
  fireEvent.mouseDown(screen.getByLabelText('Title'))
  expect(onClose).not.toHaveBeenCalled()
  fireEvent.mouseDown(screen.getByRole('dialog').parentElement!) // the backdrop
  expect(onClose).toHaveBeenCalledTimes(1)
})

it('restores focus to the opener when it closes', () => {
  const { opener, unmount } = setup()
  unmount()
  expect(opener).toHaveFocus()
  opener.remove()
})
