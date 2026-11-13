// Module 8 — Playwright E2E config.
// Tests run against the PRODUCTION build (`vite preview`), not the dev server:
// you test what you ship (minified bundle, code-split chunks, base path).
import { defineConfig, devices } from '@playwright/test'

const PORT = 4173
const isCI = !!process.env.CI

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: isCI, // a stray test.only() fails the CI build
  retries: isCI ? 2 : 0, // retries surface flaky tests in the report instead of hiding them locally
  workers: isCI ? 1 : undefined,
  reporter: isCI ? [['github'], ['html', { open: 'never' }]] : [['list'], ['html', { open: 'never' }]],
  use: {
    baseURL: process.env.E2E_BASE_URL ?? `http://localhost:${PORT}`,
    trace: 'on-first-retry', // time-travel debugging file for failures
    screenshot: 'only-on-failure',
  },
  projects: [
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
        // Optional: point at a locally installed Chromium instead of `npx playwright install`.
        launchOptions: process.env.PW_CHROMIUM_PATH ? { executablePath: process.env.PW_CHROMIUM_PATH } : {},
      },
    },
  ],
  // Skip starting a local server when E2E_BASE_URL is set (e.g. smoke-testing the live CloudFront URL).
  webServer: process.env.E2E_BASE_URL
    ? undefined
    : {
        command: `npm run build && npx vite preview --port ${PORT} --strictPort`,
        url: `http://localhost:${PORT}`,
        reuseExistingServer: !isCI,
        timeout: 120_000,
      },
})
