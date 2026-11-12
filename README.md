# TaskFlow Lite

A Kanban task board built to explore **React 19 hooks and advanced patterns** end to end, from component design through automated testing to a CI/CD deployment on AWS.

> 🚧 Built module by module. The checklist below tracks progress.

## Tech stack

| Layer | Tools |
|---|---|
| UI | React 19, TypeScript, Vite 8, Tailwind CSS v4 |
| State | `useReducer` + Context, custom hooks, `useSyncExternalStore` |
| Quality | Oxlint, `tsc` strict mode |
| Testing | Vitest + React Testing Library (unit/component), Playwright (E2E) |
| CI/CD | GitHub Actions: lint → typecheck → test → build → E2E → deploy |
| Hosting | AWS S3 (private) + CloudFront (OAC), CloudFormation, GitHub OIDC |

## Architecture

```
React + Vite ──► Vitest (unit) ──► Playwright (E2E vs production build)
      │                                      │
      └──── GitHub Actions: quality → e2e → deploy
                                             │  OIDC → short-lived AWS credentials
                                             ▼
                 S3 (private) ◄── OAC ── CloudFront (HTTPS, caching, security headers)
```

## Concepts covered

- [x] Project setup: Vite, StrictMode, Vitest, Tailwind
- [x] Typed domain model with union types and `Record`
- [ ] `useState`, controlled inputs, `useId`
- [ ] `useReducer` + split Context, React 19 `use()`
- [ ] Custom hooks: `useDebounce`, `useFetch` (AbortController), `useLocalStorage` (`useSyncExternalStore`)
- [ ] Performance: `memo`, `useMemo`, `useCallback`, `useDeferredValue`, `useTransition`
- [ ] Refs and DOM: latest-ref pattern, `useImperativeHandle`, `createPortal`
- [ ] Resilience: error boundaries, `lazy` + `Suspense`
- [ ] Unit and E2E tests
- [ ] GitHub Actions pipeline
- [ ] AWS deployment with CloudFormation + OIDC

## Getting started

Requires Node 22 (`nvm use`).

```bash
npm ci
npm run dev        # http://localhost:5173
npm test           # unit tests
npm run typecheck
npm run lint
```

## Scripts

| Script | Purpose |
|---|---|
| `dev` | Vite dev server with HMR |
| `build` | Typecheck + production build to `dist/` |
| `preview` | Serve the production build locally |
| `test` / `test:watch` | Vitest, once / watch mode |
| `typecheck` | `tsc -b` |
| `lint` | Oxlint |
| `e2e` / `e2e:ui` | Playwright, headless / UI mode |

## Key design decisions

- **Business logic in a pure reducer.** No React imports, so it's tested in milliseconds and portable.
- **Accessibility-first locators.** Tests find elements by role and label, never CSS classes, so styling can change without breaking tests.
- **Build once, promote.** CI deploys the exact artifact that passed every test.
- **No long-lived AWS keys.** GitHub Actions assumes a narrowly scoped IAM role via OIDC.
