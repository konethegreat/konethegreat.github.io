# Report

One line per merged pull request, newest last.

- Added working plan: PHASES.md, TASKS.md, REPORT.md (docs/agentos, six phases from pull request checks to README updates).
- 2026-11-12: Phase 1, CI workflow: added `.github/workflows/ci.yml` (pull requests to main, contents: read, Node 22 with the npm cache, then npm ci, npm run build and npm test, same action versions as deploy.yml). Verified: npm run build and npm test pass locally and the new CI check passed on the pull request.
- 2026-11-12: Phase 1, README checks: added a "Checks" paragraph to the Deployment section of README.md naming `.github/workflows/ci.yml` (pull requests to main, Node 22, npm ci, npm run build and npm test) and stating that e2e tests (npm run test:e2e) are run locally. Verified: the text was compared against ci.yml and package.json, and npm run build and npm test pass.
- 2026-11-12: Goal G-012 done check, npm test on a fresh checkout: added `scripts/ensure-deps.mjs` as the `prebuild` and `pretest` scripts, which runs `npm ci` when TypeScript, Vite or Vitest is missing from node_modules and otherwise does nothing, with unit tests in `tests/unit/ensure-deps.test.ts` and a note in README.md. No dependency or lockfile change. Verified: after deleting node_modules, npm test installed from the lockfile and passed (34 tests), and npm run build passed.
