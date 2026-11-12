# Report

One line per merged pull request, newest last.

- Added working plan: PHASES.md, TASKS.md, REPORT.md (docs/agentos, six phases from pull request checks to README updates).
- 2026-11-12: Phase 1, CI workflow: added `.github/workflows/ci.yml` (pull requests to main, contents: read, Node 22 with the npm cache, then npm ci, npm run build and npm test, same action versions as deploy.yml). Verified: npm run build and npm test pass locally and the new CI check passed on the pull request.
- 2026-11-12: Phase 1, README checks: added a "Checks" paragraph to the Deployment section of README.md naming `.github/workflows/ci.yml` (pull requests to main, Node 22, npm ci, npm run build and npm test) and stating that e2e tests (npm run test:e2e) are run locally. Verified: the text was compared against ci.yml and package.json, and npm run build and npm test pass.
