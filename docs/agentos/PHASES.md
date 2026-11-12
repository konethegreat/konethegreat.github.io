# Working plan: phases

The working plan for konethegreat.github.io, the portfolio of Kone Tshivhinda and K-ONE IT SOLUTIONS. Each phase lists its tasks in [TASKS.md](TASKS.md), and every merged pull request adds one line to [REPORT.md](REPORT.md).

Standing direction from the owner, which every phase and task obeys: the design is frozen (layout, page structure, components, styles, colours, fonts, images and animations do not change, no redesigns, no new visual components, no dependency swaps). Work is content only. Facts come only from `gh repo list konethegreat`, each repository's README and GitHub releases, and the live sites. Project facts live in the data files under `src/data/`, not in component markup. The build and every existing test pass on every pull request. Credit stays with Kone Tshivhinda and K-ONE IT SOLUTIONS.

State when this plan was written (12 November 2026):

- CI: `.github/workflows/deploy.yml` is the only workflow. It runs `npm ci` and `npm run build` on pushes to `main` only, and the last 10 runs all passed. No workflow runs on pull requests, and neither `npm test` (Vitest) nor `npm run test:e2e` (Playwright and axe) runs in CI.
- Open issues: none on konethegreat/konethegreat.github.io.
- AgentOS Studio: its GitHub releases show v1.2.3 (12 November 2026) and v1.2.4 (12 November 2026, marked Latest). The site still says version 1.0.0 in `src/data/projects.ts` and `src/data/case-studies.ts`.
- GitHub snapshot: `gh repo list konethegreat` shows 28 public repositories. `publicRepoCount` in `src/data/profile.ts` says 23, `githubSnapshot` in `src/data/github.ts` says October 2026, and `repoMeta` has no entry for agentos-studio, agentos-studio-website, ui-vault, reservoir, konethegreat, performance-management-tool, systems-project-management- or animation-and-game-studio.
- K-ONE IT SOLUTIONS website: its README says Astro and Tailwind on Cloudflare Workers, with the PHP site retired in October 2026. The site still describes it as HTML, CSS and PHP in `src/data/projects.ts` and `src/data/experience.ts`, and `repoMeta` lists its language as HTML.
- Dashes: en dashes remain in `src/data/experience.ts`, `journey.ts`, `about.ts`, `projects.ts`, `credentials.ts` and the generated `photos.generated.ts`. The existing test only checks five data files for em dashes.
- Hard-coded project facts in markup: `src/components/lab/AutonomyLadder.tsx` (TimeLex ADR-0005 and AUTONOMY.md) and `src/components/lab/AgentLoopDemo.tsx` (SA-JAS).
- README: the content table omits several data files, the deep link example uses `/#project/vigil` instead of the `/work/<slug>` routes, and the status label list does not match the labels in `src/data/projects.ts`.

## Phase 1: Run the existing checks on every pull request

Pull requests are reviewed and merged by AgentOS Studio, but today nothing checks them: the only workflow runs on `main` after a merge, and the unit tests never run in CI. Add a pull request check that runs the commands the repository already has, so later content changes are verified before they merge. No dependency, script or site code changes.

Done when: a pull request to `main` shows a passing check that ran `npm ci`, `npm run build` and `npm test`, and the README names the new workflow.

## Phase 2: Tests that protect the content and data files

Add unit tests under `tests/unit/` that hold today's content rules for every data file, so later content pull requests cannot reintroduce dashes or let two copies of the same fact drift apart. Where a new test needs a data fix to pass, the fix is plain text in `src/data/` and ships in the same pull request.

Done when: `npm test` passes with tests that reject U+2014 and U+2013 in every file under `src/data/`, and that fail if the AgentOS Studio version in `projects.ts` and `case-studies.ts` disagree.

## Phase 3: Bring projects, releases and the GitHub snapshot up to date

Make the project cards, case studies and the GitHub section match the checkable sources: the AgentOS Studio latest GitHub release (v1.2.3 and then v1.2.4 at the time of writing), the K-ONE IT SOLUTIONS website as it is built today, the current public repository count and languages, and the public repositories that the site does not mention yet. Only data files change.

Done when: every repository in `gh repo list konethegreat --visibility public` has a `repoMeta` entry, `publicRepoCount` equals that list's length, the AgentOS Studio version equals the release marked Latest by `gh release list --repo konethegreat/agentos-studio`, and `npm run build` and `npm test` pass.

## Phase 4: Services, skills, experience and links

Check the services, skills, experience and contact links against the K-ONE IT SOLUTIONS website README and live site, the repository READMEs and the live sites, and correct what is stale. No new claims: anything a source does not show stays out.

Done when: `npm run check:links` reports no broken links, the K-ONE IT SOLUTIONS entry in `src/data/experience.ts` matches the K-ONE IT SOLUTIONS website README, and `site.updated` in `src/data/profile.ts` names the month of the last content pull request.

## Phase 5: Move hard-coded project facts into the data files

The README promises that nothing is hard-coded in the components. Move the project facts still written into component markup into the existing data files and give repeated facts (such as the AgentOS Studio version) one source. The rendered text stays identical.

Done when: `src/components/lab/AutonomyLadder.tsx` and `src/components/lab/AgentLoopDemo.tsx` no longer contain a project name, ADR number or file name as literal text, the AgentOS Studio version is defined once in `src/data/`, and the unit and e2e tests pass with the same rendered copy.

## Phase 6: Bring the README and docs in line with the code

Update `README.md` so its content table, routes, status labels, deployment and test notes match the repository as it is after Phases 1 to 5.

Done when: every file in `src/data/` that holds copy is listed in the README content table, the deep link example opens a case study on the live site, and every status label in `src/data/projects.ts` is described in the README.
