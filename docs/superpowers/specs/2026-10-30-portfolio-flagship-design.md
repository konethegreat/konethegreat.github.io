# Portfolio flagship design

Date: 2026-10-30
Owner: Kone Tshivhinda
Repository: `konethegreat.github.io`
Status: approved for planning

## 1. Goal

Rebuild the portfolio as a personal flagship, not a corporate brochure. It should read as one distinctive individual: warm, tactile, technically serious and memorable. It must also be easy to navigate, honest about project status, and useful to people who want to hire or collaborate.

Primary audience: clients and collaborators. Secondary audience: peers and employers who check the public record.

Success means:

- A visitor remembers the site, not just the projects.
- Every live product is one click away and every link works.
- A serious visitor can reach a technical brief, an architecture note and the source in under a minute.
- The site is readable at 320px, keyboard operable, and usable with reduced motion and in both themes.
- Third-party inspiration is credited visibly.

## 2. Principles

1. Three signature moments, not twenty. The mascot poster, the folders that open into pages, and the radial menu carry the personality. Case studies stay calm and readable.
2. Proof over adjectives. Status labels, live links, test counts and ADRs do the persuading.
3. One warm visual world. Ink, paper, brass, copper and teal, with glass as a material rather than a decoration.
4. No dead controls. If a control is visible, it works, links somewhere real, or says plainly why it cannot.
5. Motion is optional. Every effect has a reduced-motion branch, and a visible effects switch remains.

## 3. Current state

- Vite 8, React 19, TypeScript 6, Tailwind CSS 4.
- Framer Motion, Radix Dialog, cmdk, lucide-react.
- One long page with ten sections, a case-study dialog and a command palette.
- Dark theme only.
- Content lives in typed data files under `src/data/`.
- Deploy runs from `.github/workflows/deploy.yml` on every push to `main`.
- Strong existing assets: the AI Lab demos, the retrieval engine, the honesty labels and the project data.

## 4. Information architecture

Clean paths, served as static route folders on GitHub Pages.

| Path | Page | Purpose |
| --- | --- | --- |
| `/` | Home | Mascot poster, live strip, glass folders, services teaser, now, contact |
| `/work` | Work | Featured work, capability filter, 3D workshop, archive |
| `/work/vigil` | Case study | Vigil |
| `/work/clearcut` | Case study | ClearCut |
| `/work/timelex` | Case study | TimeLex |
| `/work/sa-jas` | Case study | SA-JAS |
| `/work/munisolve` | Case study | MuniSolve ZA |
| `/work/reservoir` | Case study | Reservoir |
| `/work/ui-vault` | Case study | UI Vault |
| `/work/k-one` | Case study | K-ONE IT SOLUTIONS |
| `/services` | Services | Six offers, engagement models, process, proof |
| `/about` | About | Story, timeline, principles, stack, studio, beyond |
| `/playground` | Playground | AI Lab demos, UI Vault shelf, interactive experiments |
| `/contact` | Contact | Email, profiles, availability, what to include |
| `/credits` | Credits | Third-party attribution and licenses |
| anything else | 404 | Safe links and search |

The existing `#project/<slug>` style links are not preserved as the primary pattern. A redirect from `/#project/vigil` to `/work/vigil` is added where it is cheap.

## 5. Navigation

### 5.1 Top bar

A slim header with the name, the current page label, a theme toggle, the effects toggle and a "Start a project" link. It never covers content and collapses to a compact bar on phones.

### 5.2 Circular radial menu

The signature navigation. Six primary destinations: Home, Work, Services, About, Playground, Contact.

- Trigger: a floating compass button showing the current destination.
- Overlay: full-screen dimmed backdrop, a translucent disc, six round targets evenly spaced, centre close control.
- Each slot is rotated into place and its content counter-rotated so labels stay upright.
- The radius is derived from the measured disc, not hardcoded. Targets stay at least 44px.
- Below a usable radius, or above eight destinations, it falls back to a vertical list.
- Behaviour: opens from the trigger, `role="dialog"`, `aria-modal`, accessible name "Main navigation", focus moves to close, focus trap, Escape closes, focus returns to trigger, page scroll locked, backdrop click closes, clicks inside the disc do not.
- State: `aria-current="page"` on the active destination, visible focus ring on every target.
- Motion: short opacity and scale entrance, disabled under reduced motion.
- Sizing: `100dvh` with a `100vh` fallback and safe-area padding.
- Provenance: original implementation. Inspired by "Circular Navigation Bar" by Kaif UI on 21st.dev. The vault records no license, so no code is copied. Credit line kept in `/credits` and in the component comment.

### 5.3 Glass folders

Six project folders on the home page, drawn with the MIT-licensed Glassmorphism Folder Cards component by Kedhareswer Naidu. Adapted, not hidden.

- One folder per featured project: Vigil, ClearCut, TimeLex, SA-JAS, MuniSolve, Reservoir.
- Opening a folder fans out labelled file buttons. Each file is a real link: Overview, Architecture, Screenshots, Technical brief.
- Each folder also has an "Open case study" action that navigates to the project page.
- The component keeps its accessible button, `aria-expanded`, `inert` file list and keyboard behaviour.
- The dark tone is used, with per-project artwork recipes and seeds.
- A visible credit line sits beside the folder shelf and on `/credits`.

### 5.4 Command palette

Ctrl or Cmd + K opens a palette with pages, projects, PDFs, theme toggle, effects toggle and copy email. It routes rather than scrolling.

### 5.5 Page transitions

- Use the View Transitions API when available, with matching `view-transition-name` values from the folder to the project hero, and from a project card to the page.
- Fallback: a short Framer Motion fade and rise, no shared element.
- Navigation scrolls to top and focuses the page heading. Back and forward restore scroll.
- Reduced motion removes the transition and leaves an instant change.

## 6. Visual system

### 6.1 Concept

"Night workshop": a warm studio desk after dark. Ink background, warm paper light, brass and copper accents, deep teal, real glass, subtle grain and a lamp glow.

Not used: rainbow gradients, glass on every surface, emoji icons, pure black, pure white, generic AI-hero gradients.

### 6.2 Tokens

Dark theme:

| Token | Value | Use |
| --- | --- | --- |
| `--bg` | `#0B0B0F` | Page |
| `--surface` | `#14131A` | Cards and panels |
| `--ink` | `#ECE7DD` | Primary text |
| `--muted` | `#A9A296` | Secondary text |
| `--brass` | `#D8A24A` | Primary accent and main CTA glow |
| `--copper` | `#C0653B` | Secondary accent |
| `--teal` | `#2F7A72` | Tertiary accent and data |
| `--line` | `rgba(242,234,220,0.12)` | Borders |
| `--glass` | `rgba(20,19,26,0.55)` | Glass surfaces |

Light theme:

| Token | Value | Use |
| --- | --- | --- |
| `--bg` | `#F4EFE6` | Warm paper |
| `--surface` | `#FFFBF3` | Cards and panels |
| `--ink` | `#1A1815` | Primary text |
| `--muted` | `#5E574C` | Secondary text |
| `--brass` | `#9A6A1F` | Accent with AA contrast |
| `--copper` | `#A24B2A` | Secondary accent |
| `--teal` | `#25645E` | Tertiary accent |
| `--line` | `rgba(26,24,21,0.12)` | Borders |
| `--glass` | `rgba(255,251,243,0.62)` | Glass surfaces |

The theme follows the OS by default, has a visible toggle, and persists the choice. A boot script applies the theme before first paint to avoid a flash.

### 6.3 Type

- Display and poster: Archivo Black, self-hosted. Used by the mascot and large statements.
- Editorial: Instrument Serif, self-hosted. Case-study headings and pull quotes.
- Reading: Inter Variable, self-hosted.
- Labels and data: JetBrains Mono Variable, self-hosted.
- Body measure: 60 to 72 characters. Body size 16 to 18px. No text over generated art without a scrim.

### 6.4 Layout

- Maximum content width 1200px, wide media 1440px.
- 4px spacing base, radii 12, 18 and 28.
- Case-study pages use a single reading column with a side rail for status, links and brief.
- One `h1` per page.

## 7. Motion

Signature moments:

1. Mascot poster: pointer gaze, breathing, blink and a greeting on click.
2. Folder to page: the folder's artwork and title morph into the project hero.
3. Radial menu: dial entrance and hover or focus fill.

Supporting motion: scroll reveals, number counters, the tool marquee, a soft cursor lamp and page transitions. The current splash cursor and vortex retire.

Rules:

- `prefers-reduced-motion: reduce` removes transforms, parallax, gaze, blink and page transitions. Content still reads as a static composition.
- The effects toggle remains for everyone else.
- WebGL pauses offscreen and when the document is hidden.
- No animation blocks input or delays first paint.

## 8. Home page

1. Mascot poster hero. Left: name, one-line positioning, primary CTA "Open the work", secondary "Start a project", live-status pill. Right: the adapted mascot. Under the poster: a short personal line and three quick facts.
2. Live strip: every live product with a status dot and a direct link.
3. Folder shelf: six glass folders.
4. Services teaser: three offers and a link to `/services`.
5. Proof: counters for projects built, live deployments, public repositories and AI projects, counted from data.
6. Now: current focus, studio, learning.
7. Contact band with the glowing brass CTA.

The mascot adaptation:

- Use the MIT-licensed Mascot Portfolio Hero by Kedhareswer Naidu.
- Set the `skin` prop to a deep brown and adjust the beanie and clothing palette to the night workshop.
- Keep the character as an illustrated mascot, not a portrait claim.
- Keep the MIT notice and a visible credit.
- The headline keeps a readable `aria-label`; the illustrated letters stay decorative.

## 9. Work page

1. Page hero with a short statement and capability filters.
2. The workshop: an original three.js scene inspired by the station metaphor of Evgeny Shilov's Interactive 3D Machine. Six stations: agents, retrieval, product, local-first, cloud, quality. Hover explains, click filters projects. Lazy-loaded, paused offscreen, static isometric SVG fallback for reduced motion, coarse pointers and low-end devices. No code is copied from the original, which has no license. Credit kept on `/credits`.
3. Featured folders or cards, sorted by impact.
4. Archive table with status labels and live or source links.
5. Every featured card exposes live, source and brief links.

## 10. Case-study template

Each of the eight pages contains:

1. Hero: breadcrumb, status badge, title, kicker, one-line pitch, role, period, stack chips, actions for live, source and technical brief.
2. Cover: a real screenshot, or an architecture diagram when there is no public demo.
3. What it does: three to five concrete capabilities.
4. How it is built: architecture paragraph, a diagram, and the stack with a reason for each major choice.
5. Decisions that matter: three cards drawn from the repository's ADRs or documented decisions.
6. Proof: metrics, test counts, limits and an honesty note.
7. Gallery: real screenshots with captions and dates.
8. Technical brief: PDF download and links to deeper documents on GitHub.
9. Next project.

Featured projects and evidence:

| Project | Live | Source | Primary evidence |
| --- | --- | --- | --- |
| Vigil | none | GitHub | ADRs, architecture docs, data model, compliance model |
| ClearCut | `https://145-241-100-85.sslip.io/` | GitHub | README, architecture, ADRs, test count |
| TimeLex | none | GitHub | ADRs, autonomy model, threat model, architecture |
| SA-JAS | `https://sajas.pages.dev/` | GitHub | Repo screenshots, demo script, architecture |
| MuniSolve ZA | `https://munisolve-za.vercel.app/` | GitHub | Repo screenshots, demo notes, security notes |
| Reservoir | `https://konethegreat.github.io/reservoir/` | GitHub | Architecture docs, ADRs, knowledge-sovereignty model |
| UI Vault | `https://konethegreat.github.io/ui-vault/` | GitHub | Catalog, rights policy, demos, API and MCP |
| K-ONE | `https://k-one-it-solutions-website.erictshivhinda.workers.dev/` | GitHub | Services, delivered work, stack |

Status labels stay literal: Live, Public source, Public source snapshot, Public source alpha or pre-alpha, Local project, Coursework.

Verified live links on 2026-10-30:

- `https://konethegreat.github.io/`
- `https://konethegreat.github.io/ui-vault/`
- `https://sajas.pages.dev/`
- `https://145-241-100-85.sslip.io/`
- `https://munisolve-za.vercel.app/`
- `https://timelex-automated-time-tracking.netlify.app/`
- `https://k-one-it-solutions-website.erictshivhinda.workers.dev/`
- `https://konethegreat.github.io/reservoir/`

## 11. Services page

Six offers. Each has an outcome line, what is included, who it fits, proof projects and a typical engagement shape.

1. Agent systems: tool use, MCP servers, human sign-off, evaluation.
2. Knowledge and retrieval: hybrid RAG, cited answers, document pipelines.
3. Product engineering: web apps, dashboards, APIs and data models.
4. Sovereign and local-first AI: local models, BYO keys, POPIA-aware handling.
5. Cloud delivery and operations: Docker, CI, deploy targets and monitoring.
6. Technical audits and documentation: architecture reviews, ADRs, threat models, handover packs.

Engagement models: fixed-scope build, monthly partner, two-week audit, advisory.

Process: discover, design, build, prove, hand over. "Prove" includes a working demo, tests and a written handover.

No invented prices. The page explains that work is quoted in rand after a short scoping conversation, and the CTA opens an email with a short project prompt.

Honesty section: what K-ONE does, what it does not do, and when a specialist is the better choice.

## 12. About page

1. Portrait and a first-person introduction. Specific, not a resume summary.
2. Story chapters: learning and IBM coursework, early studio work, civic and legal tech, AI systems, the law-firm engineering team, K-ONE, what comes next.
3. Scroll-driven timeline with dates and evidence links.
4. Principles: humans sign off; cheap first, capped always; honest about status; sovereign by design. Each links to proof projects.
5. Stack grouped by area, with proof links.
6. Studio card: K-ONE IT SOLUTIONS, services, delivered work, link to the studio site.
7. Beyond the code: photos with captions and a lightbox.
8. Now: founder, building, learning Rust, next public case study.
9. Keynote and languages.
10. Contact CTA.

No em dashes. No CV PDF. The portfolio is the public professional record.

## 13. Playground page

- The existing AI Lab demos: agent loop, hybrid RAG, agentic RAG, autonomy ladder, practices grid. Real versus scripted labels stay.
- The UI Vault shelf: selected live demos, a link to the full vault, and visible credits.
- Interactive experiments that are clearly labelled. The 3D workshop stays on `/work`.
- The effects toggle explains what it changes.

## 14. Contact page

- Email assembled in the browser, with a copy button and a mailto link.
- LinkedIn, GitHub, Credly and location.
- Availability line, kept current in data.
- "What to include" guidance: the problem, the deadline, the constraints, and whether there is an existing codebase.
- No form backend, therefore no form. A dead form is worse than a clear email.

## 15. Credits page

Visible attribution with author, source URL, license and what changed.

- Mascot Portfolio Hero by Kedhareswer Naidu, MIT, adapted for skin tone, palette and copy.
- Glassmorphism Folder Cards by Kedhareswer Naidu, MIT, adapted for project folders and navigation.
- Circular Navigation Bar by Kaif UI, no recorded license, original implementation inspired by the arrangement.
- Interactive 3D Machine by Evgeny Shilov, no recorded license, original scene inspired by the station metaphor.
- Fonts: Archivo Black, Instrument Serif and Inter under the SIL Open Font License; JetBrains Mono under the SIL Open Font License.
- Libraries: React, Vite, Tailwind CSS, Framer Motion, Radix UI, cmdk, lucide, three.js.
- Links to the full license texts in `public/licenses/`.

## 16. Content model

All content stays in typed data so pages follow data, not hardcoded strings.

| File | Content |
| --- | --- |
| `src/data/projects.ts` | Core project facts, status, live and source links, tags, metrics |
| `src/data/case-studies.ts` | Architecture, decisions, screenshots, brief metadata, next project |
| `src/data/services.ts` | Offers, engagement models, process, FAQ |
| `src/data/about.ts` | Story chapters, timeline, principles, now, keynote |
| `src/data/credits.ts` | Attribution entries and license links |
| `src/data/routes.ts` | Route table, labels, page meta |
| `src/data/profile.ts` | Identity, links, stats |
| `src/data/gallery.ts` | Photos |
| `src/data/lab.ts` | AI Lab content |

Rules:

- Counts and headline numbers derive from data.
- Every external link has a label and a status.
- Every project states what is not built.
- No em dashes in UI copy.

## 17. Screenshots and technical briefs

Screenshots:

- Capture live sites at 1440x900 with Playwright, light and dark where the app supports it, then convert to WebP.
- Reuse existing repository screenshots where they are better than a capture: SA-JAS and MuniSolve.
- Store under `public/shots/<slug>/`.
- Caption each with what it shows and the date.
- Never fabricate a UI for a project without a public demo. Use a diagram instead.

Technical briefs:

- Two A4 pages per featured project, generated from the same data as the page.
- Content: title, status, one-paragraph overview, architecture, stack, three decisions, proof metrics, screenshot, links and a generation date.
- Generated by `scripts/build-briefs.mjs` with Playwright `page.pdf`, committed to `public/docs/<slug>-brief.pdf`.
- Labelled "Generated from the public repository, October 2026".
- The same facts appear on the HTML page, so the PDF is never the only accessible source.
- PDFs are pre-generated and committed; CI does not need Playwright.

## 18. Technical architecture

- Keep Vite, React, TypeScript and Tailwind.
- Add a small history router adapted from the UI Vault pattern: base path, `pushState`, `popstate`, scroll restoration, focus management, hash scrolling.
- Add `scripts/copy-routes.mjs` to copy the built `index.html` into each route folder and to `404.html` after `vite build`.
- Add a View Transition helper with a Framer Motion fallback.
- Add a `ThemeProvider` and a boot script.
- Lazy-load the three.js workshop, with a static SVG fallback.
- Keep the AI Lab retrieval engine unchanged.
- Keep `no analytics, no cookies, no third-party requests`.
- Update `public/sitemap.xml`, `robots.txt`, the manifest and page metadata per route.
- Generate per-project Open Graph images if time allows; otherwise keep the site-wide image and record it as a follow-up.

Build and deploy:

- `npm run typecheck`
- `npm run build` includes route copying
- `npm run preview`
- GitHub Actions deploys `dist/` to Pages on `main`

## 19. Accessibility, performance and privacy

- Target WCAG 2.2 AA.
- Keyboard: skip link, visible focus, focus traps in the radial menu and palette, Escape, focus return, arrow keys where appropriate.
- Contrast measured from rendered pixels, not only tokens.
- Reduced motion and an effects toggle.
- No hover-only states.
- Images: responsive WebP with width and height, alt text for informative images, empty alt for decoration.
- WebGL: pause offscreen and when hidden, static fallback, no scroll trap on touch.
- No analytics, cookies or trackers.
- Email assembled in the browser.
- Photos stay the existing processed set; no new personal detail without approval.

## 20. Verification

Automated:

- `npm run typecheck`
- `npm run build`
- Route smoke test for every path, including deep links and the 404.
- PDF link check.
- Playwright checks for the radial menu keyboard flow, folder opening, theme toggle, effects toggle and reduced motion.
- axe-core on every page in light and dark at 390px and 1440px.
- Link check for every live URL.

Manual:

- 320, 390, 768 and 1440 widths.
- Light and dark.
- Reduced motion.
- Keyboard only.
- Slow network and WebGL fallback.
- Read every page for em dashes, overclaiming and dead controls.

Acceptance:

- All eight case studies resolve by direct URL.
- Every live link returns 200.
- The radial menu is fully operable and announced correctly.
- No serious or critical axe findings.
- Briefs download and match the page facts.
- Build and deploy are green.

## 21. Out of scope

- CMS or admin UI.
- Contact form backend, payments or scheduling.
- Publishing the CV PDF.
- The Mostoeneng performance-management tool and any Mostoeneng client work.
- A full blog.
- Rewriting the AI Lab retrieval engine.
- Replacing the existing photo set.

## 22. Risks and mitigations

| Risk | Mitigation |
| --- | --- |
| Too many effects hurt readability and performance | Three signature moments, lazy WebGL, calm case studies, reduced-motion branch |
| View Transitions support varies | Framer Motion fallback; test both paths |
| Mascot looks like a different person | Treat it as an illustrated mascot, not a portrait; keep the greeting playful |
| Screenshots go stale | Date every capture; regenerate from a script |
| PDFs drift from the page | Generate from the same data; date the build |
| Deep links break on Pages | Route folders plus `404.html`, tested |
| Third-party license breach | Credit page, license texts, original implementations where unlicensed |
| 3D bundle size | Lazy load, static fallback, pause offscreen |

## 23. Decisions carried into the build

- Service offer wording is drafted in `src/data/services.ts` and reviewed before launch. The six names in section 11 are the source of truth.
- Mascot palette: skin `#6B4229`, beanie `#20302E`, tag and accents brass `#D8A24A`. These are starting values, adjusted once against the rendered poster.
- The systems project management demo stays in the archive only. It does not get a featured case study.
- Per-project Open Graph images are a follow-up, not part of the first release. The site-wide image remains until then.
