# Work Archive and Case Studies Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the placeholder Work page with a filterable archive, a calm data-driven case-study template for all eight projects, and an original lazy-loaded 3D workshop with a static fallback.

**Architecture:** Keep content in typed data. `src/data/work.ts` owns the eight case-study projects, the archive-only projects and the six workshop stations. `WorkPage` composes a filter bar, project cards, an original three.js scene (lazy-loaded, paused offscreen) and an archive table. `ProjectPage` renders `CaseStudyTemplate`, which maps the existing section union plus new decision cards and proof into a single reading column with a side rail. Shared-element transitions reuse the `case-hero` name already established by the folder shelf.

**Tech Stack:** Vite 8, React 19, TypeScript 6 strict, Tailwind CSS 4, three.js (lazy chunk), Vitest, Playwright.

**Spec:** docs/superpowers/specs/2026-10-30-portfolio-flagship-design.md

## Global Constraints

- No em dashes in user-facing copy.
- Light is the default theme; dark is the workshop mode.
- Never invent prices, metrics or screenshots. Quote in rand only after scoping.
- Third-party inspiration is credited; no code is copied from unlicensed work.
- The radial menu and 3D workshop are original implementations.
- Every effect has a reduced-motion branch. WebGL falls back to a static isometric SVG.
- WCAG 2.2 AA; no hover-only controls; every visible control works.
- TypeScript strict with `noUnusedLocals` and `noUnusedParameters`.

---

### Task 1: Case-study decisions and helpers

**Files:**
- Modify: `src/data/types.ts`
- Modify: `src/data/case-studies.ts`
- Modify: `tests/unit/content.test.ts`

**Interfaces:**
- Produces: `CaseDecision { title: string; choice: string; why: string; tradeoff: string }`, `CaseStudy.decisions?: CaseDecision[]`, `nextCaseStudy(slug: string): CaseStudy`, `caseStudyBySlug`, `caseStudies`.
- Consumes: existing `CaseStudy`, `caseStudies`, `projectBySlug`.

- [ ] **Step 1: Write the failing test**

Add to `tests/unit/content.test.ts`:

```ts
import { caseStudies, nextCaseStudy } from "@/data/case-studies"

it("gives every case study three decisions with all fields filled", () => {
  for (const study of caseStudies) {
    expect(study.decisions?.length).toBeGreaterThanOrEqual(3)
    for (const decision of study.decisions ?? []) {
      expect(decision.title.trim()).not.toBe("")
      expect(decision.choice.trim()).not.toBe("")
      expect(decision.why.trim()).not.toBe("")
      expect(decision.tradeoff.trim()).not.toBe("")
    }
  }
})

it("wraps the next case study from the last one", () => {
  expect(nextCaseStudy("vigil").slug).toBe("clearcut")
  expect(nextCaseStudy("k-one").slug).toBe("vigil")
  expect(nextCaseStudy("missing").slug).toBe("vigil")
})
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `npm test -- tests/unit/content.test.ts`
Expected: FAIL because `nextCaseStudy` is not exported and decisions are missing.

- [ ] **Step 3: Add the types**

In `src/data/types.ts`:

```ts
export interface CaseDecision {
  title: string
  choice: string
  why: string
  tradeoff: string
}
```

Add `decisions?: CaseDecision[]` to `CaseStudy`.

- [ ] **Step 4: Add decisions to all eight studies and the helper**

In `src/data/case-studies.ts`, add a `decisions` array to every entry. Use exactly these titles and facts:

| Slug | Decision titles |
| --- | --- |
| vigil | Evidence before prose; The model gets no tools; Run inside the country |
| clearcut | Integer cents; Tax rules as tested code; One core, three surfaces |
| timelex | Earned autonomy; Bring your own keys; Capture signals, not surveillance |
| sa-jas | Never press Submit; A visible browser; Real listings, checked links |
| munisolve | Three roles, logged actions; A bounded assistant; One shared operational picture |
| reservoir | Consent in the data model; Offline first; Mission-native AI |
| ui-vault | Provenance per entry; Rights tiers; A read-only MCP server |
| k-one | Small scope, running system; Rand quote after scoping; A link for every project |

For each decision write `choice` as what was built, `why` as the reason, and `tradeoff` as the cost. Derive every line from facts already in the case study or project data. Do not add new metrics.

Add at the bottom:

```ts
export function nextCaseStudy(slug: string): CaseStudy {
  const index = caseStudies.findIndex((study) => study.slug === slug)
  const next = index < 0 ? 0 : (index + 1) % caseStudies.length
  return caseStudies[next]
}
```

- [ ] **Step 5: Verify and commit**

Run: `npm run typecheck && npm test`
Expected: typecheck passes and all unit tests pass.

```bash
git add src/data/types.ts src/data/case-studies.ts tests/unit/content.test.ts
git commit -m "feat: add case-study decisions and next-project helper"
```

---

### Task 2: Work page data, filters, cards and archive

**Files:**
- Create: `src/data/work.ts`
- Create: `src/components/work/StationFilters.tsx`
- Create: `src/components/work/ProjectCard.tsx`
- Create: `src/components/work/ArchiveTable.tsx`
- Modify: `src/pages/WorkPage.tsx`
- Test: `tests/unit/work.test.ts`
- Test: `tests/e2e/work.spec.ts`

**Interfaces:**
- Produces: `StationId`, `Station`, `stations`, `stationProjects`, `projectMatchesStation`, `caseStudyProjects`, `archiveOnlyProjects`, `StationFilters`, `ProjectCard`, `ArchiveTable`.
- Consumes: `caseStudies`, `projectBySlug`, `projects`, `StatusBadge`, `Link`, `useRouter`.

- [ ] **Step 1: Write the failing data test**

Create `tests/unit/work.test.ts`:

```ts
import { describe, expect, it } from "vitest"
import { archiveOnlyProjects, caseStudyProjects, projectMatchesStation, stations } from "@/data/work"

describe("work page data", () => {
  it("has six stations with unique ids and project mappings", () => {
    expect(stations).toHaveLength(6)
    expect(new Set(stations.map((station) => station.id)).size).toBe(6)
    for (const station of stations) {
      const matches = caseStudyProjects.filter((project) => projectMatchesStation(project, station.id))
      expect(matches.length).toBeGreaterThan(0)
    }
  })

  it("lists all eight case-study projects once", () => {
    expect(caseStudyProjects.map((project) => project.slug)).toEqual([
      "vigil", "clearcut", "timelex", "sa-jas", "munisolve", "reservoir", "ui-vault", "k-one",
    ])
  })

  it("keeps case-study projects out of the archive-only list", () => {
    const studySlugs = new Set(caseStudyProjects.map((project) => project.slug))
    expect(archiveOnlyProjects.some((project) => studySlugs.has(project.slug))).toBe(false)
  })
})
```

- [ ] **Step 2: Run it to verify it fails**

Run: `npm test -- tests/unit/work.test.ts`
Expected: FAIL because `@/data/work` does not exist.

- [ ] **Step 3: Create `src/data/work.ts`**

```ts
import { caseStudies } from "./case-studies"
import { projectBySlug, projects } from "./projects"
import type { Project } from "./types"

export type StationId = "agents" | "retrieval" | "product" | "local-first" | "cloud" | "quality"

export interface Station {
  id: StationId
  label: string
  blurb: string
  position: [number, number, number]
}

export const stations: Station[] = [
  { id: "agents", label: "Agents", blurb: "Tool use, sign-off and visible automation", position: [-3.1, 0, -0.4] },
  { id: "retrieval", label: "Retrieval", blurb: "Cited answers over real documents", position: [-1.8, 0, 1.7] },
  { id: "product", label: "Product", blurb: "Interfaces people can actually use", position: [0, 0, 2.4] },
  { id: "local-first", label: "Local-first", blurb: "Sovereign models and offline capture", position: [1.8, 0, 1.7] },
  { id: "cloud", label: "Cloud", blurb: "Deployed, monitored and operated", position: [3.1, 0, -0.4] },
  { id: "quality", label: "Quality", blurb: "Tests, ADRs and threat models", position: [0, 0, -2.6] },
]

const slugsForStation: Record<StationId, string[]> = {
  agents: ["vigil", "sa-jas", "timelex"],
  retrieval: ["vigil", "reservoir", "ui-vault"],
  product: ["sa-jas", "munisolve", "ui-vault", "k-one"],
  "local-first": ["vigil", "timelex", "reservoir"],
  cloud: ["clearcut", "munisolve", "k-one"],
  quality: ["vigil", "clearcut", "timelex", "ui-vault"],
}

export const caseStudyProjects: Project[] = caseStudies.flatMap((study) => {
  const project = projectBySlug(study.slug)
  return project ? [project] : []
})

const studySlugs = new Set(caseStudies.map((study) => study.slug))
export const archiveOnlyProjects = projects.filter((project) => !studySlugs.has(project.slug))

export function projectMatchesStation(project: Project, station: StationId): boolean {
  return slugsForStation[station].includes(project.slug)
}

export function projectsForStation(station: StationId | null): Project[] {
  if (!station) return caseStudyProjects
  return caseStudyProjects.filter((project) => projectMatchesStation(project, station))
}
```

- [ ] **Step 4: Run the data test**

Run: `npm test -- tests/unit/work.test.ts`
Expected: PASS.

- [ ] **Step 5: Build the filter, card and archive components**

`StationFilters`:

```tsx
import { stations, type StationId } from "@/data/work"
import { cn } from "@/lib/utils"

interface Props {
  active: StationId | null
  onSelect: (station: StationId | null) => void
  count: number
}

export function StationFilters({ active, onSelect, count }: Props) {
  return (
    <div className="mt-8">
      <div className="flex flex-wrap gap-2" role="group" aria-label="Filter projects by capability">
        <button
          type="button"
          aria-pressed={active === null}
          onClick={() => onSelect(null)}
          className={cn(
            "rounded-full border px-4 py-2 text-sm transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
            active === null ? "border-primary bg-primary text-primary-foreground" : "border-border bg-card text-muted-foreground hover:text-foreground",
          )}
        >
          All work
        </button>
        {stations.map((station) => (
          <button
            key={station.id}
            type="button"
            aria-pressed={active === station.id}
            onClick={() => onSelect(station.id)}
            title={station.blurb}
            className={cn(
              "rounded-full border px-4 py-2 text-sm transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
              active === station.id ? "border-primary bg-primary text-primary-foreground" : "border-border bg-card text-muted-foreground hover:text-foreground",
            )}
          >
            {station.label}
          </button>
        ))}
      </div>
      <p aria-live="polite" className="mt-3 font-mono text-xs text-muted-foreground">
        {count} case {count === 1 ? "study" : "studies"} shown
      </p>
    </div>
  )
}
```

`ProjectCard`: render status, title, pitch, three tags, external links from the project, and a case-study `Link`. On link click, if the click is a plain left click, set `event.currentTarget.style.viewTransitionName = "case-hero"` before letting `Link` navigate. Use token colours only, no `Chip` (its dark-only palette fails on warm paper).

```tsx
<Link
  to={`/work/${project.slug}`}
  onClick={(event) => {
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0) return
    event.currentTarget.style.viewTransitionName = "case-hero"
  }}
  className="..."
>
  Read the case study
</Link>
```

`ArchiveTable`: a semantic list of archive-only projects with `StatusBadge`, title, kicker, and external links from `project.links`. Do not render a row for a project without a link.

- [ ] **Step 6: Rewrite `WorkPage`**

The page contains:
1. Hero with `h1` "Work" and the statement "Eight case studies across agents, legal tech, civic tech and the studio. Every claim has a link."
2. `StationFilters` bound to `useState<StationId | null>(null)`.
3. A results region labelled by the filter count, mapping `projectsForStation(active)` to `ProjectCard` in a `sm:grid-cols-2 lg:grid-cols-3` grid.
4. An archive section with `ArchiveTable` for `archiveOnlyProjects`.
5. Empty state if a filter returns nothing: "No case study matches that station yet. Show all work." with a button that clears the filter.

- [ ] **Step 7: Add the Playwright test**

Create `tests/e2e/work.spec.ts`:

```ts
import { test, expect } from "@playwright/test"

test("work filters case studies by station", async ({ page }) => {
  await page.goto("/work")
  await expect(page.getByRole("heading", { level: 1, name: "Work" })).toBeVisible()
  await expect(page.getByRole("link", { name: "Read the case study" })).toHaveCount(8)
  await page.getByRole("button", { name: "Agents" }).click()
  await expect(page.getByRole("link", { name: "Read the case study" })).toHaveCount(3)
  await page.getByRole("button", { name: "All work" }).click()
  await expect(page.getByRole("link", { name: "Read the case study" })).toHaveCount(8)
})

test("a work card opens the shared-element case study", async ({ page }) => {
  await page.goto("/work")
  await page.getByRole("link", { name: "Read the case study" }).first().click()
  await expect(page).toHaveURL(/\/work\/vigil$/)
  await expect(page.getByRole("heading", { level: 1 })).toContainText("Vigil")
})
```

- [ ] **Step 8: Verify and commit**

Run: `npm run typecheck && npm test && npm run build && npx playwright test tests/e2e/work.spec.ts`
Expected: all pass.

```bash
git add src/data/work.ts src/components/work src/pages/WorkPage.tsx tests/unit/work.test.ts tests/e2e/work.spec.ts
git commit -m "feat: add filterable work archive"
```

---

### Task 3: Case-study template

**Files:**
- Create: `src/components/case-study/CaseHero.tsx`
- Create: `src/components/case-study/CaseBody.tsx`
- Create: `src/components/case-study/CaseNext.tsx`
- Modify: `src/pages/ProjectPage.tsx`
- Test: `tests/e2e/case-study.spec.ts`

**Interfaces:**
- Produces: `CaseHero({ project, study })`, `CaseBody({ project, study })`, `CaseNext({ study })`.
- Consumes: `Project`, `CaseStudy`, `StatusBadge`, `Link`, `nextCaseStudy`, `useRouter`.

- [ ] **Step 1: Write the failing Playwright test**

```ts
import { test, expect } from "@playwright/test"

test("a case study renders its evidence and next project", async ({ page }) => {
  await page.goto("/work/vigil")
  await expect(page.getByRole("heading", { level: 1, name: "Vigil" })).toBeVisible()
  await expect(page.getByRole("heading", { name: "Decisions that matter" })).toBeVisible()
  await expect(page.getByRole("heading", { name: "Proof" })).toBeVisible()
  await expect(page.getByRole("link", { name: /ClearCut/ }).last()).toBeVisible()
})

test("a case study with a live deployment links to it", async ({ page }) => {
  await page.goto("/work/clearcut")
  await expect(page.getByRole("link", { name: "Open live site" })).toHaveAttribute("href", "https://145-241-100-85.sslip.io/")
})
```

- [ ] **Step 2: Run it to verify it fails**

Run: `npx playwright test tests/e2e/case-study.spec.ts`
Expected: FAIL because the current page has no decisions or proof headings.

- [ ] **Step 3: Build `CaseHero`**

Layout:
- Breadcrumb `Work / {title}` using `Link to="/work"`.
- `StatusBadge` with `project.status`.
- `h1` with `style={{ viewTransitionName: "case-hero" }}`.
- Tagline from `study.tagline`, summary from `study.summary`.
- Meta row: role, period, team.
- Stack chips using `border-border bg-muted/40 text-foreground`.
- Actions: every `project.links` external anchor plus a technical-brief anchor only when `study.technicalBrief` exists. Use `target="_blank" rel="noopener noreferrer"`.
- Cover: a wide `div` with `role="img"` and `aria-label={`${project.title} cover illustration. ${study.heroAlt}`}`. Inside, an inline SVG with accent bands and a caption "Illustrated cover, not a screenshot." This is deliberately not a fake UI.

- [ ] **Step 4: Build `CaseBody`**

Two-column layout: reading column plus `aside` rail (sticky at `lg`).

Reading column order:
1. Map `study.sections`:
   - `facts` → `dl` of label/value.
   - `prose` → `h2` (if heading) plus paragraphs.
   - `list` → `h2` plus `ul` with lucide `Check` icons, `aria-hidden` on the icon.
   - `quote` → `blockquote` with optional `cite`.
   - `figure` → `figure` with `img` width/height and caption.
2. `study.decisions` → `h2` "Decisions that matter" and three cards, each with title, choice, "Why" and "Trade-off" lines.
3. Proof → `h2` "Proof" with `dl` built from `project.metrics ?? []`; if there are no metrics, show the case facts only. Then `project.note` in a bordered honesty panel, labelled "What is not built yet" only when the note starts with "The" or contains "not".
4. `study.gallery` → only when present; `figure` per image.

Rail: status badge, role, period, team, stack, and the live/source links. Keep links duplicated only if the hero actions are not visible on small screens; instead, hide the rail below `lg` and keep hero actions as the single set on phones.

- [ ] **Step 5: Build `CaseNext`**

Call `nextCaseStudy(study.slug)`, look up its project, and render a full-width link card: eyebrow "Next case study", title, tagline, and an arrow. The link's accessible name includes the next title.

- [ ] **Step 6: Rewrite `ProjectPage`**

```tsx
export function ProjectPage() {
  const match = useRouteMatch()
  const slug = match?.params.slug ?? ""
  const project = projectBySlug(slug)
  const study = caseStudyBySlug(slug)
  if (!project || !study) return <NotFoundPage />
  return (
    <article className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
      <CaseHero project={project} study={study} />
      <CaseBody project={project} study={study} />
      <CaseNext study={study} />
    </article>
  )
}
```

Remove the old inline `viewTransitionName` from the article; it now lives on the `h1`.

- [ ] **Step 7: Verify and commit**

Run: `npm run typecheck && npm run build && npx playwright test tests/e2e/case-study.spec.ts tests/e2e/a11y.spec.ts`
Expected: all pass, including axe on `/work/vigil`.

```bash
git add src/components/case-study src/pages/ProjectPage.tsx tests/e2e/case-study.spec.ts
git commit -m "feat: add the case-study template"
```

---

### Task 4: Original 3D workshop with a static fallback

**Files:**
- Modify: `package.json` (add `three`)
- Create: `src/components/work/workshop/WorkshopSection.tsx`
- Create: `src/components/work/workshop/WorkshopScene.tsx`
- Create: `src/components/work/workshop/WorkshopFallback.tsx`
- Create: `src/lib/webgl.ts`
- Test: `tests/e2e/workshop.spec.ts`

**Interfaces:**
- Produces: `WorkshopSection({ active, onSelect })`, default `WorkshopScene({ active, onSelect })`, `WorkshopFallback({ active, onSelect })`, `canRenderWorkshop(): boolean`.
- Consumes: `stations`, `StationId`, `usePrefersReducedMotion`.

- [ ] **Step 1: Install three**

```bash
npm install three
npm install -D @types/three
```

If `@types/three` is not required because the installed `three` ships declarations, keep it only if typecheck needs it.

- [ ] **Step 2: Write the failing Playwright test**

```ts
import { test, expect } from "@playwright/test"

test("the workshop exposes six stations and filters on click", async ({ page }) => {
  await page.goto("/work")
  const workshop = page.getByRole("region", { name: "The workshop" })
  await expect(workshop).toBeVisible()
  await expect(workshop.getByRole("button")).toHaveCount(7)
  await workshop.getByRole("button", { name: "Local-first" }).click()
  await expect(workshop.getByRole("button", { name: "Local-first" })).toHaveAttribute("aria-pressed", "true")
  await expect(page.getByRole("link", { name: "Read the case study" })).toHaveCount(3)
})
```

- [ ] **Step 3: Run it to verify it fails**

Run: `npx playwright test tests/e2e/workshop.spec.ts`
Expected: FAIL because the workshop region does not exist.

- [ ] **Step 4: Add the WebGL capability check**

`src/lib/webgl.ts`:

```ts
export function canRenderWorkshop(): boolean {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return false
  if (window.matchMedia("(pointer: coarse)").matches) return false
  if ((navigator.hardwareConcurrency ?? 8) < 4) return false
  const canvas = document.createElement("canvas")
  const context = canvas.getContext("webgl2") ?? canvas.getContext("webgl")
  return context !== null
}
```

- [ ] **Step 5: Build the static fallback**

`WorkshopFallback` renders an isometric SVG of six pedestals arranged in the same ring, coloured brass, copper and teal. The SVG is `aria-hidden`. The six station buttons are rendered once by `WorkshopSection`, not by the fallback. Add a caption: "Static workshop view. The live scene needs WebGL and a fine pointer."

- [ ] **Step 6: Build `WorkshopScene`**

Use only three.js primitives and no external assets.

```tsx
import * as THREE from "three"
import { useEffect, useRef } from "react"
import { stations, type StationId } from "@/data/work"

interface Props {
  active: StationId | null
  onSelect: (station: StationId) => void
}

export default function WorkshopScene({ active, onSelect }: Props) {
  const host = useRef<HTMLDivElement>(null)
  const activeRef = useRef(active)
  activeRef.current = active
  const selectRef = useRef(onSelect)
  selectRef.current = onSelect

  useEffect(() => {
    const element = host.current
    if (!element) return
    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(34, 1, 0.1, 100)
    camera.position.set(0, 5.6, 7.2)
    camera.lookAt(0, 0.4, 0)
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.setClearColor(0x000000, 0)
    element.appendChild(renderer.domElement)
    renderer.domElement.setAttribute("aria-hidden", "true")
    renderer.domElement.style.width = "100%"
    renderer.domElement.style.height = "100%"
    renderer.domElement.style.display = "block"
    // ...build pedestals, hit meshes, lights, raycaster, resize, pointer and click handlers...
    // ...animation loop checks visibleRef and document.hidden, and does not auto-rotate...
    return () => {
      // dispose geometries, materials, renderer and listeners
    }
  }, [])

  return <div ref={host} className="h-[22rem] w-full sm:h-[26rem]" />
}
```

Implementation requirements:
- Six pedestals from `stations.position`; each is a `CylinderGeometry` base plus a distinct primitive: three small spheres (agents), stacked plates (retrieval), a rounded slab and screen (product), a wireframe cube (local-first), an icosahedron (cloud), a torus (quality).
- One unseen larger cylinder per station for pointer hits, with `userData.station = station.id`.
- Pointer move raycasts and sets a hovered id; the render loop scales the hovered or active station by 1.08 and raises its emissive intensity. No CSS animation on the canvas.
- Click raycasts and calls `selectRef.current(id)`.
- ResizeObserver keeps the camera aspect and renderer size correct.
- IntersectionObserver sets `visibleRef`. `document.visibilitychange` also pauses. The loop returns early when paused.
- `prefers-reduced-motion` is handled by the wrapper (it never mounts the scene); the scene itself still avoids auto-rotation.
- Dispose every geometry, material, texture and the renderer on unmount.

- [ ] **Step 7: Build `WorkshopSection`**

```tsx
const WorkshopScene = lazy(() => import("./WorkshopScene"))

export function WorkshopSection({ active, onSelect }: Props) {
  const [sceneReady, setSceneReady] = useState(false)
  useEffect(() => setSceneReady(canRenderWorkshop()), [])
  return (
    <section aria-labelledby="workshop-title" ...>
      <h2 id="workshop-title">The workshop</h2>
      <p>Six stations. Pick one to see the projects that live there.</p>
      <div className="...">
        {sceneReady ? (
          <Suspense fallback={<WorkshopFallback />}>
            <WorkshopScene active={active} onSelect={onSelect} />
          </Suspense>
        ) : (
          <WorkshopFallback />
        )}
      </div>
      <div role="group" aria-label="Workshop stations" className="...">
        {stations.map((station) => (
          <button key={station.id} type="button" aria-pressed={active === station.id} onClick={() => onSelect(station.id)}>
            <span>{station.label}</span>
            <span>{station.blurb}</span>
          </button>
        ))}
      </div>
    </section>
  )
}
```

Add the `WorkshopSection` above the results grid in `WorkPage`. Clicking the active station again clears the filter (`onSelect(active === station.id ? null : station.id)`), so the six 3D stations behave like the filter buttons.

- [ ] **Step 8: Verify and commit**

Run: `npm run typecheck && npm run build && npx playwright test tests/e2e/work.spec.ts tests/e2e/workshop.spec.ts`
Expected: all pass. Confirm the build output shows a separate `WorkshopScene` chunk.

```bash
git add package.json package-lock.json src/lib/webgl.ts src/components/work/workshop src/pages/WorkPage.tsx tests/e2e/workshop.spec.ts
git commit -m "feat: add the original 3D workshop with static fallback"
```

---

### Task 5: Phase close

**Files:**
- Modify: `docs/superpowers/plans/2026-10-30-portfolio-flagship-03-work-and-case-studies.md` (tick boxes)
- Test: all suites

- [ ] **Step 1: Run the full gate**

```bash
npm run typecheck && npm test && npm run build && npx playwright test
```

Expected: typecheck passes, 12+ unit tests pass, build passes, 62+ Playwright tests pass.

- [ ] **Step 2: Manually check the work page**

At 1440px and 390px, in light and dark:
- Filters show the expected counts.
- The workshop falls back on phones and reduced motion.
- Every card link opens the right case study.
- No horizontal overflow at 320px.

- [ ] **Step 3: Commit and push**

```bash
git add -A
git commit -m "feat: complete the work archive and case studies"
git push
```

Update draft PR #4 with the phase summary and the new verified test counts.
