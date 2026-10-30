# Portfolio Flagship, Plan 1: Foundation

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Turn the single-page site into a working multi-page application with a theme system, a small history router, static route folders for GitHub Pages, and real page shells.

**Architecture:** Keep Vite, React 19, TypeScript and Tailwind 4. Add a pure route table, a React router provider, a theme provider with a pre-paint boot script, and a post-build script that copies `index.html` into every route folder. Existing sections are reused where they still fit; the single-page shell is replaced.

**Tech Stack:** Vite 8, React 19, TypeScript 6, Tailwind CSS 4, Vitest, Playwright, axe-core, Framer Motion.

**Spec:** `docs/superpowers/specs/2026-10-30-portfolio-flagship-design.md`

## Global Constraints

- Node 22.12 or newer. The current machine runs Node 24.
- Site base is `/` because this is the `konethegreat.github.io` user site.
- No em dashes in UI copy, docs or commit messages. Use commas, colons or full stops.
- Light and dark themes. Dark is the default visual direction, light follows the OS until the visitor chooses.
- WCAG 2.2 AA target, visible focus, keyboard operability, reduced-motion support.
- No analytics, cookies, trackers or third-party runtime requests.
- No invented prices. Any service price is quoted in rand after scoping.
- Third-party work is credited by name, source and license.
- Exclude the Mostoeneng performance-management tool and never publish the CV PDF.
- Every visible control must work or be absent.

## File Map

Create:

- `vitest.config.ts`
- `playwright.config.ts`
- `tests/unit/routes.test.ts`
- `tests/unit/theme.test.ts`
- `tests/e2e/routes.spec.ts`
- `src/lib/theme.tsx`
- `src/lib/view-transition.ts`
- `src/lib/routes.ts`
- `src/lib/router.tsx`
- `src/data/routes.json`
- `src/components/ui/link.tsx`
- `src/components/layout/SiteHeader.tsx`
- `src/components/layout/SiteFooter.tsx`
- `src/pages/HomePage.tsx`
- `src/pages/WorkPage.tsx`
- `src/pages/ProjectPage.tsx`
- `src/pages/ServicesPage.tsx`
- `src/pages/AboutPage.tsx`
- `src/pages/PlaygroundPage.tsx`
- `src/pages/ContactPage.tsx`
- `src/pages/CreditsPage.tsx`
- `src/pages/NotFoundPage.tsx`
- `scripts/copy-routes.mjs`

Modify:

- `package.json`
- `index.html`
- `src/index.css`
- `src/main.tsx`
- `src/App.tsx`
- `src/data/projects.ts` (slug alignment and Reservoir entry)
- `.gitignore`

Reuse unchanged:

- `src/components/sections/Lab.tsx` and `src/components/lab/*`
- `src/components/fx/*`
- `src/components/ui/*`
- `src/data/profile.ts`, `experience.ts`, `skills.ts`, `journey.ts`, `gallery.ts`

---

### Task 1: Add the test and tooling safety net

**Files:**
- Modify: `package.json`
- Create: `vitest.config.ts`
- Create: `playwright.config.ts`
- Create: `tests/unit/tooling.test.ts`
- Modify: `.gitignore`

**Interfaces:**
- Produces: `npm run test`, `npm run test:e2e`, Playwright `baseURL` of `http://localhost:4173`.

- [ ] **Step 1: Create the feature branch if it does not exist**

The worktree was created with:

```bash
cd C:/Users/Konet/Portfolio/konethegreat.github.io
git worktree add ../portfolio-flagship -b feat/flagship-v1
```

Verify:

```bash
cd C:/Users/Konet/Portfolio/portfolio-flagship
git branch --show-current
```

Expected: `feat/flagship-v1`

- [ ] **Step 2: Install test dependencies**

```bash
npm install --save-dev vitest @playwright/test @axe-core/playwright sharp tsx
npx playwright install chromium
```

Expected: no errors. Chromium downloads once.

- [ ] **Step 3: Add the scripts**

In `package.json`, set the scripts block to:

```json
"scripts": {
  "dev": "vite --host",
  "build": "tsc --noEmit && vite build && node scripts/copy-routes.mjs",
  "preview": "vite preview --host --port 4173",
  "typecheck": "tsc --noEmit",
  "test": "vitest run",
  "test:watch": "vitest",
  "test:e2e": "npm run build && playwright test",
  "shots": "node scripts/capture-screenshots.mjs",
  "briefs": "tsx scripts/build-briefs.ts"
}
```

`copy-routes.mjs` is created in Task 3. Until then, run `npx tsc --noEmit && npx vite build` directly.

- [ ] **Step 4: Add the Vitest config**

Create `vitest.config.ts`:

```ts
import path from "node:path"
import { defineConfig } from "vitest/config"

export default defineConfig({
  resolve: {
    alias: { "@": path.resolve(import.meta.dirname, "./src") },
  },
  test: {
    environment: "node",
    include: ["tests/unit/**/*.test.ts"],
  },
})
```

- [ ] **Step 5: Add the Playwright config**

Create `playwright.config.ts`:

```ts
import { defineConfig, devices } from "@playwright/test"

export default defineConfig({
  testDir: "tests/e2e",
  timeout: 30_000,
  expect: { timeout: 5_000 },
  fullyParallel: true,
  reporter: [["list"]],
  use: {
    baseURL: "http://localhost:4173",
    trace: "on-first-retry",
  },
  projects: [
    { name: "desktop", use: { ...devices["Desktop Chrome"] } },
    { name: "phone", use: { ...devices["Pixel 7"] } },
  ],
  webServer: {
    command: "npm run preview -- --port 4173",
    url: "http://localhost:4173",
    reuseExistingServer: true,
    timeout: 120_000,
  },
})
```

- [ ] **Step 6: Write the tooling test**

Create `tests/unit/tooling.test.ts`:

```ts
import { describe, expect, it } from "vitest"

describe("tooling", () => {
  it("runs TypeScript tests", () => {
    const value: number = 2 + 2
    expect(value).toBe(4)
  })
})
```

- [ ] **Step 7: Ignore test output**

Append to `.gitignore`:

```text
test-results/
playwright-report/
blob-report/
.playwright/
```

- [ ] **Step 8: Run the test**

```bash
npm test
```

Expected: 1 test file, 1 test passed.

- [ ] **Step 9: Commit**

```bash
git add package.json package-lock.json vitest.config.ts playwright.config.ts tests/unit/tooling.test.ts .gitignore
git commit -m "test: add vitest and playwright tooling"
```

---

### Task 2: Add the theme system and tokens

**Files:**
- Create: `src/lib/theme.tsx`
- Modify: `src/index.css`
- Modify: `src/main.tsx`
- Modify: `index.html`
- Create: `tests/unit/theme.test.ts`

**Interfaces:**
- Produces: `ThemeProvider`, `useTheme(): { choice, resolved, setChoice, toggle }`, `resolveTheme(choice, systemDark)`, `THEME_KEY = "kone-theme"`.
- Produces: CSS tokens for `[data-theme="dark"]`, `[data-theme="light"]` and the `.theme-dark` scope.

- [ ] **Step 1: Write the failing theme test**

Create `tests/unit/theme.test.ts`:

```ts
import { describe, expect, it } from "vitest"
import { resolveTheme } from "@/lib/theme"

describe("resolveTheme", () => {
  it("follows the system when the choice is system", () => {
    expect(resolveTheme("system", true)).toBe("dark")
    expect(resolveTheme("system", false)).toBe("light")
  })

  it("uses an explicit choice over the system", () => {
    expect(resolveTheme("light", true)).toBe("light")
    expect(resolveTheme("dark", false)).toBe("dark")
  })
})
```

- [ ] **Step 2: Run it to verify it fails**

```bash
npm test -- tests/unit/theme.test.ts
```

Expected: FAIL because `@/lib/theme` does not exist.

- [ ] **Step 3: Implement the theme provider**

Create `src/lib/theme.tsx`:

```tsx
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react"

export type ThemeChoice = "light" | "dark" | "system"
export type ResolvedTheme = "light" | "dark"

export const THEME_KEY = "kone-theme"

export function resolveTheme(choice: ThemeChoice, systemDark: boolean): ResolvedTheme {
  if (choice === "system") return systemDark ? "dark" : "light"
  return choice
}

interface ThemeValue {
  choice: ThemeChoice
  resolved: ResolvedTheme
  setChoice: (choice: ThemeChoice) => void
  toggle: () => void
}

const ThemeContext = createContext<ThemeValue | null>(null)

function readChoice(): ThemeChoice {
  const saved = localStorage.getItem(THEME_KEY)
  return saved === "light" || saved === "dark" || saved === "system" ? saved : "system"
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [choice, setChoiceState] = useState<ThemeChoice>(readChoice)
  const [systemDark, setSystemDark] = useState(
    () => window.matchMedia("(prefers-color-scheme: dark)").matches,
  )

  useEffect(() => {
    const query = window.matchMedia("(prefers-color-scheme: dark)")
    const onChange = (event: MediaQueryListEvent) => setSystemDark(event.matches)
    query.addEventListener("change", onChange)
    return () => query.removeEventListener("change", onChange)
  }, [])

  const resolved = resolveTheme(choice, systemDark)

  useEffect(() => {
    document.documentElement.dataset.theme = resolved
    document.documentElement.style.colorScheme = resolved
    localStorage.setItem(THEME_KEY, choice)
  }, [choice, resolved])

  const setChoice = useCallback((next: ThemeChoice) => setChoiceState(next), [])
  const toggle = useCallback(() => {
    setChoiceState((current) =>
      resolveTheme(current, systemDark) === "dark" ? "light" : "dark",
    )
  }, [systemDark])

  const value = useMemo(
    () => ({ choice, resolved, setChoice, toggle }),
    [choice, resolved, setChoice, toggle],
  )

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}

export function useTheme(): ThemeValue {
  const value = useContext(ThemeContext)
  if (!value) throw new Error("useTheme must be used inside ThemeProvider")
  return value
}
```

- [ ] **Step 4: Install the display and editorial fonts**

```bash
npm install @fontsource/archivo-black @fontsource/instrument-serif
```

- [ ] **Step 5: Replace the token block in `src/index.css`**

Replace everything above the first `@keyframes` with:

```css
@import "tailwindcss";

:root {
  --radius: 0.875rem;
}

[data-theme="dark"],
.theme-dark {
  color-scheme: dark;
  --background: #0b0b0f;
  --foreground: #ece7dd;
  --card: #14131a;
  --card-foreground: #ece7dd;
  --popover: #14131a;
  --popover-foreground: #ece7dd;
  --primary: #d8a24a;
  --primary-foreground: #1a1206;
  --secondary: #1e1c24;
  --secondary-foreground: #ece7dd;
  --muted: #1a1820;
  --muted-foreground: #a9a296;
  --accent: #26212a;
  --accent-foreground: #f5efe4;
  --destructive: #d96b5f;
  --destructive-foreground: #1a0605;
  --border: rgb(242 234 220 / 0.12);
  --input: rgb(242 234 220 / 0.18);
  --ring: #d8a24a;
  --paper: #f2eadc;
  --glass: rgb(20 19 26 / 0.55);
  --grad: linear-gradient(100deg, #d8a24a 0%, #c0653b 55%, #2f7a72 100%);
}

[data-theme="light"] {
  color-scheme: light;
  --background: #f4efe6;
  --foreground: #1a1815;
  --card: #fffbf3;
  --card-foreground: #1a1815;
  --popover: #fffbf3;
  --popover-foreground: #1a1815;
  --primary: #9a6a1f;
  --primary-foreground: #fffaf0;
  --secondary: #ece5d8;
  --secondary-foreground: #1a1815;
  --muted: #e9e1d3;
  --muted-foreground: #5e574c;
  --accent: #e3d8c7;
  --accent-foreground: #1a1815;
  --destructive: #a24b2a;
  --destructive-foreground: #fffaf0;
  --border: rgb(26 24 21 / 0.12);
  --input: rgb(26 24 21 / 0.18);
  --ring: #9a6a1f;
  --paper: #fffbf3;
  --glass: rgb(255 251 243 / 0.62);
  --grad: linear-gradient(100deg, #9a6a1f 0%, #a24b2a 55%, #25645e 100%);
}

@theme inline {
  --font-sans: "Inter Variable", ui-sans-serif, system-ui, -apple-system, "Segoe UI", sans-serif;
  --font-display: "Archivo Black", "Inter Variable", ui-sans-serif, system-ui, sans-serif;
  --font-serif: "Instrument Serif", Georgia, "Times New Roman", serif;
  --font-mono: "JetBrains Mono Variable", ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;

  --color-background: var(--background);
  --color-foreground: var(--foreground);
  --color-card: var(--card);
  --color-card-foreground: var(--card-foreground);
  --color-popover: var(--popover);
  --color-popover-foreground: var(--popover-foreground);
  --color-primary: var(--primary);
  --color-primary-foreground: var(--primary-foreground);
  --color-secondary: var(--secondary);
  --color-secondary-foreground: var(--secondary-foreground);
  --color-muted: var(--muted);
  --color-muted-foreground: var(--muted-foreground);
  --color-accent: var(--accent);
  --color-accent-foreground: var(--accent-foreground);
  --color-destructive: var(--destructive);
  --color-destructive-foreground: var(--destructive-foreground);
  --color-border: var(--border);
  --color-input: var(--input);
  --color-ring: var(--ring);

  --radius-sm: calc(var(--radius) - 6px);
  --radius-md: calc(var(--radius) - 3px);
  --radius-lg: var(--radius);
  --radius-xl: calc(var(--radius) + 6px);
  --radius-2xl: calc(var(--radius) + 12px);
}
```

Keep the existing keyframes and utility classes below this block. Then replace any `bg-[#05060d]`, `text-[#05060d]`, `bg-[#0a0d1b]` and `border-white/…` classes in reused UI primitives with token classes during the page builds. The AI Lab keeps a deliberate `.theme-dark` wrapper, so its dark instrument look survives the light theme.

- [ ] **Step 6: Import the fonts and provider**

In `src/main.tsx`, replace the Space Grotesk import with:

```ts
import "@fontsource/archivo-black/400.css"
import "@fontsource/instrument-serif/400.css"
import "@fontsource/instrument-serif/400-italic.css"
```

Wrap the app:

```tsx
import { ThemeProvider } from "./lib/theme"

createRoot(root).render(
  <StrictMode>
    <ThemeProvider>
      <App />
    </ThemeProvider>
  </StrictMode>,
)
```

- [ ] **Step 7: Add the pre-paint boot script**

In `index.html`, inside `<head>` and before the `<style>` block, add:

```html
<script>
  (function () {
    try {
      var choice = localStorage.getItem("kone-theme") || "system";
      var dark = choice === "dark" || (choice === "system" && window.matchMedia("(prefers-color-scheme: dark)").matches);
      var theme = dark ? "dark" : "light";
      document.documentElement.dataset.theme = theme;
      document.documentElement.style.colorScheme = theme;
    } catch (error) {}
  })();
</script>
```

Remove `color-scheme: dark` from the `<meta name="color-scheme">` tag and set it to `light dark`. Update the inline fallback styles to use `background: #0b0b0f; color: #ece7dd;` so a no-JavaScript reader still sees the dark default.

- [ ] **Step 8: Run the test and typecheck**

```bash
npm test
npm run typecheck
```

Expected: both pass.

- [ ] **Step 9: Commit**

```bash
git add src/lib/theme.tsx src/index.css src/main.tsx index.html package.json package-lock.json tests/unit/theme.test.ts
git commit -m "feat: add light and dark theme system"
```

---

### Task 3: Add routes, the router and static route folders

**Files:**
- Create: `src/data/routes.json`
- Create: `src/lib/routes.ts`
- Create: `src/lib/view-transition.ts`
- Create: `src/lib/router.tsx`
- Create: `src/components/ui/link.tsx`
- Create: `scripts/copy-routes.mjs`
- Create: `tests/unit/routes.test.ts`
- Modify: `src/data/projects.ts` (align `k-one` slug and add Reservoir)
- Modify: `package.json` (build script already points at the copy script)

**Interfaces:**
- `matchRoute(pathname: string): RouteRecord | null`, where a project match adds `params.slug`.
- `routeMeta(pathname: string): { title: string; description: string }`.
- `RouterProvider`, `useRouter(): { path, navigate }`, `Link({ to, ...anchorProps })`.
- `withViewTransition(update: () => void): void`.

- [ ] **Step 1: Write the failing route tests**

Create `tests/unit/routes.test.ts`:

```ts
import { describe, expect, it } from "vitest"
import { matchRoute, routeMeta } from "@/lib/routes"

describe("matchRoute", () => {
  it("matches the home route", () => {
    expect(matchRoute("/")?.path).toBe("/")
  })

  it("ignores a trailing slash", () => {
    expect(matchRoute("/work/")?.path).toBe("/work")
  })

  it("captures a project slug", () => {
    expect(matchRoute("/work/vigil")?.params.slug).toBe("vigil")
  })

  it("returns null for an unknown project", () => {
    expect(matchRoute("/work/nope")).toBeNull()
  })
})

describe("routeMeta", () => {
  it("returns a title and description", () => {
    const meta = routeMeta("/services")
    expect(meta.title).toContain("Services")
    expect(meta.description.length).toBeGreaterThan(20)
  })
})
```

- [ ] **Step 2: Run it to verify it fails**

```bash
npm test -- tests/unit/routes.test.ts
```

Expected: FAIL because `@/lib/routes` does not exist.

- [ ] **Step 3: Create the route table**

Create `src/data/routes.json`:

```json
[
  { "path": "/", "title": "Kone Tshivhinda · AI systems engineer · Johannesburg", "description": "The portfolio of Kone Tshivhinda, an AI systems engineer and full-stack developer in Johannesburg. Agent systems, retrieval, local-first AI and product engineering, with live work and technical briefs." },
  { "path": "/work", "title": "Work · Kone Tshivhinda", "description": "Eight case studies across AI agents, legal tech, civic tech, local-first software and the K-ONE studio, each with live and source links." },
  { "path": "/work/vigil", "title": "Vigil · Kone Tshivhinda", "description": "Sovereign operational intelligence for Africa: governed evidence, analyst sign-off and a locally verifiable audit chain." },
  { "path": "/work/clearcut", "title": "ClearCut · Kone Tshivhinda", "description": "Agent-native invoicing for South Africa: a Rust core, REST API, MCP server and Claude plugin with tested VAT rules." },
  { "path": "/work/timelex", "title": "TimeLex · Kone Tshivhinda", "description": "Open, API-first legal practice management with an autonomy ladder, bring-your-own keys and a threat model." },
  { "path": "/work/sa-jas", "title": "SA-JAS · Kone Tshivhinda", "description": "A desktop job agent suite that finds South African vacancies, tailors applications and leaves the final submit to the person." },
  { "path": "/work/munisolve", "title": "MuniSolve ZA · Kone Tshivhinda", "description": "Municipal fault reporting with citizen and admin workflows, a live heat map and a rate-limited assistant." },
  { "path": "/work/reservoir", "title": "Reservoir · Kone Tshivhinda", "description": "A free, open, community-grown memory of South African culture with community-controlled consent and a mission-native AI." },
  { "path": "/work/ui-vault", "title": "UI Vault · Kone Tshivhinda", "description": "A provenance-first index of UI and UX patterns with live demos, an API, a CLI and a read-only MCP server." },
  { "path": "/work/k-one", "title": "K-ONE IT SOLUTIONS · Kone Tshivhinda", "description": "An independent software studio in Johannesburg building AI systems, web and mobile apps, and cloud infrastructure." },
  { "path": "/services", "title": "Services · Kone Tshivhinda", "description": "Six ways to work together: agent systems, retrieval, product engineering, local-first AI, cloud delivery, and technical audits." },
  { "path": "/about", "title": "About · Kone Tshivhinda", "description": "The path from IBM coursework and K-ONE to legal-tech platforms, civic software and sovereign AI systems in Johannesburg." },
  { "path": "/playground", "title": "Playground · Kone Tshivhinda", "description": "Working models of agents, hybrid retrieval and autonomy, plus the UI Vault shelf." },
  { "path": "/contact", "title": "Contact · Kone Tshivhinda", "description": "Start a project or a conversation. Email, LinkedIn, GitHub and availability." },
  { "path": "/credits", "title": "Credits and licenses · Kone Tshivhinda", "description": "Third-party components, fonts and libraries used by this site, with authors, sources and licenses." }
]
```

- [ ] **Step 4: Implement the pure route helpers**

Create `src/lib/routes.ts`:

```ts
import routes from "@/data/routes.json"

export interface RouteRecord {
  path: string
  title: string
  description: string
  params: Record<string, string>
}

const records = routes as Array<{ path: string; title: string; description: string }>

export function normalizePath(pathname: string): string {
  const clean = pathname.split("?")[0].split("#")[0].replace(/\/+$/, "")
  return clean === "" ? "/" : clean
}

export function matchRoute(pathname: string): RouteRecord | null {
  const clean = normalizePath(pathname)
  const parts = clean.split("/").filter(Boolean)

  for (const record of records) {
    const pattern = record.path.split("/").filter(Boolean)
    if (pattern.length !== parts.length) continue
    const params: Record<string, string> = {}
    let matched = true
    for (let i = 0; i < pattern.length; i++) {
      const segment = pattern[i]
      if (segment.startsWith(":")) {
        params[segment.slice(1)] = decodeURIComponent(parts[i])
      } else if (segment !== parts[i]) {
        matched = false
        break
      }
    }
    if (matched) return { ...record, params }
  }
  return null
}

export function routeMeta(pathname: string): { title: string; description: string } {
  const match = matchRoute(pathname)
  if (match) return { title: match.title, description: match.description }
  return {
    title: "Not found · Kone Tshivhinda",
    description: "That page does not exist. Return to the work or the home page.",
  }
}
```

Note: the JSON paths are concrete project paths, not `:slug` patterns. The matcher above still works because the paths are exact. It also supports a future `:slug` pattern. The test for `/work/nope` returns null as expected.

- [ ] **Step 5: Add the view transition helper**

Create `src/lib/view-transition.ts`:

```ts
declare global {
  interface Document {
    startViewTransition?: (callback: () => void) => { finished: Promise<void> }
  }
}

export function withViewTransition(update: () => void) {
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches
  if (!reduced && typeof document.startViewTransition === "function") {
    document.startViewTransition(update)
    return
  }
  update()
}
```

- [ ] **Step 6: Implement the router**

Create `src/lib/router.tsx`:

```tsx
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react"
import { matchRoute, normalizePath, routeMeta } from "@/lib/routes"
import { withViewTransition } from "@/lib/view-transition"

interface RouterValue {
  path: string
  navigate: (to: string, options?: { replace?: boolean }) => void
}

const RouterContext = createContext<RouterValue | null>(null)

function currentPath() {
  return normalizePath(window.location.pathname)
}

export function RouterProvider({ children }: { children: ReactNode }) {
  const [path, setPath] = useState(currentPath)

  useEffect(() => {
    const onPop = () => setPath(currentPath())
    window.addEventListener("popstate", onPop)
    return () => window.removeEventListener("popstate", onPop)
  }, [])

  useEffect(() => {
    const meta = routeMeta(path)
    document.title = meta.title
    const description = document.querySelector('meta[name="description"]')
    if (description) description.setAttribute("content", meta.description)

    const hash = window.location.hash.slice(1)
    if (hash) {
      requestAnimationFrame(() => document.getElementById(hash)?.scrollIntoView())
    } else {
      window.scrollTo(0, 0)
      const main = document.getElementById("main")
      if (main && !main.contains(document.activeElement)) main.focus()
    }
  }, [path])

  const navigate = useCallback((to: string, options?: { replace?: boolean }) => {
    const url = new URL(to, window.location.origin)
    const next = normalizePath(url.pathname)
    if (next === currentPath() && url.hash === window.location.hash) return
    withViewTransition(() => {
      if (options?.replace) window.history.replaceState(null, "", url)
      else window.history.pushState(null, "", url)
      setPath(next)
    })
  }, [])

  const value = useMemo(() => ({ path, navigate }), [path, navigate])
  return <RouterContext.Provider value={value}>{children}</RouterContext.Provider>
}

export function useRouter(): RouterValue {
  const value = useContext(RouterContext)
  if (!value) throw new Error("useRouter must be used inside RouterProvider")
  return value
}

export function useRouteMatch() {
  const { path } = useRouter()
  return matchRoute(path)
}
```

- [ ] **Step 7: Add the internal Link**

Create `src/components/ui/link.tsx`:

```tsx
import type { AnchorHTMLAttributes, MouseEvent } from "react"
import { useRouter } from "@/lib/router"
import { matchRoute } from "@/lib/routes"

interface LinkProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  to: string
}

export function Link({ to, onClick, children, ...props }: LinkProps) {
  const { navigate } = useRouter()
  const target = to.split("#")[0]
  const internal = to.startsWith("/") && matchRoute(target) !== null

  const handleClick = (event: MouseEvent<HTMLAnchorElement>) => {
    onClick?.(event)
    if (!internal || event.defaultPrevented) return
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0) return
    event.preventDefault()
    navigate(to)
  }

  return (
    <a href={to} onClick={handleClick} {...props}>
      {children}
    </a>
  )
}
```

- [ ] **Step 8: Add the static route copy script**

Create `scripts/copy-routes.mjs`:

```js
import { mkdir, readFile, writeFile } from "node:fs/promises"
import { dirname, join } from "node:path"

const dist = "dist"
const routes = JSON.parse(await readFile("src/data/routes.json", "utf8"))
const html = await readFile(join(dist, "index.html"), "utf8")

for (const route of routes) {
  const target = route.path === "/" ? join(dist, "index.html") : join(dist, route.path, "index.html")
  await mkdir(dirname(target), { recursive: true })
  await writeFile(target, html)
}

await writeFile(join(dist, "404.html"), html)
console.log(`Copied index.html into ${routes.length} route folders and 404.html`)
```

- [ ] **Step 9: Align the project data with the new routes**

In `src/data/projects.ts`:

1. Change the K-ONE entry slug from `k-one-website` to `k-one`.
2. Add this project after the MuniSolve entry:

```ts
{
  slug: "reservoir",
  title: "Reservoir",
  kicker: "A community memory of South African culture",
  period: "Oct 2026",
  group: "web-civic",
  home: "konethegreat",
  role: "Solo build",
  access: "live",
  status: { label: "Live", tone: "live" },
  featured: true,
  pitch:
    "A free, open, community-grown memory of South African culture: plants, practices and languages, with community-controlled consent and a mission-native AI.",
  highlights: [
    "Offline-first data capture with a Rust core API, a provider-agnostic Python AI layer and a mobile client.",
    "Knowledge sovereignty is modelled explicitly: communities control consent, attribution and reuse.",
    "Architecture decisions and safety notes are published in the repository.",
  ],
  stack: ["Rust", "Python", "TypeScript", "SQLite", "PostgreSQL"],
  links: [
    { label: "Open live site", href: "https://konethegreat.github.io/reservoir/", kind: "live" },
    { label: "Source on GitHub", href: `${GH}/reservoir`, kind: "code" },
  ],
  tags: ["Civic", "Culture", "Local-first", "AI"],
},
```

3. Set `featured: true` on SA-JAS if it is not already, and leave Diary unfeatured so the six featured projects are Vigil, ClearCut, TimeLex, SA-JAS, MuniSolve and Reservoir.

- [ ] **Step 10: Run the tests and build**

```bash
npm test
npm run typecheck
npm run build
```

Expected: tests pass, typecheck passes, and these files exist:

```bash
ls dist/work/vigil/index.html dist/work/k-one/index.html dist/index.html dist/404.html
```

- [ ] **Step 11: Commit**

```bash
git add src/data/routes.json src/lib/routes.ts src/lib/view-transition.ts src/lib/router.tsx src/components/ui/link.tsx scripts/copy-routes.mjs tests/unit/routes.test.ts src/data/projects.ts
git commit -m "feat: add multipage routing and static route folders"
```

---

### Task 4: Replace the single-page shell with routed pages

**Files:**
- Modify: `src/App.tsx`
- Create: `src/components/layout/SiteHeader.tsx`
- Create: `src/components/layout/SiteFooter.tsx`
- Create: `src/pages/HomePage.tsx`
- Create: `src/pages/WorkPage.tsx`
- Create: `src/pages/ProjectPage.tsx`
- Create: `src/pages/ServicesPage.tsx`
- Create: `src/pages/AboutPage.tsx`
- Create: `src/pages/PlaygroundPage.tsx`
- Create: `src/pages/ContactPage.tsx`
- Create: `src/pages/CreditsPage.tsx`
- Create: `src/pages/NotFoundPage.tsx`
- Create: `tests/e2e/routes.spec.ts`

**Interfaces:**
- `App` renders `ThemeProvider`, `RouterProvider`, header, `#main`, footer.
- `ProjectPage` consumes `useRouteMatch()` and `projectBySlug(params.slug)`.
- `HomePage` exposes one `h1` with the name.

- [ ] **Step 1: Write the route smoke test**

Create `tests/e2e/routes.spec.ts`:

```ts
import { test, expect } from "@playwright/test"

const routes = [
  "/",
  "/work",
  "/work/vigil",
  "/work/clearcut",
  "/work/timelex",
  "/work/sa-jas",
  "/work/munisolve",
  "/work/reservoir",
  "/work/ui-vault",
  "/work/k-one",
  "/services",
  "/about",
  "/playground",
  "/contact",
  "/credits",
]

for (const path of routes) {
  test(`renders ${path} with one heading`, async ({ page }) => {
    const response = await page.goto(path)
    expect(response?.status()).toBe(200)
    await expect(page.locator("h1")).toBeVisible()
  })
}

test("unknown paths render the 404 page", async ({ page }) => {
  await page.goto("/this-does-not-exist")
  await expect(page.getByRole("heading", { level: 1 })).toContainText("not here")
})
```

- [ ] **Step 2: Build the header and footer**

Create `src/components/layout/SiteHeader.tsx`:

```tsx
import { Moon, Sun } from "lucide-react"
import { Link } from "@/components/ui/link"
import { navItems } from "@/data/nav"
import { useTheme } from "@/lib/theme"

export function SiteHeader() {
  const { resolved, toggle } = useTheme()
  return (
    <header className="sticky top-0 z-40 border-b border-border/60 bg-background/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <Link to="/" className="font-display text-sm uppercase tracking-[0.18em]">
          Kone Tshivhinda
        </Link>
        <nav aria-label="Primary" className="hidden items-center gap-1 md:flex">
          {navItems.map((item) => (
            <Link
              key={item.id}
              to={item.id === "home" ? "/" : `/${item.id}`}
              className="rounded-full px-3 py-2 text-sm text-muted-foreground transition hover:bg-accent hover:text-foreground"
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={toggle}
            aria-label={`Switch to ${resolved === "dark" ? "light" : "dark"} theme`}
            className="inline-flex size-10 items-center justify-center rounded-full border border-border text-muted-foreground transition hover:text-foreground"
          >
            {resolved === "dark" ? <Sun className="size-4" /> : <Moon className="size-4" />}
          </button>
          <Link
            to="/contact"
            className="rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground"
          >
            Start a project
          </Link>
        </div>
      </div>
    </header>
  )
}
```

Update `src/data/nav.ts` so the six destinations are Home, Work, Services, About, Playground, Contact:

```ts
export const navItems = [
  { id: "home", label: "Home" },
  { id: "work", label: "Work" },
  { id: "services", label: "Services" },
  { id: "about", label: "About" },
  { id: "playground", label: "Playground" },
  { id: "contact", label: "Contact" },
] as const

export type NavId = (typeof navItems)[number]["id"]
```

Create `src/components/layout/SiteFooter.tsx`:

```tsx
import { Link } from "@/components/ui/link"
import { links } from "@/data/profile"

export function SiteFooter() {
  return (
    <footer className="border-t border-border/60 py-10">
      <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 text-sm text-muted-foreground sm:px-6 md:flex-row md:items-center md:justify-between lg:px-8">
        <p>© 2026 Kone Tshivhinda. Built in Johannesburg.</p>
        <div className="flex flex-wrap items-center gap-4">
          <a href={links.github} rel="noopener noreferrer" target="_blank" className="hover:text-foreground">
            GitHub
          </a>
          <a href={links.linkedin} rel="noopener noreferrer" target="_blank" className="hover:text-foreground">
            LinkedIn
          </a>
          <Link to="/credits" className="hover:text-foreground">
            Credits
          </Link>
        </div>
      </div>
    </footer>
  )
}
```

- [ ] **Step 3: Create the page shells**

Create `src/pages/HomePage.tsx`:

```tsx
import { Link } from "@/components/ui/link"
import { aboutParagraphs, stats } from "@/data/profile"
import { featuredProjects } from "@/data/projects"

export function HomePage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <p className="font-mono text-xs uppercase tracking-[0.22em] text-primary">
        AI systems engineer · Johannesburg
      </p>
      <h1 className="mt-4 font-display text-5xl uppercase leading-[0.9] sm:text-7xl lg:text-8xl">
        Kone Tshivhinda
      </h1>
      <p className="mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground">{aboutParagraphs[0]}</p>
      <div className="mt-8 flex flex-wrap gap-3">
        <Link to="/work" className="rounded-full bg-primary px-5 py-3 font-semibold text-primary-foreground">
          Open the work
        </Link>
        <Link to="/contact" className="rounded-full border border-border px-5 py-3 font-semibold">
          Start a project
        </Link>
      </div>
      <dl className="mt-14 grid grid-cols-2 gap-4 sm:grid-cols-4">
        {stats.map((stat) => (
          <div key={stat.label} className="rounded-2xl border border-border bg-card p-4">
            <dt className="text-xs text-muted-foreground">{stat.label}</dt>
            <dd className="mt-1 font-display text-3xl">{stat.value}</dd>
          </div>
        ))}
      </dl>
      <section aria-labelledby="featured-title" className="mt-16">
        <h2 id="featured-title" className="font-serif text-3xl">
          Featured work
        </h2>
        <ul className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {featuredProjects.map((project) => (
            <li key={project.slug} className="rounded-2xl border border-border bg-card p-5">
              <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-primary">{project.status.label}</p>
              <h3 className="mt-2 text-xl font-semibold">
                <Link to={`/work/${project.slug}`}>{project.title}</Link>
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{project.pitch}</p>
            </li>
          ))}
        </ul>
      </section>
    </div>
  )
}
```

Create `src/pages/WorkPage.tsx`:

```tsx
import { Link } from "@/components/ui/link"
import { archiveProjects, featuredProjects } from "@/data/projects"
import { StatusBadge } from "@/components/ui/status-badge"

export function WorkPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <h1 className="font-display text-5xl uppercase sm:text-7xl">Work</h1>
      <p className="mt-4 max-w-2xl text-lg text-muted-foreground">
        Eight case studies across AI agents, legal tech, civic tech and the studio.
      </p>
      <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {featuredProjects.map((project) => (
          <li key={project.slug} className="rounded-2xl border border-border bg-card p-5">
            <StatusBadge status={project.status} />
            <h2 className="mt-3 text-2xl font-semibold">
              <Link to={`/work/${project.slug}`}>{project.title}</Link>
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{project.pitch}</p>
            <div className="mt-4 flex flex-wrap gap-2 text-sm">
              {project.links.map((link) => (
                <a key={link.href} href={link.href} target="_blank" rel="noopener noreferrer" className="underline underline-offset-4">
                  {link.label}
                </a>
              ))}
            </div>
          </li>
        ))}
      </ul>
      <h2 className="mt-16 font-serif text-3xl">Archive</h2>
      <ul className="mt-4 divide-y divide-border">
        {archiveProjects.map((project) => (
          <li key={project.slug} className="flex flex-wrap items-center justify-between gap-3 py-4">
            <div>
              <p className="font-semibold">{project.title}</p>
              <p className="text-sm text-muted-foreground">{project.kicker}</p>
            </div>
            <StatusBadge status={project.status} />
          </li>
        ))}
      </ul>
    </div>
  )
}
```

If `StatusBadge` does not accept a `status` prop, read `src/components/ui/status-badge.tsx` and use its existing API, or render a plain span. Do not change the component in this task.

Create `src/pages/ProjectPage.tsx`:

```tsx
import { Link } from "@/components/ui/link"
import { projectBySlug } from "@/data/projects"
import { useRouteMatch } from "@/lib/router"
import { NotFoundPage } from "./NotFoundPage"

export function ProjectPage() {
  const match = useRouteMatch()
  const slug = match?.params.slug ?? ""
  const project = projectBySlug(slug)
  if (!project) return <NotFoundPage />

  return (
    <article className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
      <Link to="/work" className="text-sm text-muted-foreground hover:text-foreground">
        Back to work
      </Link>
      <p className="mt-8 font-mono text-xs uppercase tracking-[0.2em] text-primary">{project.status.label}</p>
      <h1 className="mt-3 font-display text-5xl uppercase leading-[0.95] sm:text-7xl">{project.title}</h1>
      <p className="mt-3 text-xl text-muted-foreground">{project.kicker}</p>
      <p className="mt-6 text-lg leading-relaxed">{project.pitch}</p>
      <ul className="mt-8 space-y-3">
        {project.highlights.map((highlight) => (
          <li key={highlight} className="border-l-2 border-primary/50 pl-4 text-muted-foreground">
            {highlight}
          </li>
        ))}
      </ul>
      <div className="mt-8 flex flex-wrap gap-2">
        {project.stack.map((item) => (
          <span key={item} className="rounded-full border border-border px-3 py-1 text-sm">
            {item}
          </span>
        ))}
      </div>
      <div className="mt-8 flex flex-wrap gap-4">
        {project.links.map((link) => (
          <a key={link.href} href={link.href} target="_blank" rel="noopener noreferrer" className="font-semibold underline underline-offset-4">
            {link.label}
          </a>
        ))}
      </div>
      {project.note ? <p className="mt-8 rounded-xl border border-border bg-card p-4 text-sm text-muted-foreground">{project.note}</p> : null}
    </article>
  )
}
```

Create `src/pages/ServicesPage.tsx`:

```tsx
export function ServicesPage() {
  const offers = [
    "Agent systems",
    "Knowledge and retrieval",
    "Product engineering",
    "Sovereign and local-first AI",
    "Cloud delivery and operations",
    "Technical audits and documentation",
  ]
  return (
    <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6 lg:px-8">
      <h1 className="font-display text-5xl uppercase sm:text-7xl">Services</h1>
      <p className="mt-4 max-w-2xl text-lg text-muted-foreground">
        Six ways to work together. Scoped in a short conversation, quoted in rand.
      </p>
      <ul className="mt-10 grid gap-4 sm:grid-cols-2">
        {offers.map((offer) => (
          <li key={offer} className="rounded-2xl border border-border bg-card p-6 text-xl font-semibold">
            {offer}
          </li>
        ))}
      </ul>
    </div>
  )
}
```

Create `src/pages/AboutPage.tsx`:

```tsx
import { aboutParagraphs, principles } from "@/data/profile"

export function AboutPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
      <h1 className="font-display text-5xl uppercase sm:text-7xl">About</h1>
      {aboutParagraphs.map((paragraph, index) => (
        <p key={paragraph} className={index === 0 ? "mt-6 text-xl leading-relaxed" : "mt-4 text-lg leading-relaxed text-muted-foreground"}>
          {paragraph}
        </p>
      ))}
      <h2 className="mt-12 font-serif text-3xl">Principles</h2>
      <ul className="mt-6 grid gap-4 sm:grid-cols-2">
        {principles.map((principle) => (
          <li key={principle.id} className="rounded-2xl border border-border bg-card p-5">
            <h3 className="font-semibold">{principle.title}</h3>
            <p className="mt-1 text-sm text-muted-foreground">{principle.body}</p>
          </li>
        ))}
      </ul>
    </div>
  )
}
```

Create `src/pages/PlaygroundPage.tsx`:

```tsx
import { Lab } from "@/components/sections/Lab"

export function PlaygroundPage() {
  return (
    <div className="theme-dark bg-background text-foreground">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <h1 className="font-display text-5xl uppercase sm:text-7xl">Playground</h1>
        <p className="mt-4 max-w-2xl text-lg text-muted-foreground">
          Working models of agents, retrieval and autonomy. Real parts are labelled real. Scripted parts are labelled scripted.
        </p>
      </div>
      <Lab />
    </div>
  )
}
```

Create `src/pages/ContactPage.tsx`:

```tsx
import { buildEmail, links } from "@/data/profile"

export function ContactPage() {
  const email = buildEmail()
  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
      <h1 className="font-display text-5xl uppercase sm:text-7xl">Contact</h1>
      <p className="mt-4 text-lg text-muted-foreground">
        Tell me the problem, the deadline and the constraints. If there is an existing codebase, say so.
      </p>
      <a href={`mailto:${email}`} className="mt-8 inline-block rounded-full bg-primary px-6 py-3 font-semibold text-primary-foreground">
        {email}
      </a>
      <ul className="mt-8 space-y-3 text-lg">
        <li><a href={links.linkedin} target="_blank" rel="noopener noreferrer" className="underline underline-offset-4">LinkedIn</a></li>
        <li><a href={links.github} target="_blank" rel="noopener noreferrer" className="underline underline-offset-4">GitHub</a></li>
        <li><a href={links.credly} target="_blank" rel="noopener noreferrer" className="underline underline-offset-4">Credly badges</a></li>
      </ul>
    </div>
  )
}
```

Create `src/pages/CreditsPage.tsx`:

```tsx
const credits = [
  { name: "React", license: "MIT", href: "https://react.dev" },
  { name: "Vite", license: "MIT", href: "https://vite.dev" },
  { name: "Tailwind CSS", license: "MIT", href: "https://tailwindcss.com" },
  { name: "Framer Motion", license: "MIT", href: "https://www.framer.com/motion/" },
  { name: "Radix UI", license: "MIT", href: "https://www.radix-ui.com" },
  { name: "lucide", license: "ISC", href: "https://lucide.dev" },
]

export function CreditsPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
      <h1 className="font-display text-5xl uppercase sm:text-7xl">Credits</h1>
      <p className="mt-4 text-lg text-muted-foreground">
        Third-party work used by this site, with source and license. Components adapted from the UI Vault are credited here and beside where they appear.
      </p>
      <ul className="mt-8 divide-y divide-border">
        {credits.map((credit) => (
          <li key={credit.name} className="flex flex-wrap items-center justify-between gap-2 py-4">
            <a href={credit.href} target="_blank" rel="noopener noreferrer" className="font-semibold underline underline-offset-4">
              {credit.name}
            </a>
            <span className="text-sm text-muted-foreground">{credit.license}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}
```

Create `src/pages/NotFoundPage.tsx`:

```tsx
import { Link } from "@/components/ui/link"

export function NotFoundPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-24 text-center sm:px-6 lg:px-8">
      <p className="font-mono text-xs uppercase tracking-[0.22em] text-primary">404</p>
      <h1 className="mt-4 font-display text-5xl uppercase sm:text-7xl">This page is not here</h1>
      <p className="mt-4 text-lg text-muted-foreground">
        The address may have changed. The work and the home page are good places to continue.
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Link to="/" className="rounded-full bg-primary px-5 py-3 font-semibold text-primary-foreground">Home</Link>
        <Link to="/work" className="rounded-full border border-border px-5 py-3 font-semibold">Work</Link>
      </div>
    </div>
  )
}
```

- [ ] **Step 4: Replace the app shell**

Replace `src/App.tsx` with:

```tsx
import { SiteFooter } from "@/components/layout/SiteFooter"
import { SiteHeader } from "@/components/layout/SiteHeader"
import { RouterProvider, useRouteMatch } from "@/lib/router"
import { AboutPage } from "@/pages/AboutPage"
import { ContactPage } from "@/pages/ContactPage"
import { CreditsPage } from "@/pages/CreditsPage"
import { HomePage } from "@/pages/HomePage"
import { NotFoundPage } from "@/pages/NotFoundPage"
import { PlaygroundPage } from "@/pages/PlaygroundPage"
import { ProjectPage } from "@/pages/ProjectPage"
import { ServicesPage } from "@/pages/ServicesPage"
import { WorkPage } from "@/pages/WorkPage"

function RouteView() {
  const match = useRouteMatch()
  if (!match) return <NotFoundPage />
  switch (match.path) {
    case "/":
      return <HomePage />
    case "/work":
      return <WorkPage />
    case "/services":
      return <ServicesPage />
    case "/about":
      return <AboutPage />
    case "/playground":
      return <PlaygroundPage />
    case "/contact":
      return <ContactPage />
    case "/credits":
      return <CreditsPage />
    default:
      return match.path.startsWith("/work/") ? <ProjectPage /> : <NotFoundPage />
  }
}

export default function App() {
  return (
    <RouterProvider>
      <a href="#main" className="skip-link">Skip to content</a>
      <SiteHeader />
      <main id="main" tabIndex={-1} className="min-h-[70vh] outline-none">
        <RouteView />
      </main>
      <SiteFooter />
    </RouterProvider>
  )
}
```

Remove the old `FxProvider` and `ProjectDialogProvider` wrappers for now. The effects switch and palette return in Plan 2.

- [ ] **Step 5: Run the build and the route test**

```bash
npm run typecheck
npm run build
npm run test:e2e -- tests/e2e/routes.spec.ts
```

Expected: every route returns 200 with one visible `h1`, and the unknown path shows the 404 heading.

- [ ] **Step 6: Commit**

```bash
git add src/App.tsx src/components/layout src/pages src/components/ui/status-badge.tsx src/data/nav.ts
git commit -m "feat: replace the single page shell with routed pages"
```

---

### Task 5: Add the accessibility gate and close the phase

**Files:**
- Create: `tests/e2e/a11y.spec.ts`
- Modify: `README.md`

**Interfaces:**
- Produces: `npm run test:e2e` fails on serious or critical axe findings.

- [ ] **Step 1: Add the axe test**

Create `tests/e2e/a11y.spec.ts`:

```ts
import AxeBuilder from "@axe-core/playwright"
import { test, expect } from "@playwright/test"

const routes = ["/", "/work", "/work/vigil", "/services", "/about", "/playground", "/contact", "/credits"]

for (const path of routes) {
  test(`${path} has no serious or critical accessibility findings`, async ({ page }) => {
    await page.goto(path)
    const results = await new AxeBuilder({ page }).analyze()
    const blocking = results.violations.filter(
      (violation) => violation.impact === "serious" || violation.impact === "critical",
    )
    expect(blocking).toEqual([])
  })
}
```

- [ ] **Step 2: Run it**

```bash
npm run test:e2e -- tests/e2e/a11y.spec.ts
```

Expected: pass. If a finding is real, fix the markup. Do not suppress it.

- [ ] **Step 3: Update the README**

Replace the "What is on the page" table with a short section that says the site is now multipage and lists the routes. Keep the existing run commands and add:

```bash
npm test          # unit tests
npm run test:e2e  # build, then Playwright and axe checks
```

- [ ] **Step 4: Full foundation verification**

```bash
npm test
npm run typecheck
npm run build
npm run test:e2e
```

Expected: all pass.

- [ ] **Step 5: Commit and push the foundation**

```bash
git add tests/e2e/a11y.spec.ts README.md
git commit -m "test: add accessibility and route gates"
git push -u origin feat/flagship-v1
```

- [ ] **Step 6: Open a draft pull request**

```bash
gh pr create --draft --title "Portfolio flagship: multipage foundation" --body "Foundation for the portfolio rebuild: theme system, router, static route folders, routed page shells, unit tests and Playwright axe checks. Spec: docs/superpowers/specs/2026-10-30-portfolio-flagship-design.md. Plan: docs/superpowers/plans/2026-10-30-portfolio-flagship-01-foundation.md." --base main
```

Expected: a draft PR URL. Do not merge yet. The site on `main` must stay whole until the rebuild is complete.
