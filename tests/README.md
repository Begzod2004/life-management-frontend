# Regression tests

Run `npm test` for the complete suite or `npm run test:watch` while editing.
Run `npm run type-check` separately for TypeScript validation.

The scripts use Node's built-in test runner (Node 20+ recommended). The old
scripts invoked Jest, but Jest was neither declared nor installed. No new
packages are required: `register.cjs` uses the existing TypeScript dev dependency
to compile application modules in memory for the CommonJS tests. It does not
replace the separate type check or generate build artifacts.

Tests execute the actual API modules, Axios request/response interceptors,
Zustand authentication store and Telegram helpers. Only external boundaries
(network adapter, browser storage and Telegram SDK) are replaced with local
fixtures; tests never contact a live API. Each test file runs in its own Node
process. Failed assertions produce a nonzero exit code, and no tests are skipped.
