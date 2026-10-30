# Portfolio Flagship, Plan 2: Content, Home and Navigation

> **For the executing agent:** Work on `feat/flagship-v1` in `C:\Users\Konet\Portfolio\portfolio-flagship`.
> Plan 1 (foundation) must be complete and green before this plan starts: theme provider, tokens,
> typed router, static route folders, routed page shells, Vitest and the Playwright axe gate.

**Goal:** Make the site real. Verified live links, typed case-study content, the mascot hero, the
live-project strip, the functional glass folder shelf, and the original circular navigation menu.

**Spec:** `docs/superpowers/specs/2026-10-30-portfolio-flagship-design.md`

---

## Global Constraints

- No em dashes in any user-facing copy. Use commas, colons or parentheses.
- Light is the default theme. Dark is the workshop mode, toggled by the visitor and remembered.
- Brass `#D8A24A` is an accent, never a background for body copy on light.
- Every animation must have a `prefers-reduced-motion` path. Motion never blocks reading.
- All links that leave the site open in a new tab with `rel="noopener noreferrer"`.
- Glassmorphism Folder Cards come from `ui-vault` (MIT). Keep the credit in `src/data/credits.ts`
  and in the folder shelf's visually hidden caption.
- The circumferential menu and 3D workshop are **original implementations**. Credit Kaif UI and
  Evgeny Shilov as inspiration only, never as source.
- Mascot skin is `#6B4229`, beanie `#20302E`, accent `#D8A24A` (spec decision).
- Every live URL below was verified 200 OK on 2026-10-30. Do not invent new ones. If a URL fails
  during verification, leave the project archive-only and note it in the PR.

---

## Verified link table (single source of truth for this plan)

| Project | Slug | Live URL |
| --- | --- | --- |
| Vigil | `vigil` | (none yet, archive only) |
| SA-JAS | `sa-jas` | `https://sajas.pages.dev/` |
| MuniSolve | `munisolve` | `https://munisolve-za.vercel.app/` |
| ClearCut | `clearcut` | `https://145-241-100-85.sslip.io/` |
| TimeLex | `timelex` | `https://timelex-automated-time-tracking.netlify.app/` |
| K-ONE IT Solutions | `k-one` | `https://k-one-it-solutions-website.erictshivhinda.workers.dev/` |
| UI Vault | `ui-vault` | `https://konethegreat.github.io/ui-vault/` |
| Reservoir | `reservoir` | `https://konethegreat.github.io/reservoir/` |

Portfolio itself: `https://konethegreat.github.io/`

---

## Task 1: Content model and verified project data

**Files**

- `src/data/types.ts` (extend)
- `src/data/projects.ts` (edit links, slugs, add Reservoir)
- `src/data/case-studies.ts` (new)
- `src/data/services.ts` (new)
- `src/data/about.ts` (new)
- `src/data/credits.ts` (new)
- `src/data/live.ts` (new, derived from projects)
- `src/data/index.ts` (new, single export surface)

**Interfaces** (add to `types.ts`)

```ts
export type CaseStudySection =
  | { kind: "prose"; heading?: string; body: string[] }
  | { kind: "list"; heading: string; items: string[] }
  | { kind: "facts"; heading?: string; facts: { label: string; value: string }[] }
  | { kind: "quote"; quote: string; attribution?: string }
  | { kind: "figure"; src: string; alt: string; caption?: string; width: number; height: number };

export interface CaseStudy {
  slug: Project["slug"];
  tagline: string;
  status: "live" | "archive" | "in-progress";
  year: string;
  team: string;
  role: string;
  stack: string[];
  summary: string;
  heroAlt: string;
  accent: "brass" | "copper" | "teal";
  sections: CaseStudySection[];
  technicalBrief?: string; // path under /docs, filled in Plan 5
  gallery?: { src: string; alt: string; width: number; height: number }[];
}

export interface Service {
  id: string;
  title: string;
  promise: string;
  deliverables: string[];
  bestFor: string;
  timeline: string;
  from: string;
  icon: "layers" | "compass" | "code" | "spark" | "book" | "wrench";
}

export interface CreditEntry {
  name: string;
  author: string;
  license: "MIT" | "original" | "inspiration";
  href: string;
  usedFor: string;
}

export interface LiveProject {
  slug: string;
  name: string;
  url: string;
  tag: string;
  accent: "brass" | "copper" | "teal";
}
```

**Rules**

1. Every project in `projects.ts` gets `slug`, `tagline`, `year`, `status`, `stack`, `accent`,
   `featured` and `links` (typed `ProjectLink[]`). Keep existing copy where it is good; rewrite
   only what is vague.
2. Replace `k-one-website` with `k-one` everywhere. Add Reservoir with its live URL.
3. `clearcut` and `sa-jas` gain their live links. `vigil` has no live link, so `status: "archive"`
   and the UI must not render a disabled "Live" button.
4. `live.ts` exports `liveProjects` filtered from `projects` where a live link exists, ordered
   board first: `sa-jas`, `clearcut`, `munisolve`, `timelex`, `k-one`, `ui-vault`, `reservoir`.
5. `credits.ts` seeds: Glassmorphism Folder Cards (ui-vault, MIT, adapted), Mascot Portfolio Hero
   (ui-vault, MIT, adapted), Circular Navigation Bar (Kaif UI, inspiration, original code),
   Interactive 3D Machine (Evgeny Shilov, inspiration, original code), plus libraries.
6. `case-studies.ts` covers all eight routes. Each study: 3 to 6 sections, at least one `facts`
   block and one `list`. Content must be true to the existing project descriptions. Where a detail
   is unknown (metrics, client name), write qualitative text instead of inventing numbers.
7. `services.ts` has six services: Product and interface design, Web engineering, Design systems
   and UI vaults, Applied AI tools, Technical documentation and handover, Rescue and refactor.
   Each has a concrete promise and 3 to 5 deliverables.

**Acceptance**

- `npm run typecheck` and `npm run build` pass.
- A Vitest suite asserts: every case study slug exists in `projects`; every `liveProjects` entry
  has an `https://` URL; no slug uses `k-one-website`; every service has at least three deliverables.

---

## Task 2: Mascot hero

**Files:** `src/components/home/mascot-hero.tsx`, `src/components/home/mascot-figure.tsx`,
`src/hooks/use-reduced-motion.ts` (if not already in Plan 1), `src/pages/home.tsx`.

**Approach**

- Port the MIT mascot from `ui-vault/references/mascot-portfolio-hero/MascotPortfolioHero.tsx`
  into `mascot-figure.tsx`, preserving its drawing and typing head but restyling it to the night
  workshop palette. Keep the MIT header comment and add "Adapted for konethegreat.github.io".
- Props used on Home: `skin="#6B4229"`, `beanie="#20302E"`, `accent="#D8A24A"`, `paper` and `ink`
  read from CSS custom properties so it follows the theme.
- Hero layout: 12-column grid. Left 7 columns: eyebrow, headline in Instrument Serif with one
  Archivo Black word, short paragraph, two CTAs (`View the work`, `Start a project`), and a
  keyboard hint for Ctrl+K.
- Right 5 columns: mascot inside a circular brass ring that slowly rotates only when motion is
  allowed, with a floating status chip ("Available for select work").
- Mobile: mascot shrinks and moves below the copy, ring stops rotating.
- Do not let the mascot speak product copy. Its bubble is a greeting only, and it must not loop
  forever in a way that distracts.

**Acceptance**

- Mascot renders light and dark correctly, with no layout shift on load.
- Reduced motion: no rotation, no bubble cycling (static first greeting).
- Lighthouse a11y stays at 100 on `/`; axe test still passes.

---

## Task 3: Live strip

**Files:** `src/components/home/live-strip.tsx`.

**Approach**

- Full-bleed band under the hero: "Live right now" label, then an infinite marquee of live
  projects with their URL host and a `lucide-react` external-link icon.
- Pause on hover and on focus-within. Arrows or Tab move through real links. Duplicate the track
  for the loop and mark the duplicate `aria-hidden`.
- With reduced motion the strip becomes a static wrapped list, no animation.
- Each entry is an `<a>` with an accessible name like "SA-JAS, opens in a new tab".

**Acceptance**

- All seven links render, each keyboard focusable once (duplicates not focusable).
- No horizontal page scroll at 320px width.

---

## Task 4: Functional glass folder shelf

**Files:** `src/components/home/folder-shelf.tsx`, `src/components/ui/glass-folder.tsx`.

**Approach**

- Port the MIT folder card into `glass-folder.tsx`. Preserve props `tone`, `width`, `seed`,
  `art`, `files`, `appear`, `appearDelay`. Keep `href` support so each file is a real anchor.
- `tone="dark"` inside the night workshop section, `tone="light"` on the paper section, so the
  shelf feels physical in both themes.
- Shelf shows three folders: **Client work** (SA-JAS, ClearCut, MuniSolve, TimeLex), **Studio**
  (Vigil, K-ONE, Reservoir), and **Play** (UI Vault, Playground). The first file in each folder
  navigates with `useRouter().navigate` and the View Transitions API so the folder card morphs
  into the project hero. Fallback: normal navigation.
- Add a caption under the shelf: "Folders open. Nothing here is a dead end." plus the MIT credit
  link in a visually hidden sentence.
- Hover/focus lifts the folder and lifts the first file slightly. Reduced motion keeps it static.

**Acceptance**

- Clicking any file lands on the right case study. Browser back returns to `/`.
- Shared-element transition works in Chromium; without support it is a clean fade.
- Keyboard: Tab reaches each file in reading order; Enter opens it.

---

## Task 5: Circular navigation menu (original)

**Files:** `src/components/nav/radial-menu.tsx`, `src/components/nav/radial-trigger.tsx`,
`src/components/nav/command-menu.tsx` (replaces or wraps the old palette),
`src/components/layout/site-header.tsx` (integrate trigger).

**Approach**

- Radix `Dialog` with `modal`, labelled by a visually hidden title. Trigger is a compact circular
  brass button in the header labelled "Open menu".
- The menu is a full-screen scrim with a ring of 8 items at 45 degree intervals. Items are real
  anchors using `Link`, arranged with CSS `rotate` on the container and counter-rotate on the
  labels so text stays upright.
- Items: Home, Work, Services, About, Playground, Contact, Credo (credits), and a theme toggle.
  The current route gets a brass ring and `aria-current="page"`.
- Motion: scrim fades, ring rotates 12 degrees into place, items stagger with a spring. With
  reduced motion all items appear instantly. Closing reverses quickly (150ms).
- Keyboard: focus moves to the first item, arrow keys cycle items, Escape closes and returns focus
  to the trigger. Focus is trapped by Radix. Body scroll locks while open.
- Ctrl+K and Cmd+K open the same component in "command" mode: a `cmdk` list of routes and live
  projects, filtered by typing, with a footer of shortcuts. The old palette component is deleted,
  not left unused.

**Acceptance**

- Keyboard-only and screen reader passes for open, navigate, close, and focus return.
- Works at 320px: the ring becomes a two-column list, not a tiny circle.
- No focusable elements hidden behind the scrim when closed.
- No dependency on the unlicensed Kaif UI code. The credit says "inspiration".

---

## Task 6: Home assembly and phase close

**Files:** `src/pages/home.tsx`, `src/components/home/*`, tests.

**Approach**

- Home order: mascot hero, live strip, "Selected work" folder shelf, a short proof band
  (three numbers from `profile.stats`), a two-line services teaser linking to `/services`, the
  latest writing or Now block from profile, and a closing CTA to `/contact`.
- Delete dead home-only components that the routed shell no longer uses (old Navbar, ScrollProgress
  if unused, old Hero) or move still-useful ones. No orphan files.
- Add `src/components/home/home.test.tsx`: renders hero copy, all live links, three folders.
- Add a Playwright check: open the radial menu, Tab to "Work", press Enter, expect `/work`.

**Phase close**

```bash
npm run typecheck && npm run test && npm run build
npx playwright test
git add -A && git commit -m "feat: add content model, mascot hero, live strip, folder shelf and radial menu"
git push -u origin feat/flagship-v1
```

Open or update the draft PR with a short summary of the phase and the verified link table.
