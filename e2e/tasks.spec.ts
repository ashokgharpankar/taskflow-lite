// Module 8 — E2E tests drive a real browser the way a user would.
// Locator priority: getByRole > getByLabel > getByText > getByTestId (accessibility-first).
import { expect, test, type Page } from '@playwright/test'

async function addTask(page: Page, title: string, priority: 'low' | 'medium' | 'high' = 'medium') {
  await page.getByLabel('New task').fill(title)
  // exact: true — otherwise strict mode fails because "Filter by priority" also matches.
  await page.getByLabel('Priority', { exact: true }).selectOption(priority)
  await page.getByRole('button', { name: 'Add' }).click()
}

test.beforeEach(async ({ page }) => {
  await page.goto('/')
})

test('create → move → edit → delete a task', async ({ page }) => {
  await addTask(page, 'Write the release notes', 'high')

  const todo = page.getByTestId('column-todo')
  await expect(todo.getByText('Write the release notes')).toBeVisible()

  // Move it to "In progress"
  await page.getByLabel('Move "Write the release notes"').selectOption('doing')
  await expect(page.getByTestId('column-doing').getByText('Write the release notes')).toBeVisible()
  await expect(todo.getByText('Nothing here')).toBeVisible()

  // Edit through the portal modal
  await page.getByRole('button', { name: 'Write the release notes', exact: true }).click()
  const dialog = page.getByRole('dialog', { name: 'Edit task' })
  await expect(dialog).toBeVisible()
  await dialog.getByLabel('Title').fill('Publish the release notes')
  await dialog.getByRole('button', { name: 'Save' }).click()
  await expect(dialog).toBeHidden()
  await expect(page.getByText('Publish the release notes')).toBeVisible()

  // Delete
  await page.getByRole('button', { name: 'Delete "Publish the release notes"' }).click()
  await expect(page.getByTestId('task-card')).toHaveCount(0)
})

test('tasks persist across a reload (useReducer + localStorage effect)', async ({ page }) => {
  await addTask(page, 'Survive a refresh')
  await page.reload()
  await expect(page.getByText('Survive a refresh')).toBeVisible()
})

test('search and priority filter narrow the board', async ({ page }) => {
  await addTask(page, 'Fix login bug', 'high')
  await addTask(page, 'Update docs', 'low')
  await addTask(page, 'Fix footer', 'low')

  await page.getByLabel('Search tasks').fill('fix')
  await expect(page.getByTestId('task-card')).toHaveCount(2) // auto-retrying assertion handles useDeferredValue lag

  await page.getByRole('button', { name: 'low', exact: true }).click()
  await expect(page.getByTestId('task-card')).toHaveCount(1)
  await expect(page.getByText('Fix footer')).toBeVisible()
})

test('keyboard: N focuses the form, Escape closes the modal and restores focus', async ({ page }) => {
  await addTask(page, 'Keyboard user')
  await page.locator('body').click()
  await page.keyboard.press('n')
  await expect(page.getByLabel('New task')).toBeFocused()

  const cardButton = page.getByRole('button', { name: 'Keyboard user', exact: true })
  await cardButton.click()
  await expect(page.getByRole('dialog')).toBeVisible()
  await page.keyboard.press('Escape')
  await expect(page.getByRole('dialog')).toBeHidden()
  await expect(cardButton).toBeFocused()
})

test('stats panel is lazy-loaded and computes completion', async ({ page }) => {
  await addTask(page, 'One')
  await addTask(page, 'Two')
  await page.getByLabel('Move "One"').selectOption('done')

  // Prove code-splitting: the StatsPanel chunk is requested only when opened.
  const chunk = page.waitForRequest((r) => /StatsPanel.*\.js$/.test(r.url()))
  await page.getByRole('button', { name: 'Show stats' }).click()
  await chunk
  await expect(page.getByTestId('completion')).toHaveText('50%')

  await page.getByRole('button', { name: 'Clear done' }).click()
  await expect(page.getByTestId('task-card')).toHaveCount(1)
})

test('theme toggle persists (useSyncExternalStore)', async ({ page }) => {
  await page.getByRole('button', { name: 'Toggle theme' }).click()
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark')
  await page.reload()
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark')
})

test('tip of the day loads from /tips.json (useFetch)', async ({ page }) => {
  await expect(page.getByTestId('tip')).toBeVisible()
})

test('tip shows a graceful error when the request fails (network mocking)', async ({ page }) => {
  await page.route('**/tips.json', (route) => route.fulfill({ status: 500, body: 'boom' }))
  await page.goto('/')
  await expect(page.getByText(/Tip unavailable \(HTTP 500\)/)).toBeVisible()
})
