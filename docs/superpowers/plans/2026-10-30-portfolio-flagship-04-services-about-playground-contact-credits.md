# Services, About, Playground, Contact and Credits Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the five remaining placeholder pages with the written, sourced and accessible pages from the spec: six service offers with proof, a first-person About page with a scroll-driven story and a photo lightbox, a Playground shelf tied to the UI Vault, a working contact page with no form, and a complete credits page with hosted license texts.

**Architecture:** Keep every word in typed data. `src/data/services.ts` owns the offers, engagement models, process, honesty notes and FAQ. `src/data/about.ts` owns the story chapters, intro and stack proof map. `src/data/playground.ts` owns the UI Vault shelf. Pages compose small components under `src/components/services`, `src/components/about` and `src/components/playground`. Contact uses one small mail helper, `src/lib/mail.ts`, shared with the services CTA so the project prompt exists in one place.

**Tech Stack:** Vite 8, React 19, TypeScript 6 strict, Tailwind CSS 4, Radix Dialog, lucide-react, Vitest, Playwright with axe-core.

**Spec:** docs/superpowers/specs/2026-10-30-portfolio-flagship-design.md

## Global Constraints

- No em dashes in user-facing copy. Use commas, colons or full stops.
- Light is the default theme. Dark bands are reserved for the workshop and the AI lab.
- Never invent prices, metrics, client names or screenshots. Work is quoted in rand only after scoping.
- Every proof link points at one of the eight real case studies: `vigil`, `clearcut`, `timelex`, `sa-jas`, `munisolve`, `reservoir`, `ui-vault`, `k-one`.
- Third-party work keeps its author, source, license and a plain statement of what changed. Unlicensed references stay inspiration-only and say so.
- No CV PDF. The portfolio is the public professional record.
- No Mostoeneng Bill work anywhere.
- WCAG 2.2 AA. Every control works by keyboard, every effect has a reduced-motion branch, and no page overflows sideways at 320px.
- TypeScript strict with `noUnusedLocals` and `noUnusedParameters`.
- Tests live with the data they protect. Add a unit test for every new data file and a Playwright test for every new page behaviour.

---

### Task 1: Services data and the home teaser

**Files:**
- Modify: `src/data/types.ts`
- Modify: `src/data/services.ts` (replace the six design-centric offers)
- Modify: `src/pages/HomePage.tsx`
- Modify: `tests/unit/content.test.ts`

**Interfaces:**
- Produces: `ProofLink { label: string; slug: string }`, `Service { id: string; title: string; outcome: string; included: string[]; fits: string; proof: ProofLink[]; shape: string; icon: "agents" | "retrieval" | "product" | "local" | "cloud" | "quality" }`, `EngagementModel { id: string; name: string; detail: string; rhythm: string }`, `ProcessStep { id: string; name: string; detail: string }`, `ServiceHonesty { id: string; title: string; items: string[] }`, `ServiceFaq { q: string; a: string }`.
- Consumes: `caseStudies` slugs in tests; `services` in `HomePage`.

- [x] **Step 1: Write the failing test**

In `tests/unit/content.test.ts`, extend the existing `@/data/services` import at the top of the file so it reads:

```ts
import {
  engagementModels,
  processSteps,
  serviceFaq,
  serviceHonesty,
  services,
} from "@/data/services"
```

Then replace the `gives every service at least three deliverables` test with:

```ts
it("has six service offers with real proof links", () => {
  const studySlugs = new Set(caseStudies.map((study) => study.slug))
  expect(services).toHaveLength(6)
  expect(services.map((service) => service.title)).toEqual([
    "Agent systems",
    "Knowledge and retrieval",
    "Product engineering",
    "Sovereign and local-first AI",
    "Cloud delivery and operations",
    "Technical audits and documentation",
  ])
  for (const service of services) {
    expect(service.included.length).toBeGreaterThanOrEqual(4)
    expect(service.proof.length).toBeGreaterThanOrEqual(2)
    expect(service.outcome.trim()).not.toBe("")
    expect(service.fits.trim()).not.toBe("")
    expect(service.shape.trim()).not.toBe("")
    for (const proof of service.proof) {
      expect(studySlugs.has(proof.slug)).toBe(true)
    }
  }
})

it("keeps the engagement, process, honesty and FAQ content complete", () => {
  expect(engagementModels).toHaveLength(4)
  expect(processSteps.map((step) => step.name)).toEqual([
    "Discover",
    "Design",
    "Build",
    "Prove",
    "Hand over",
  ])
  expect(serviceHonesty.map((note) => note.title)).toEqual([
    "What K-ONE does",
    "What K-ONE does not do",
    "When a specialist is the better choice",
  ])
  expect(serviceFaq.length).toBeGreaterThanOrEqual(4)
  for (const note of serviceHonesty) {
    expect(note.items.length).toBeGreaterThanOrEqual(3)
  }
})

it("never puts a price or an em dash in service copy", () => {
  const copy = JSON.stringify({
    services,
    engagementModels,
    processSteps,
    serviceHonesty,
    serviceFaq,
  })
  expect(copy).not.toMatch(/R\s?\d/)
  expect(copy).not.toContain("\u2014")
})
```

- [x] **Step 2: Run the test to verify it fails**

Run: `npm test -- tests/unit/content.test.ts`
Expected: FAIL because the current services still have `promise`, `deliverables`, `bestFor`, `timeline` and `from`, and none of the new exports exist.

- [x] **Step 3: Update the types**

In `src/data/types.ts`, add above `Service`:

```ts
export interface ProofLink {
  label: string
  slug: string
}

export type ServiceIcon = "agents" | "retrieval" | "product" | "local" | "cloud" | "quality"

export interface Service {
  id: string
  title: string
  outcome: string
  included: string[]
  fits: string
  proof: ProofLink[]
  shape: string
  icon: ServiceIcon
}

export interface EngagementModel {
  id: string
  name: string
  detail: string
  rhythm: string
}

export interface ProcessStep {
  id: string
  name: string
  detail: string
}

export interface ServiceHonesty {
  id: string
  title: string
  items: string[]
}

export interface ServiceFaq {
  q: string
  a: string
}
```

Replace the existing `Service` interface with the new definition above, so the file holds exactly one `Service` type.

- [x] **Step 4: Replace `src/data/services.ts`**

Use exactly this content:

```ts
import type {
  EngagementModel,
  ProcessStep,
  Service,
  ServiceFaq,
  ServiceHonesty,
} from "./types"

export const services: Service[] = [
  {
    id: "agent-systems",
    title: "Agent systems",
    outcome:
      "An agent that handles one bounded job, shows its evidence and stops where a person should decide.",
    included: [
      "Tool use and MCP servers where they earn their place",
      "A human sign-off gate before anything consequential",
      "Evaluation cases, prompt-injection fencing and hard cost caps",
      "A run record an operator can follow",
    ],
    fits: "A real workflow, data clean enough to ground answers and a low tolerance for invented ones.",
    proof: [
      { label: "Vigil", slug: "vigil" },
      { label: "SA-JAS", slug: "sa-jas" },
      { label: "ClearCut", slug: "clearcut" },
    ],
    shape: "Fixed-scope build: one workflow, one evaluation plan, a working demo and a written handover.",
    icon: "agents",
  },
  {
    id: "knowledge-retrieval",
    title: "Knowledge and retrieval",
    outcome:
      "Answers that cite the document they came from, or say plainly that the evidence is not there.",
    included: [
      "Hybrid keyword and vector retrieval fused by rank",
      "Grounded answers with visible sources",
      "Document and email pipelines with permissions",
      "An abstain rule and an evaluation set",
    ],
    fits: "Teams sitting on documents, policies or case files that people cannot search well.",
    proof: [
      { label: "Vigil", slug: "vigil" },
      { label: "Reservoir", slug: "reservoir" },
    ],
    shape: "Fixed scope: one corpus, one question set, a measured demo and the retrieval design written down.",
    icon: "retrieval",
  },
  {
    id: "product-engineering",
    title: "Product engineering",
    outcome:
      "A web product that works on a phone, survives a real content edit and can be deployed without ceremony.",
    included: [
      "Product flow and interface direction",
      "A responsive React or full-stack build",
      "APIs, data models and access rules",
      "Accessibility and performance checks",
    ],
    fits: "Founders, studios and teams that need a working product, not a deck.",
    proof: [
      { label: "MuniSolve ZA", slug: "munisolve" },
      { label: "SA-JAS", slug: "sa-jas" },
      { label: "UI Vault", slug: "ui-vault" },
      { label: "K-ONE", slug: "k-one" },
    ],
    shape: "Fixed-scope build: a usable first release, a deployment target and a handover session.",
    icon: "product",
  },
  {
    id: "sovereign-ai",
    title: "Sovereign and local-first AI",
    outcome:
      "AI that runs on your machine or inside your country, with data handling you can explain to a regulator.",
    included: [
      "Local models with Ollama and LM Studio",
      "Bring-your-own-key provider seams",
      "POPIA-aware data handling and residency notes",
      "Fallbacks for quality and cost",
    ],
    fits: "Legal, health, public-sector and any team whose data cannot leave a boundary.",
    proof: [
      { label: "Vigil", slug: "vigil" },
      { label: "TimeLex", slug: "timelex" },
      { label: "Reservoir", slug: "reservoir" },
    ],
    shape: "A proof of concept first, then a fixed-scope build if the quality holds.",
    icon: "local",
  },
  {
    id: "cloud-delivery",
    title: "Cloud delivery and operations",
    outcome:
      "A deployed system you can watch, with a repeatable release path and a rollback that has been tried.",
    included: [
      "Docker images and a CI pipeline",
      "A chosen deploy target",
      "Monitoring, logs and alerting",
      "A runbook and a rollback path",
    ],
    fits: "Projects that work locally and need to survive real traffic, or systems that have outgrown a manual deploy.",
    proof: [
      { label: "ClearCut", slug: "clearcut" },
      { label: "MuniSolve ZA", slug: "munisolve" },
      { label: "K-ONE", slug: "k-one" },
    ],
    shape: "Fixed-scope delivery: one environment, one pipeline, one runbook, then support if you want it.",
    icon: "cloud",
  },
  {
    id: "audits-docs",
    title: "Technical audits and documentation",
    outcome:
      "The architecture, risks and decisions written down, so someone who was not in the room can maintain the system.",
    included: [
      "An architecture review with evidence",
      "ADRs and interface contracts",
      "A threat model and risk map",
      "A handover pack and a walkthrough",
    ],
    fits: "Inherited systems, codebases with one author and teams preparing for an audit or a handover.",
    proof: [
      { label: "TimeLex", slug: "timelex" },
      { label: "Vigil", slug: "vigil" },
      { label: "ClearCut", slug: "clearcut" },
    ],
    shape: "A read-only audit first, then a fixed-scope documentation or remediation slice.",
    icon: "quality",
  },
]

export const engagementModels: EngagementModel[] = [
  {
    id: "fixed",
    name: "Fixed-scope build",
    detail:
      "A defined outcome with a written scope, a demo and a handover. Best when the problem is clear enough to cost.",
    rhythm: "One scope, one delivery",
  },
  {
    id: "partner",
    name: "Monthly partner",
    detail:
      "A standing block of engineering time, a short written plan at the start of the cycle and a demo at the end.",
    rhythm: "Plan, build, show",
  },
  {
    id: "audit",
    name: "Two-week audit",
    detail:
      "A read-only review of architecture, security and delivery, ending in a prioritised report.",
    rhythm: "Read, test, report",
  },
  {
    id: "advisory",
    name: "Advisory",
    detail:
      "A scheduled conversation for a team that is already building and wants a second opinion before the next commitment.",
    rhythm: "Ask, decide, move",
  },
]

export const processSteps: ProcessStep[] = [
  {
    id: "discover",
    name: "Discover",
    detail: "One or two conversations about the problem, the people, the constraints and the real deadline.",
  },
  {
    id: "design",
    name: "Design",
    detail: "A written scope, the shape of the system, the risks and what is explicitly out of scope.",
  },
  {
    id: "build",
    name: "Build",
    detail: "Small commits, tests where they matter and a running increment every week.",
  },
  {
    id: "prove",
    name: "Prove",
    detail: "A working demo, the tests behind the claims and the evidence that the result holds.",
  },
  {
    id: "hand-over",
    name: "Hand over",
    detail: "A written handover pack, a walkthrough and a named owner for the system after launch.",
  },
]

export const serviceHonesty: ServiceHonesty[] = [
  {
    id: "does",
    title: "What K-ONE does",
    items: [
      "Build agent systems with a human gate before anything irreversible.",
      "Ground retrieval in real documents and show the source.",
      "Ship full-stack products with the tests and handover to match.",
      "Run local models when data cannot leave the machine or the country.",
    ],
  },
  {
    id: "does-not",
    title: "What K-ONE does not do",
    items: [
      "Call a system production-ready before it has been verified.",
      "Copy unlicensed work or hide an attribution.",
      "Claim client work that is not public.",
      "Take a project where a specialist is clearly the better choice.",
    ],
  },
  {
    id: "specialist",
    title: "When a specialist is the better choice",
    items: [
      "Independent penetration testing and formal security certification.",
      "Large-scale model training and GPU operations.",
      "Round-the-clock site reliability for a large estate.",
      "Legal, tax or accounting advice. I build the tools; the professionals sign the opinion.",
    ],
  },
]

export const serviceFaq: ServiceFaq[] = [
  {
    q: "Can you work with an existing codebase?",
    a: "Yes. I start read-only: architecture, risks and the parts that are hard to change. Nothing is rewritten before that picture is agreed.",
  },
  {
    q: "How is the price set?",
    a: "After a short scoping conversation, in rand. The quote follows the scope. If the scope changes, the quote changes in writing.",
  },
  {
    q: "Who owns the code?",
    a: "You do, once the work is paid for. Third-party dependencies keep their own licenses.",
  },
  {
    q: "Do you work remotely?",
    a: "Yes. I am in Johannesburg on SAST and work with teams in other time zones.",
  },
  {
    q: "What happens if it is not a fit?",
    a: "I say so early and point you to the kind of specialist who fits. A bad fit costs us both more than a no.",
  },
]
```

- [x] **Step 5: Update the home teaser**

In `src/pages/HomePage.tsx`, replace the service teaser paragraph and metadata lines:

```tsx
<p className="mt-2 max-w-xl text-sm leading-relaxed text-muted-foreground">
  {service.outcome}
</p>
<p className="mt-3 font-mono text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
  {service.shape}
</p>
```

The old block used `service.promise`, `service.timeline` and `service.from`. Remove those references.

- [x] **Step 6: Run the tests and typecheck**

Run: `npm run typecheck && npm test`
Expected: typecheck passes, all unit tests pass.

- [x] **Step 7: Commit**

```bash
git add src/data/types.ts src/data/services.ts src/pages/HomePage.tsx tests/unit/content.test.ts
git commit -m "feat: rewrite services data for the six offers"
```

---

### Task 2: Services page and the shared mail helper

**Files:**
- Create: `src/lib/mail.ts`
- Create: `src/pages/ServicesPage.tsx` (replace the placeholder)
- Create: `tests/e2e/services.spec.ts`

**Interfaces:**
- Consumes: `services`, `engagementModels`, `processSteps`, `serviceHonesty`, `serviceFaq` from `src/data/services`; `buildEmail` from `src/data/profile`.
- Produces: `mailtoHref(subject: string, body: string): string`, `projectPrompt: string`. Task 5 reuses both.

- [x] **Step 1: Write the failing test**

Create `tests/e2e/services.spec.ts`:

```ts
import { test, expect } from "@playwright/test"

test("services shows six offers with case-study proof", async ({ page }) => {
  await page.goto("/services")
  await expect(page.getByRole("heading", { level: 1 })).toContainText("Bring a problem")
  const offers = page.getByRole("region", { name: "The six offers" })
  await expect(offers.getByRole("article")).toHaveCount(6)
  await expect(offers.getByRole("link", { name: "Vigil" }).first()).toHaveAttribute("href", "/work/vigil")
  await expect(offers.getByRole("link", { name: "ClearCut" }).first()).toHaveAttribute("href", "/work/clearcut")
})

test("services explains the engagement, process, honesty and FAQ", async ({ page }) => {
  await page.goto("/services")
  await expect(page.getByRole("region", { name: "Four ways to shape the work" })).toBeVisible()
  const process = page.getByRole("region", { name: "Discover, design, build, prove, hand over" })
  await expect(process.getByRole("listitem")).toHaveCount(5)
  await expect(page.getByRole("heading", { name: "An honest fit matters more than a sale." })).toBeVisible()
  await expect(page.locator("details")).toHaveCount(5)
})

test("the services CTA opens an email with a project prompt", async ({ page }) => {
  await page.goto("/services")
  const cta = page.getByRole("link", { name: "Email the brief" })
  const href = await cta.getAttribute("href")
  expect(href).toMatch(/^mailto:/)
  const decoded = decodeURIComponent(href ?? "")
  expect(decoded).toContain("What I am trying to build")
  expect(decoded).toContain("Existing codebase")
})

test("services does not scroll sideways at 320px", async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 720 })
  await page.goto("/services")
  const overflow = await page.evaluate(
    () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
  )
  expect(overflow).toBeLessThanOrEqual(1)
})
```

- [x] **Step 2: Run the test to verify it fails**

Run: `npm run build && npx playwright test tests/e2e/services.spec.ts --project=desktop`
Expected: FAIL because the placeholder has none of these regions, headings or the mail CTA.

- [x] **Step 3: Add the mail helper**

Create `src/lib/mail.ts`:

```ts
import { buildEmail } from "@/data/profile"

export const projectPrompt = [
  "What I am trying to build:",
  "The deadline:",
  "Constraints (stack, compliance, team):",
  "Existing codebase (yes or no):",
].join("\n\n")

export function mailtoHref(subject: string, body: string): string {
  return `mailto:${buildEmail()}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
}
```

- [x] **Step 4: Build the page**

Replace `src/pages/ServicesPage.tsx` with:

```tsx
import { ArrowUpRight, Bot, Cloud, Cpu, FileCheck2, LayoutGrid, Search } from "lucide-react"
import { Link } from "@/components/ui/link"
import {
  engagementModels,
  processSteps,
  serviceFaq,
  serviceHonesty,
  services,
} from "@/data/services"
import { mailtoHref, projectPrompt } from "@/lib/mail"

const icons = {
  agents: Bot,
  retrieval: Search,
  product: LayoutGrid,
  local: Cpu,
  cloud: Cloud,
  quality: FileCheck2,
} as const

export function ServicesPage() {
  return (
    <>
      <section className="relative isolate overflow-hidden px-4 pb-10 pt-12 sm:px-6 sm:pt-16 lg:px-8">
        <div aria-hidden="true" className="hero-grid pointer-events-none absolute inset-0 -z-10 opacity-50" />
        <div className="mx-auto max-w-7xl">
          <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-primary">Services</p>
          <h1 className="mt-4 max-w-4xl text-balance font-serif text-5xl leading-[0.94] sm:text-7xl lg:text-[6rem]">
            Bring a problem. Leave with a running system.
          </h1>
          <p className="mt-6 max-w-2xl text-pretty text-lg leading-relaxed text-muted-foreground sm:text-xl">
            Six ways to work together, each with a clear outcome and proof behind it. Scope first,
            then a quote in rand. No price before the work is real.
          </p>
        </div>
      </section>

      <section aria-labelledby="offers-title" className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <h2 id="offers-title" className="sr-only">
          The six offers
        </h2>
        <ol className="grid gap-5 lg:grid-cols-2">
          {services.map((service, index) => {
            const Icon = icons[service.icon]
            return (
              <li key={service.id}>
                <article className="flex h-full flex-col rounded-3xl border border-border bg-card/60 p-6 transition hover:border-primary/40 sm:p-8">
                  <div className="flex items-start justify-between gap-4">
                    <span className="inline-flex size-11 items-center justify-center rounded-2xl border border-border bg-muted/40 text-primary">
                      <Icon className="size-5" aria-hidden="true" />
                    </span>
                    <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
                      0{index + 1}
                    </span>
                  </div>

                  <h3 className="mt-5 font-serif text-3xl leading-tight">{service.title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{service.outcome}</p>

                  <h4 className="mt-6 font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
                    What is included
                  </h4>
                  <ul className="mt-3 space-y-2 text-sm leading-relaxed">
                    {service.included.map((item) => (
                      <li key={item} className="flex gap-2">
                        <span aria-hidden="true" className="mt-2 size-1 shrink-0 rounded-full bg-primary" />
                        {item}
                      </li>
                    ))}
                  </ul>

                  <p className="mt-5 text-sm leading-relaxed">
                    <span className="font-semibold">Fits: </span>
                    {service.fits}
                  </p>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{service.shape}</p>

                  <div className="mt-auto flex flex-wrap items-center gap-2 border-t border-border pt-5">
                    <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
                      Proof
                    </span>
                    {service.proof.map((proof) => (
                      <Link
                        key={proof.slug}
                        to={`/work/${proof.slug}`}
                        className="inline-flex items-center gap-1 rounded-full border border-border px-3 py-1 text-xs font-medium transition hover:border-primary hover:text-primary"
                      >
                        {proof.label}
                        <ArrowUpRight className="size-3" aria-hidden="true" />
                      </Link>
                    ))}
                  </div>
                </article>
              </li>
            )
          })}
        </ol>
      </section>

      <section aria-labelledby="engagement-title" className="border-y border-border/70 bg-card/40">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
            <div>
              <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-primary">Engagement</p>
              <h2 id="engagement-title" className="mt-3 font-serif text-4xl leading-[1.02] sm:text-5xl">
                Four ways to shape the work.
              </h2>
              <p className="mt-5 max-w-md text-sm leading-relaxed text-muted-foreground">
                The shape follows the problem. Every arrangement ends with something that runs and
                something written down.
              </p>
            </div>
            <dl className="divide-y divide-border border-y border-border">
              {engagementModels.map((model) => (
                <div key={model.id} className="grid gap-2 py-5 sm:grid-cols-[11rem_1fr] sm:gap-6">
                  <dt className="font-semibold">{model.name}</dt>
                  <dd className="text-sm leading-relaxed text-muted-foreground">
                    {model.detail}
                    <span className="mt-1 block font-mono text-[10px] uppercase tracking-[0.16em]">
                      {model.rhythm}
                    </span>
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </section>

      <section aria-labelledby="process-title" className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="max-w-3xl">
          <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-primary">Process</p>
          <h2 id="process-title" className="mt-3 font-serif text-4xl leading-[1.02] sm:text-5xl">
            Discover, design, build, prove, hand over.
          </h2>
          <p className="mt-5 text-lg leading-relaxed text-muted-foreground">
            Prove is not a slide. It is a working demo, the tests behind the claims and a handover
            pack someone else can follow.
          </p>
        </div>
        <ol className="mt-10 grid gap-4 md:grid-cols-5">
          {processSteps.map((step, index) => (
            <li key={step.id} className="rounded-3xl border border-border bg-card/60 p-5">
              <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-primary">
                0{index + 1}
              </span>
              <h3 className="mt-3 font-serif text-2xl leading-tight">{step.name}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{step.detail}</p>
            </li>
          ))}
        </ol>
      </section>

      <section aria-labelledby="honesty-title" className="border-y border-border/70 bg-card/40">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <h2 id="honesty-title" className="font-serif text-4xl sm:text-5xl">
            An honest fit matters more than a sale.
          </h2>
          <div className="mt-10 grid gap-8 md:grid-cols-3">
            {serviceHonesty.map((note) => (
              <div key={note.id}>
                <h3 className="font-mono text-[10px] uppercase tracking-[0.18em] text-primary">
                  {note.title}
                </h3>
                <ul className="mt-4 space-y-2 text-sm leading-relaxed text-muted-foreground">
                  {note.items.map((item) => (
                    <li key={item} className="border-l border-border pl-3">
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section aria-labelledby="faq-title" className="mx-auto max-w-4xl px-4 py-20 sm:px-6 lg:px-8">
        <h2 id="faq-title" className="font-serif text-4xl sm:text-5xl">
          Before you write.
        </h2>
        <div className="mt-8 border-t border-border">
          {serviceFaq.map((item) => (
            <details key={item.q} className="border-b border-border py-4">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-semibold [&::-webkit-details-marker]:hidden">
                {item.q}
                <span aria-hidden="true" className="text-xl text-primary">
                  +
                </span>
              </summary>
              <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground">{item.a}</p>
            </details>
          ))}
        </div>
      </section>

      <section className="px-4 pb-20 sm:px-6 lg:px-8">
        <div className="relative isolate mx-auto max-w-7xl overflow-hidden rounded-[2rem] border border-border bg-card px-6 py-14 sm:px-10 lg:px-16 lg:py-20">
          <div aria-hidden="true" className="hero-glow pointer-events-none absolute inset-0 -z-10 opacity-80" />
          <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-primary">Next</p>
          <h2 className="mt-4 max-w-2xl font-serif text-5xl leading-[0.98] sm:text-6xl">
            Start with the problem, not the price.
          </h2>
          <p className="mt-5 max-w-xl text-lg leading-relaxed text-muted-foreground">
            A short email is enough: what you are building, the deadline and the constraints. I will
            reply with a straight answer about fit.
          </p>
          <a
            href={mailtoHref("Project enquiry", projectPrompt)}
            className="group mt-8 inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition hover:brightness-105"
          >
            Email the brief
            <ArrowUpRight className="size-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" aria-hidden="true" />
          </a>
        </div>
      </section>
    </>
  )
}
```

- [x] **Step 5: Run the test to verify it passes**

Run: `npm run build && npx playwright test tests/e2e/services.spec.ts`
Expected: 4 passed in each project (8 total).

- [x] **Step 6: Run the accessibility gate**

Run: `npx playwright test tests/e2e/a11y.spec.ts --project=desktop`
Expected: all pass, including `/services`.

- [x] **Step 7: Commit**

```bash
git add src/lib/mail.ts src/pages/ServicesPage.tsx tests/e2e/services.spec.ts
git commit -m "feat: build the services page"
```

---

### Task 3: About data, story timeline and the About page

**Files:**
- Modify: `src/data/about.ts` (replace the file)
- Modify: `src/data/profile.ts` (principles proof slugs, now items, remove `aboutParagraphs`)
- Modify: `src/pages/AboutPage.tsx` (replace the placeholder)
- Create: `src/components/about/EvidenceTag.tsx`
- Create: `src/components/about/StoryTimeline.tsx`
- Create: `src/components/about/StackGrid.tsx`
- Create: `src/components/about/PhotoGrid.tsx`
- Create: `tests/e2e/about.spec.ts`
- Modify: `tests/unit/content.test.ts`

**Interfaces:**
- Produces: `EvidenceLink { label: string; to: string }`, `AboutChapter { id: string; date: string; year: string; title: string; body: string; evidence: EvidenceLink[] }`, `aboutIntro: string[]`, `aboutChapters: AboutChapter[]`, `stackProof: Record<string, EvidenceLink[]>`.
- Consumes: `principles`, `studio`, `nowItems`, `languages`, `talk` from `src/data/profile`; `aiSkills`, `techSkills` from `src/data/skills`; `gallery` from `src/data/gallery`; `services` from `src/data/services`; `Photo` and `Dialog`.

- [x] **Step 1: Write the failing unit test**

Add to `tests/unit/content.test.ts`:

```ts
import { aboutChapters, aboutIntro, stackProof } from "@/data/about"
import { principles } from "@/data/profile"

it("tells the story in seven dated chapters with evidence", () => {
  expect(aboutIntro.length).toBeGreaterThanOrEqual(3)
  expect(aboutChapters).toHaveLength(7)
  for (const chapter of aboutChapters) {
    expect(chapter.date.trim()).not.toBe("")
    expect(chapter.title.trim()).not.toBe("")
    expect(chapter.body.trim()).not.toBe("")
    expect(chapter.evidence.length).toBeGreaterThanOrEqual(2)
    for (const link of chapter.evidence) {
      expect(link.label.trim()).not.toBe("")
      expect(link.to.startsWith("/") || link.to.startsWith("https://")).toBe(true)
    }
  }
})

it("keeps every principle and stack proof on a real case study", () => {
  const studySlugs = new Set(caseStudies.map((study) => study.slug))
  for (const principle of principles) {
    expect(principle.proof.length).toBeGreaterThanOrEqual(2)
    for (const proof of principle.proof) {
      expect(studySlugs.has(proof.slug)).toBe(true)
    }
  }
  for (const links of Object.values(stackProof)) {
    for (const link of links) {
      if (!link.to.startsWith("/work/")) continue
      expect(studySlugs.has(link.to.replace("/work/", ""))).toBe(true)
    }
  }
})
```

- [x] **Step 2: Run the test to verify it fails**

Run: `npm test -- tests/unit/content.test.ts`
Expected: FAIL because `aboutIntro` and `stackProof` are not exported and the chapters still use strings for `proof`.

- [x] **Step 3: Replace `src/data/about.ts`**

Use exactly this content:

```ts
import { links } from "./profile"

export interface EvidenceLink {
  label: string
  to: string
}

export interface AboutChapter {
  id: string
  date: string
  /** Short label for the timeline rail. */
  year: string
  title: string
  body: string
  evidence: EvidenceLink[]
}

export const aboutIntro = [
  "I am Kone Tshivhinda, an AI systems engineer and full-stack developer in Johannesburg. I build software that shows its evidence, earns its autonomy and leaves the consequential decisions to a person.",
  "I work mostly solo, from the first sketch to the deployed system. I founded K-ONE IT SOLUTIONS in 2025, and by day I am a founding engineer on a law firm's new engineering team.",
  "The through-line is trust: local models when data must stay home, a human gate before anything irreversible, and a written record of what is real and what is not.",
]

export const aboutChapters: AboutChapter[] = [
  {
    id: "learning",
    date: "2024 – 2025",
    year: "Before 2025",
    title: "Learning the unglamorous parts",
    body: "IBM Full Stack Software Developer coursework, then a long stretch of building small things to understand how the pieces fit: APIs, databases, deployment and the parts that decide whether software survives contact with a real user.",
    evidence: [
      { label: "IBM Full Stack certificate", to: links.ibmCert },
      { label: "Git and GitHub exercises", to: "https://github.com/konethegreat/github-final-project" },
    ],
  },
  {
    id: "studio",
    date: "2025",
    year: "2025",
    title: "A studio, scoped small",
    body: "I founded K-ONE IT SOLUTIONS and shipped its first work: a company site, a React social platform and a server health monitor in Docker. It taught me to scope, quote and deliver without a team to hide behind.",
    evidence: [
      { label: "The K-ONE case study", to: "/work/k-one" },
      { label: "K-One Solutions Media source", to: "https://github.com/konethegreat/k-one-solutions-media" },
    ],
  },
  {
    id: "civic-legal",
    date: "2025 – 2026",
    year: "2025–26",
    title: "Civic tech and the trust problem",
    body: "MuniSolve ZA put municipal faults on a live map and a bounded assistant behind them. TimeLex asked the harder question in legal work: how much can a system do before a person must sign off? Both projects moved the same idea forward: usefulness without pretending the machine is the authority.",
    evidence: [
      { label: "MuniSolve ZA", to: "/work/munisolve" },
      { label: "TimeLex", to: "/work/timelex" },
    ],
  },
  {
    id: "ai-systems",
    date: "2026",
    year: "2026",
    title: "Systems that show their working",
    body: "Vigil made data residency a structural constraint, not a setting. ClearCut made correctness the core of an agent product. Reservoir made consent part of the data model. Different problems, the same question: what should the machine never decide alone?",
    evidence: [
      { label: "Vigil", to: "/work/vigil" },
      { label: "ClearCut", to: "/work/clearcut" },
      { label: "Reservoir", to: "/work/reservoir" },
    ],
  },
  {
    id: "firm-team",
    date: "June 2026 – now",
    year: "2026",
    title: "Inside a law firm, building the team",
    body: "By day I am a founding engineer on a six-person team building a law firm's software engineering department. The work is multi-tenant, POPIA-aligned and grounded in human sign-off: hybrid retrieval, MCP tools, local models for sensitive material and a written record for every consequential decision. The firm's code is private, so the evidence here is the public work built alongside it in the same patterns.",
    evidence: [
      { label: "TimeLex design", to: "/work/timelex" },
      { label: "ClearCut MCP tools", to: "/work/clearcut" },
    ],
  },
  {
    id: "k-one",
    date: "2025 – now",
    year: "Now",
    title: "K-ONE, still small on purpose",
    body: "K-ONE IT SOLUTIONS is the studio: I scope the work, build it and answer for it afterwards. The company site, the social platform and the health monitor were the first proof. Everything since has run through the same channel, one project at a time.",
    evidence: [
      { label: "The K-ONE case study", to: "/work/k-one" },
      { label: "The studio site", to: "https://k-one-it-solutions-website.erictshivhinda.workers.dev/" },
    ],
  },
  {
    id: "next",
    date: "Now",
    year: "Now",
    title: "What comes next",
    body: "I am learning Rust in public, keeping the UI Vault as a shared bench of patterns, and turning Vigil into a full public case study. The next chapter is more of the same work, documented properly.",
    evidence: [
      { label: "UI Vault", to: "/work/ui-vault" },
      { label: "The playground", to: "/playground" },
      { label: "This site's credits", to: "/credits" },
    ],
  },
]

/** Proof links for the stack groups in `src/data/skills.ts`. */
export const stackProof: Record<string, EvidenceLink[]> = {
  agentic: [
    { label: "Vigil", to: "/work/vigil" },
    { label: "TimeLex", to: "/work/timelex" },
  ],
  rag: [
    { label: "Vigil", to: "/work/vigil" },
    { label: "Reservoir", to: "/work/reservoir" },
  ],
  llm: [
    { label: "SA-JAS", to: "/work/sa-jas" },
    { label: "ClearCut", to: "/work/clearcut" },
  ],
  eval: [
    { label: "TimeLex", to: "/work/timelex" },
    { label: "ClearCut", to: "/work/clearcut" },
  ],
  models: [
    { label: "Vigil", to: "/work/vigil" },
    { label: "TimeLex", to: "/work/timelex" },
  ],
  devtools: [{ label: "UI Vault", to: "/work/ui-vault" }],
  languages: [
    { label: "ClearCut", to: "/work/clearcut" },
    { label: "Vigil", to: "/work/vigil" },
  ],
  backend: [
    { label: "ClearCut", to: "/work/clearcut" },
    { label: "MuniSolve ZA", to: "/work/munisolve" },
  ],
  frontend: [
    { label: "UI Vault", to: "/work/ui-vault" },
    { label: "MuniSolve ZA", to: "/work/munisolve" },
  ],
  data: [
    { label: "Vigil", to: "/work/vigil" },
    { label: "ClearCut", to: "/work/clearcut" },
  ],
  cloud: [
    { label: "MuniSolve ZA", to: "/work/munisolve" },
    { label: "K-ONE", to: "/work/k-one" },
  ],
  security: [
    { label: "ClearCut", to: "/work/clearcut" },
    { label: "TimeLex", to: "/work/timelex" },
  ],
  practice: [
    { label: "Vigil", to: "/work/vigil" },
    { label: "TimeLex", to: "/work/timelex" },
  ],
}
```

- [x] **Step 4: Fix the principle proof slugs and now items**

In `src/data/profile.ts`, replace the `principles` array with:

```ts
export const principles: Principle[] = [
  {
    id: "humans-sign-off",
    title: "Humans sign off",
    line: "AI drafts. People decide.",
    body: "Every system I build has a human gate before anything consequential happens: analyst review before a model's proposal is published, a person approving every drafted time entry, a person pressing Submit on every application. AI never finalises anything on its own and never presses Submit.",
    proof: [
      { label: "Vigil", slug: "vigil" },
      { label: "SA-JAS", slug: "sa-jas" },
      { label: "TimeLex", slug: "timelex" },
    ],
  },
  {
    id: "cheap-first",
    title: "Cheap first, capped always",
    line: "Predictable LLM spend by design.",
    body: "Usage ledgers, daily budget guards and per-hour rate limits keep AI features useful without surprise invoices, and where it fits a local model does the work with no per-token cost.",
    proof: [
      { label: "SA-JAS", slug: "sa-jas" },
      { label: "MuniSolve ZA", slug: "munisolve" },
      { label: "TimeLex", slug: "timelex" },
    ],
  },
  {
    id: "honest-status",
    title: "Honest about status",
    line: "Live, simulated, private or demo, said plainly.",
    body: "Claims match verified behaviour. Public snapshots say what they are, simulated integrations are labelled as simulated, and licences are respected. If it has not been verified, I do not call it production-ready.",
    proof: [
      { label: "ClearCut", slug: "clearcut" },
      { label: "TimeLex", slug: "timelex" },
      { label: "SA-JAS", slug: "sa-jas" },
      { label: "UI Vault", slug: "ui-vault" },
    ],
  },
  {
    id: "sovereign",
    title: "Sovereign by design",
    line: "Local models and data that stay home.",
    body: "Privacy-sensitive work runs on local or open-weight models, with POPIA-aware data handling, so prompts and evidence do not have to leave the machine, or the country.",
    proof: [
      { label: "Vigil", slug: "vigil" },
      { label: "TimeLex", slug: "timelex" },
      { label: "Reservoir", slug: "reservoir" },
    ],
  },
]
```

Replace `nowItems` with:

```ts
export const nowItems = [
  { label: "Founder", detail: "K-ONE IT SOLUTIONS" },
  { label: "Building", detail: "ClearCut, TimeLex and this portfolio" },
  { label: "Learning", detail: "Rust, one small program at a time" },
  { label: "Next", detail: "A public case study of Vigil" },
] as const
```

Delete the unused `aboutParagraphs` export from `src/data/profile.ts`.

- [x] **Step 5: Add the small About components**

Create `src/components/about/EvidenceTag.tsx`:

```tsx
import { ArrowUpRight } from "lucide-react"
import { Link } from "@/components/ui/link"
import type { EvidenceLink } from "@/data/about"
import { cn } from "@/lib/utils"

export function EvidenceTag({ link, className }: { link: EvidenceLink; className?: string }) {
  const classes = cn(
    "inline-flex items-center gap-1 rounded-full border border-border px-3 py-1 text-xs font-medium transition hover:border-primary hover:text-primary",
    className,
  )
  const content = (
    <>
      {link.label}
      <ArrowUpRight className="size-3" aria-hidden="true" />
    </>
  )
  if (link.to.startsWith("/")) {
    return (
      <Link to={link.to} className={classes}>
        {content}
      </Link>
    )
  }
  return (
    <a href={link.to} target="_blank" rel="noopener noreferrer" className={classes}>
      {content}
    </a>
  )
}
```

Create `src/components/about/StoryTimeline.tsx`:

```tsx
import { useEffect, useRef, useState } from "react"
import { EvidenceTag } from "@/components/about/EvidenceTag"
import type { AboutChapter } from "@/data/about"
import { cn } from "@/lib/utils"

export function StoryTimeline({ chapters }: { chapters: AboutChapter[] }) {
  const [active, setActive] = useState(chapters[0]?.id ?? "")
  const refs = useRef(new Map<string, HTMLElement>())

  useEffect(() => {
    const nodes = Array.from(refs.current.values())
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue
          const id = entry.target.getAttribute("data-chapter")
          if (id) setActive(id)
        }
      },
      { rootMargin: "-30% 0px -60% 0px" },
    )
    for (const node of nodes) observer.observe(node)
    return () => observer.disconnect()
  }, [chapters])

  return (
    <div className="grid gap-10 lg:grid-cols-[14rem_1fr]">
      <nav aria-label="Story timeline" className="hidden lg:block">
        <ol className="sticky top-24 space-y-1">
          {chapters.map((chapter) => (
            <li key={chapter.id}>
              <a
                href={`#${chapter.id}`}
                aria-current={active === chapter.id ? "location" : undefined}
                className={cn(
                  "block rounded-xl border px-3 py-2 transition",
                  active === chapter.id
                    ? "border-primary/40 bg-card"
                    : "border-transparent hover:border-border hover:bg-card/60",
                )}
              >
                <span className="block font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
                  {chapter.year}
                </span>
                <span className="mt-1 block text-sm font-medium">{chapter.title}</span>
              </a>
            </li>
          ))}
        </ol>
      </nav>

      <ol aria-label="Story chapters" className="relative space-y-10 border-l border-border pl-6">
        {chapters.map((chapter) => (
          <li
            key={chapter.id}
            id={chapter.id}
            data-chapter={chapter.id}
            ref={(node) => {
              if (node) refs.current.set(chapter.id, node)
            }}
            className="relative scroll-mt-24"
          >
            <span
              aria-hidden="true"
              className="absolute -left-[1.9rem] top-1.5 size-2.5 rounded-full border-2 border-background bg-primary"
            />
            <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-primary">{chapter.date}</p>
            <h3 className="mt-2 font-serif text-3xl leading-tight">{chapter.title}</h3>
            <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground">{chapter.body}</p>
            <div className="mt-4 flex flex-wrap gap-2">
              {chapter.evidence.map((link) => (
                <EvidenceTag key={link.to} link={link} />
              ))}
            </div>
          </li>
        ))}
      </ol>
    </div>
  )
}
```

Create `src/components/about/StackGrid.tsx`:

```tsx
import { EvidenceTag } from "@/components/about/EvidenceTag"
import { stackProof } from "@/data/about"
import { aiSkills, techSkills } from "@/data/skills"

export function StackGrid() {
  const groups = [...aiSkills, ...techSkills]
  return (
    <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
      {groups.map((group) => {
        const proof = stackProof[group.id] ?? []
        return (
          <article key={group.id} className="flex h-full flex-col rounded-3xl border border-border bg-card/60 p-5">
            <h3 className="font-serif text-2xl leading-tight">{group.title}</h3>
            {group.blurb && <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{group.blurb}</p>}
            <ul className="mt-4 flex flex-wrap gap-1.5">
              {group.items.map((item) => (
                <li
                  key={item}
                  className="rounded-md border border-border bg-muted/40 px-2 py-1 font-mono text-[10px] leading-none text-muted-foreground"
                >
                  {item}
                </li>
              ))}
            </ul>
            {proof.length > 0 && (
              <div className="mt-auto flex flex-wrap gap-2 pt-5">
                {proof.map((link) => (
                  <EvidenceTag key={link.to} link={link} />
                ))}
              </div>
            )}
          </article>
        )
      })}
    </div>
  )
}
```

Create `src/components/about/PhotoGrid.tsx`:

```tsx
import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog"
import { Photo } from "@/components/ui/photo"
import { gallery } from "@/data/gallery"

export function PhotoGrid() {
  const [active, setActive] = useState<number | null>(null)
  const item = active === null ? null : gallery[active]

  return (
    <>
      <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {gallery.map((photo, index) => (
          <li key={photo.photo} className={index === 0 ? "sm:col-span-2 lg:col-span-1" : undefined}>
            <button
              type="button"
              onClick={() => setActive(index)}
              aria-label={`Open photo: ${photo.caption}`}
              className="group relative block w-full overflow-hidden rounded-2xl border border-border bg-card text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <Photo
                name={photo.photo}
                alt=""
                sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                className="aspect-[4/3] w-full object-cover transition duration-500 group-hover:scale-[1.03]"
              />
              <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent px-4 pb-3 pt-10 text-sm font-medium text-white">
                {photo.caption}
              </span>
            </button>
          </li>
        ))}
      </ul>

      <Dialog open={item !== null} onOpenChange={(open) => !open && setActive(null)}>
        <DialogContent variant="lightbox" closeLabel="Close photo" className="p-3 sm:p-5">
          {item && (
            <div>
              <DialogTitle className="sr-only">{item.caption}</DialogTitle>
              <DialogDescription className="sr-only">{item.alt}</DialogDescription>
              <Photo
                name={item.photo}
                alt={item.alt}
                sizes="96vw"
                className="mx-auto max-h-[78dvh] w-full rounded-xl object-contain"
              />
              <p className="mt-3 px-2 pb-1 text-sm text-slate-200">{item.caption}</p>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}
```

- [x] **Step 6: Replace the About page**

Replace `src/pages/AboutPage.tsx` with:

```tsx
import { ArrowUpRight } from "lucide-react"
import { PhotoGrid } from "@/components/about/PhotoGrid"
import { StackGrid } from "@/components/about/StackGrid"
import { StoryTimeline } from "@/components/about/StoryTimeline"
import { Link } from "@/components/ui/link"
import { Photo } from "@/components/ui/photo"
import { aboutChapters, aboutIntro } from "@/data/about"
import {
  languages,
  nowItems,
  principles,
  studio,
  talk,
} from "@/data/profile"
import { services } from "@/data/services"

export function AboutPage() {
  return (
    <>
      <section className="relative isolate overflow-hidden px-4 pb-12 pt-12 sm:px-6 sm:pt-16 lg:px-8">
        <div aria-hidden="true" className="hero-grid pointer-events-none absolute inset-0 -z-10 opacity-50" />
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:items-end lg:gap-16">
          <div className="overflow-hidden rounded-[2rem] border border-border bg-card">
            <Photo
              name="portrait"
              alt="Portrait of Kone Tshivhinda."
              priority
              sizes="(min-width: 1024px) 32vw, 100vw"
              className="aspect-[3/4] w-full object-cover"
            />
          </div>
          <div>
            <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-primary">About</p>
            <h1 className="mt-4 max-w-3xl text-balance font-serif text-5xl leading-[0.94] sm:text-7xl">
              Kone Tshivhinda
            </h1>
            <p className="mt-3 font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
              AI systems engineer · Full-stack developer · Johannesburg
            </p>
            <div className="mt-6 space-y-4 text-pretty text-lg leading-relaxed text-muted-foreground">
              {aboutIntro.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section aria-labelledby="story-title" className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
        <div className="max-w-3xl">
          <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-primary">Story</p>
          <h2 id="story-title" className="mt-3 font-serif text-4xl leading-[1.02] sm:text-5xl">
            Seven chapters, with the evidence attached.
          </h2>
          <p className="mt-5 text-lg leading-relaxed text-muted-foreground">
            The dates and links below are the public record. If a claim is not backed by something
            openable, it is not on this page.
          </p>
        </div>
        <div className="mt-12">
          <StoryTimeline chapters={aboutChapters} />
        </div>
      </section>

      <section aria-labelledby="principles-title" className="border-y border-border/70 bg-card/40">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-primary">Principles</p>
            <h2 id="principles-title" className="mt-3 font-serif text-4xl leading-[1.02] sm:text-5xl">
              Four rules the work has to pass.
            </h2>
          </div>
          <ul className="mt-10 grid gap-5 md:grid-cols-2">
            {principles.map((principle) => (
              <li key={principle.id}>
                <article className="flex h-full flex-col rounded-3xl border border-border bg-background/60 p-6">
                  <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-primary">{principle.line}</p>
                  <h3 className="mt-3 font-serif text-3xl leading-tight">{principle.title}</h3>
                  <p className="mt-3 flex-1 text-sm leading-relaxed text-muted-foreground">{principle.body}</p>
                  <div className="mt-5 flex flex-wrap gap-2 border-t border-border pt-4">
                    {principle.proof.map((proof) => (
                      <Link
                        key={proof.slug}
                        to={`/work/${proof.slug}`}
                        className="inline-flex items-center gap-1 rounded-full border border-border px-3 py-1 text-xs font-medium transition hover:border-primary hover:text-primary"
                      >
                        {proof.label}
                        <ArrowUpRight className="size-3" aria-hidden="true" />
                      </Link>
                    ))}
                  </div>
                </article>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section aria-labelledby="stack-title" className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="max-w-3xl">
          <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-primary">Stack</p>
          <h2 id="stack-title" className="mt-3 font-serif text-4xl leading-[1.02] sm:text-5xl">
            Tools, grouped by the job.
          </h2>
          <p className="mt-5 text-lg leading-relaxed text-muted-foreground">
            A tool earns its place by surviving a project. Each group links to work where it was
            actually used.
          </p>
        </div>
        <div className="mt-10">
          <StackGrid />
        </div>
      </section>

      <section aria-labelledby="studio-title" className="border-y border-border/70 bg-card/40">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
            <div>
              <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-primary">Studio</p>
              <h2 id="studio-title" className="mt-3 font-serif text-4xl leading-[1.02] sm:text-5xl">
                {studio.name}
              </h2>
              <p className="mt-3 text-sm font-medium text-muted-foreground">
                {studio.role} · since {studio.since}
              </p>
              <p className="mt-5 max-w-md text-sm leading-relaxed text-muted-foreground">{studio.blurb}</p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Link
                  to="/work/k-one"
                  className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition hover:brightness-105"
                >
                  Open the studio case study
                  <ArrowUpRight className="size-4" aria-hidden="true" />
                </Link>
                <a
                  href="https://k-one-it-solutions-website.erictshivhinda.workers.dev/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-full border border-border px-5 py-2.5 text-sm font-semibold transition hover:border-primary hover:text-primary"
                >
                  Visit the studio site
                  <ArrowUpRight className="size-4" aria-hidden="true" />
                </a>
              </div>
            </div>
            <div>
              <h3 className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
                Services
              </h3>
              <ul className="mt-3 grid gap-2 sm:grid-cols-2">
                {services.map((service) => (
                  <li key={service.id} className="rounded-xl border border-border px-3 py-2 text-sm">
                    {service.title}
                  </li>
                ))}
              </ul>
              <h3 className="mt-8 font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
                Delivered work
              </h3>
              <ul className="mt-3 divide-y divide-border border-y border-border">
                {studio.works.map((work) => (
                  <li key={work.title} className="py-3">
                    <a
                      href={work.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-semibold underline-offset-4 hover:underline"
                    >
                      {work.title}
                    </a>
                    <p className="mt-1 text-sm text-muted-foreground">{work.detail}</p>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section aria-labelledby="beyond-title" className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="max-w-3xl">
          <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-primary">Beyond the code</p>
          <h2 id="beyond-title" className="mt-3 font-serif text-4xl leading-[1.02] sm:text-5xl">
            The person outside the terminal.
          </h2>
          <p className="mt-5 text-lg leading-relaxed text-muted-foreground">
            A few frames that do not fit a case study. Open one for the full photo.
          </p>
        </div>
        <div className="mt-10">
          <PhotoGrid />
        </div>
      </section>

      <section aria-labelledby="now-title" className="border-y border-border/70 bg-card/40">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:px-8">
          <div>
            <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-primary">Now</p>
            <h2 id="now-title" className="mt-3 font-serif text-4xl leading-[1.02] sm:text-5xl">
              What the week looks like.
            </h2>
            <dl className="mt-8 space-y-5">
              {nowItems.map((item) => (
                <div key={item.label} className="border-l-2 border-primary/40 pl-4">
                  <dt className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
                    {item.label}
                  </dt>
                  <dd className="mt-1 text-sm leading-relaxed">{item.detail}</dd>
                </div>
              ))}
            </dl>
            <h3 className="mt-10 font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
              Languages
            </h3>
            <ul className="mt-3 flex flex-wrap gap-2">
              {languages.map((language) => (
                <li key={language.name} className="rounded-full border border-border px-3 py-1 text-sm">
                  {language.name} · {language.level}
                </li>
              ))}
            </ul>
          </div>

          <article className="flex flex-col justify-between rounded-3xl border border-border bg-background/60 p-6 sm:p-8">
            <div>
              <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-teal">
                {talk.kind} · {talk.when}
              </p>
              <h3 className="mt-4 max-w-lg font-serif text-3xl leading-tight sm:text-4xl">{talk.title}</h3>
              <p className="mt-4 max-w-xl text-sm leading-relaxed text-muted-foreground">{talk.blurb}</p>
            </div>
            <p className="mt-8 font-mono text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
              {talk.audience}
            </p>
          </article>
        </div>
      </section>

      <section className="px-4 py-20 sm:px-6 lg:px-8">
        <div className="relative isolate mx-auto max-w-7xl overflow-hidden rounded-[2rem] border border-border bg-card px-6 py-14 sm:px-10 lg:px-16 lg:py-20">
          <div aria-hidden="true" className="hero-glow pointer-events-none absolute inset-0 -z-10 opacity-80" />
          <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-primary">Next</p>
          <h2 className="mt-4 max-w-2xl font-serif text-5xl leading-[0.98] sm:text-6xl">
            The work is the public record.
          </h2>
          <p className="mt-5 max-w-xl text-lg leading-relaxed text-muted-foreground">
            If something here looks like a problem you are carrying, bring it. A short conversation
            is enough to know whether I can help.
          </p>
          <Link
            to="/contact"
            className="group mt-8 inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition hover:brightness-105"
          >
            Start a conversation
            <ArrowUpRight className="size-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" aria-hidden="true" />
          </Link>
        </div>
      </section>
    </>
  )
}
```

- [x] **Step 7: Write the failing About end-to-end test**

Create `tests/e2e/about.spec.ts`:

```ts
import { test, expect } from "@playwright/test"

test("about shows the portrait, story and dated evidence", async ({ page }) => {
  await page.goto("/about")
  await expect(page.getByRole("heading", { level: 1 })).toContainText("Kone Tshivhinda")
  await expect(page.locator("main img").first()).toBeVisible()
  const chapters = page.getByRole("list", { name: "Story chapters" })
  await expect(chapters.getByRole("listitem")).toHaveCount(7)
  await expect(chapters.getByRole("link", { name: "Vigil" })).toHaveAttribute("href", "/work/vigil")
  await expect(chapters.getByRole("link", { name: "UI Vault" })).toHaveAttribute("href", "/work/ui-vault")
})

test("about principles and stack link to real case studies", async ({ page }) => {
  await page.goto("/about")
  const principles = page.getByRole("region", { name: "Four rules the work has to pass." })
  await expect(principles.getByRole("link", { name: "Vigil" }).first()).toHaveAttribute("href", "/work/vigil")
  const stack = page.getByRole("region", { name: "Tools, grouped by the job." })
  await expect(stack.getByRole("link", { name: "ClearCut" }).first()).toHaveAttribute("href", "/work/clearcut")
})

test("a gallery photo opens in a dialog and returns focus", async ({ page }) => {
  await page.goto("/about")
  const opener = page.getByRole("button", { name: "Open photo: Graduation day." })
  await opener.click()
  await expect(page.getByRole("dialog")).toBeVisible()
  await page.keyboard.press("Escape")
  await expect(page.getByRole("dialog")).toBeHidden()
  await expect(opener).toBeFocused()
})

test("about does not scroll sideways at 320px", async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 720 })
  await page.goto("/about")
  const overflow = await page.evaluate(
    () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
  )
  expect(overflow).toBeLessThanOrEqual(1)
})
```

- [x] **Step 8: Run the unit test, then the About test**

Run: `npm run typecheck && npm test -- tests/unit/content.test.ts`
Expected: PASS.

Run: `npm run build && npx playwright test tests/e2e/about.spec.ts`
Expected: 8 passed (4 tests across 2 projects).

- [x] **Step 9: Run the accessibility gate**

Run: `npx playwright test tests/e2e/a11y.spec.ts --project=desktop`
Expected: all pass, including the lightbox-free About page and the existing pages.

- [x] **Step 10: Commit**

```bash
git add src/data/about.ts src/data/profile.ts src/pages/AboutPage.tsx src/components/about tests/e2e/about.spec.ts tests/unit/content.test.ts
git commit -m "feat: rebuild the about page around the story and proof"
```

---

### Task 4: Playground shelf, effects switch and light page composition

**Files:**
- Create: `src/data/playground.ts`
- Create: `src/components/playground/EffectsSwitch.tsx`
- Create: `src/components/playground/VaultShelf.tsx`
- Modify: `src/pages/PlaygroundPage.tsx` (replace the file)
- Create: `tests/e2e/playground.spec.ts`

**Interfaces:**
- Produces: `VaultItem { id: string; name: string; detail: string; live: { label: string; to: string }; credit: { author: string; license: string; href: string } }`, `vaultShelf: VaultItem[]`, `vaultHref: string`.
- Consumes: `useFx` from `src/lib/fx`, `Lab` from `src/components/sections/Lab`, `projectBySlug` for the vault URL.

- [x] **Step 1: Write the failing test**

Create `tests/e2e/playground.spec.ts`:

```ts
import { test, expect } from "@playwright/test"

test("the effects switch explains itself and turns autoplay off", async ({ page }) => {
  await page.goto("/playground")
  const toggle = page.getByRole("switch", { name: "Ambient effects" })
  await expect(toggle).toHaveAttribute("aria-checked", "true")
  await toggle.click()
  await expect(toggle).toHaveAttribute("aria-checked", "false")
  expect(await page.evaluate(() => localStorage.getItem("kt-effects"))).toBe("off")
  await expect(page.getByText(/wait for you to press play/)).toBeVisible()
})

test("the UI Vault shelf shows live work, credits and the full vault link", async ({ page }) => {
  await page.goto("/playground")
  const shelf = page.getByRole("region", { name: "From the vault, running here." })
  await expect(shelf.getByRole("article")).toHaveCount(3)
  await expect(shelf.getByRole("link", { name: "Kedhareswer Naidu, MIT" }).first()).toHaveAttribute(
    "href",
    "https://21st.dev/@kedhareswer/components/glass-folder-cards",
  )
  await expect(shelf.getByRole("link", { name: "Open the full vault" })).toHaveAttribute(
    "href",
    "https://konethegreat.github.io/ui-vault/",
  )
})

test("the lab tabs still switch panels", async ({ page }) => {
  await page.goto("/playground")
  await page.getByRole("tab", { name: "Agent loop" }).click()
  await expect(page.getByRole("tab", { name: "Agent loop" })).toHaveAttribute("aria-selected", "true")
  await expect(page.getByRole("tabpanel")).toBeVisible()
})

test("playground does not scroll sideways at 320px", async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 720 })
  await page.goto("/playground")
  const overflow = await page.evaluate(
    () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
  )
  expect(overflow).toBeLessThanOrEqual(1)
})
```

- [x] **Step 2: Run the test to verify it fails**

Run: `npm run build && npx playwright test tests/e2e/playground.spec.ts --project=desktop`
Expected: FAIL because there is no switch, no shelf and no full vault link.

- [x] **Step 3: Add the shelf data**

Create `src/data/playground.ts`:

```ts
import { projectBySlug } from "./projects"

export interface VaultItem {
  id: string
  name: string
  detail: string
  live: { label: string; to: string }
  credit: { author: string; license: string; href: string }
}

const vault = projectBySlug("ui-vault")
export const vaultHref =
  vault?.links.find((link) => link.kind === "live")?.href ?? "https://konethegreat.github.io/ui-vault/"

export const vaultShelf: VaultItem[] = [
  {
    id: "glass-folder",
    name: "Glass folder cards",
    detail:
      "Folder covers that open into the studio archive. On the home page, three folders hold the eight case studies.",
    live: { label: "See it on the home page", to: "/" },
    credit: {
      author: "Kedhareswer Naidu",
      license: "MIT",
      href: "https://21st.dev/@kedhareswer/components/glass-folder-cards",
    },
  },
  {
    id: "mascot",
    name: "Mascot hero",
    detail:
      "The illustrated character in the home hero, adapted to a dark-skinned character and the site palette.",
    live: { label: "See it on the home page", to: "/" },
    credit: {
      author: "Kedhareswer Naidu",
      license: "MIT",
      href: "https://21st.dev/@kedhareswer/components/mascot-portfolio-hero",
    },
  },
  {
    id: "backgrounds",
    name: "Particle and cursor backgrounds",
    detail:
      "Ambient particle and cursor effects from the vault. They are optional everywhere and pause when the visitor turns effects off.",
    live: { label: "Open the vault", to: vaultHref },
    credit: { author: "Kone Tshivhinda", license: "Original", href: vaultHref },
  },
]
```

- [x] **Step 4: Add the effects switch**

Create `src/components/playground/EffectsSwitch.tsx`:

```tsx
import { useFx } from "@/lib/fx"
import { cn } from "@/lib/utils"

export function EffectsSwitch() {
  const { effects, toggleEffects, reduced } = useFx()
  const on = effects && !reduced

  return (
    <div className="rounded-3xl border border-border bg-card/60 p-5 sm:p-6">
      <div className="flex flex-wrap items-start justify-between gap-5">
        <div className="max-w-2xl">
          <h2 className="text-lg font-semibold">Ambient effects</h2>
          <p id="effects-note" className="mt-2 text-sm leading-relaxed text-muted-foreground">
            {reduced
              ? "Your system asks for reduced motion, so effects stay off. Every demo still works when you press play."
              : on
                ? "On, the demos autoplay and ambient motion runs. Off, they wait for you to press play. Every demo still works either way."
                : "Off, the demos wait for you to press play and ambient motion is paused. Every demo still works."}
          </p>
        </div>
        <button
          type="button"
          role="switch"
          aria-checked={on}
          aria-describedby="effects-note"
          disabled={reduced}
          onClick={toggleEffects}
          className={cn(
            "relative inline-flex h-8 w-14 shrink-0 items-center rounded-full border border-border transition disabled:cursor-not-allowed disabled:opacity-60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
            on ? "bg-primary" : "bg-muted",
          )}
        >
          <span className="sr-only">Ambient effects</span>
          <span
            aria-hidden="true"
            className={cn(
              "absolute left-1 size-6 rounded-full bg-background shadow-sm transition-transform",
              on ? "translate-x-[22px]" : "translate-x-0",
            )}
          />
        </button>
      </div>
    </div>
  )
}
```

The switch is a `w-14` track with a `size-6` knob inset by `left-1`, so the knob travels 22px from off to on. Use this version exactly.

- [x] **Step 5: Add the shelf component**

Create `src/components/playground/VaultShelf.tsx`:

```tsx
import { ArrowUpRight } from "lucide-react"
import { Link } from "@/components/ui/link"
import { vaultHref, vaultShelf } from "@/data/playground"

export function VaultShelf() {
  return (
    <section aria-labelledby="vault-title" className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
      <div className="flex flex-wrap items-end justify-between gap-6">
        <div className="max-w-2xl">
          <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-primary">UI Vault</p>
          <h2 id="vault-title" className="mt-3 font-serif text-4xl leading-[1.02] sm:text-5xl">
            From the vault, running here.
          </h2>
          <p className="mt-5 text-sm leading-relaxed text-muted-foreground">
            Selected patterns from the UI Vault that are live on this site. Every adapted component is
            credited beside where it appears, with the author and the license.
          </p>
        </div>
        <a
          href={vaultHref}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 rounded-full border border-border px-5 py-2.5 text-sm font-semibold transition hover:border-primary hover:text-primary"
        >
          Open the full vault
          <ArrowUpRight className="size-4" aria-hidden="true" />
        </a>
      </div>

      <ul className="mt-10 grid gap-5 md:grid-cols-3">
        {vaultShelf.map((item) => {
          const external = item.live.to.startsWith("http")
          return (
            <li key={item.id}>
              <article className="flex h-full flex-col rounded-3xl border border-border bg-card/60 p-6">
                <h3 className="font-serif text-2xl leading-tight">{item.name}</h3>
                <p className="mt-3 flex-1 text-sm leading-relaxed text-muted-foreground">{item.detail}</p>
                <p className="mt-5 text-xs leading-relaxed text-muted-foreground">
                  <a
                    href={item.credit.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-medium underline underline-offset-4 hover:text-foreground"
                  >
                    {item.credit.author}, {item.credit.license}
                  </a>
                </p>
                {external ? (
                  <a
                    href={item.live.to}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-primary underline-offset-4 hover:underline"
                  >
                    {item.live.label}
                    <ArrowUpRight className="size-3.5" aria-hidden="true" />
                  </a>
                ) : (
                  <Link
                    to={item.live.to}
                    className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-primary underline-offset-4 hover:underline"
                  >
                    {item.live.label}
                    <ArrowUpRight className="size-3.5" aria-hidden="true" />
                  </Link>
                )}
              </article>
            </li>
          )
        })}
      </ul>
    </section>
  )
}
```

- [x] **Step 6: Replace the Playground page**

Replace `src/pages/PlaygroundPage.tsx` with:

```tsx
import { ArrowUpRight } from "lucide-react"
import { EffectsSwitch } from "@/components/playground/EffectsSwitch"
import { VaultShelf } from "@/components/playground/VaultShelf"
import { Lab } from "@/components/sections/Lab"
import { Link } from "@/components/ui/link"
import { FxProvider } from "@/lib/fx"
import { ProjectDialogProvider } from "@/lib/project-dialog"

export function PlaygroundPage() {
  return (
    <FxProvider>
      <ProjectDialogProvider>
        <section className="relative isolate overflow-hidden px-4 pb-10 pt-12 sm:px-6 sm:pt-16 lg:px-8">
          <div aria-hidden="true" className="hero-grid pointer-events-none absolute inset-0 -z-10 opacity-50" />
          <div className="mx-auto max-w-7xl">
            <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-primary">Playground</p>
            <h1 className="mt-4 max-w-4xl text-balance font-serif text-5xl leading-[0.94] sm:text-7xl lg:text-[6rem]">
              A bench for things that move.
            </h1>
            <p className="mt-6 max-w-2xl text-pretty text-lg leading-relaxed text-muted-foreground sm:text-xl">
              Working models of agents, retrieval and autonomy, plus a shelf of patterns from the UI
              Vault. Real parts say real. Scripted parts say scripted.
            </p>
          </div>
        </section>

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <EffectsSwitch />
        </div>

        <div className="theme-dark mt-10 bg-background text-foreground">
          <Lab />
        </div>

        <VaultShelf />

        <section className="px-4 pb-20 sm:px-6 lg:px-8">
          <div className="relative isolate mx-auto max-w-7xl overflow-hidden rounded-[2rem] border border-border bg-card px-6 py-12 sm:px-10 lg:px-16">
            <div aria-hidden="true" className="hero-glow pointer-events-none absolute inset-0 -z-10 opacity-70" />
            <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-primary">Next</p>
            <h2 className="mt-4 max-w-2xl font-serif text-4xl leading-[0.98] sm:text-5xl">
              The 3D workshop lives with the work.
            </h2>
            <p className="mt-4 max-w-xl text-lg leading-relaxed text-muted-foreground">
              Six stations, eight case studies and a scene you can filter by hand. It is all on the
              work page, with a static version for machines that cannot run WebGL.
            </p>
            <Link
              to="/work"
              className="group mt-8 inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition hover:brightness-105"
            >
              Open the workshop
              <ArrowUpRight className="size-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" aria-hidden="true" />
            </Link>
          </div>
        </section>
      </ProjectDialogProvider>
    </FxProvider>
  )
}
```

- [x] **Step 7: Run the test to verify it passes**

Run: `npm run build && npx playwright test tests/e2e/playground.spec.ts`
Expected: 8 passed.

- [x] **Step 8: Run the accessibility gate**

Run: `npx playwright test tests/e2e/a11y.spec.ts --project=desktop`
Expected: all pass. If the switch or the dark lab band raises a contrast finding, fix the colour rather than disabling the rule.

- [x] **Step 9: Commit**

```bash
git add src/data/playground.ts src/components/playground src/pages/PlaygroundPage.tsx tests/e2e/playground.spec.ts
git commit -m "feat: add the playground shelf and effects switch"
```

---

### Task 5: Contact page and the shared availability line

**Files:**
- Modify: `src/data/profile.ts` (add `availability`)
- Modify: `src/components/home/HomeHero.tsx` (use `availability.status`)
- Create: `src/pages/ContactPage.tsx` (replace the placeholder)
- Create: `tests/e2e/contact.spec.ts`

**Interfaces:**
- Produces: `availability { status: string; detail: string; reply: string }` from `src/data/profile`.
- Consumes: `buildEmail`, `links`, `availability`; `mailtoHref`, `projectPrompt` from `src/lib/mail`.

- [x] **Step 1: Write the failing test**

Create `tests/e2e/contact.spec.ts`:

```ts
import { test, expect } from "@playwright/test"

test("contact copies the assembled email address", async ({ page, context }) => {
  await context.grantPermissions(["clipboard-read", "clipboard-write"])
  await page.goto("/contact")
  await page.getByRole("button", { name: "Copy email address" }).click()
  await expect(page.getByRole("status")).toContainText("copied")
  const value = await page.evaluate(() => navigator.clipboard.readText())
  expect(value).toBe("erictshivhinda@gmail.com")
})

test("contact offers a mailto link and the project prompt", async ({ page }) => {
  await page.goto("/contact")
  const mail = page.getByRole("link", { name: "Open in your mail app" })
  const href = await mail.getAttribute("href")
  expect(href).toMatch(/^mailto:/)
  const decoded = decodeURIComponent(href ?? "")
  expect(decoded).toContain("What I am trying to build")
  expect(decoded).toContain("The deadline")
})

test("contact never renders a form", async ({ page }) => {
  await page.goto("/contact")
  await expect(page.locator("form")).toHaveCount(0)
  await expect(page.getByText("No contact form")).toBeVisible()
})

test("contact does not scroll sideways at 320px", async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 720 })
  await page.goto("/contact")
  const overflow = await page.evaluate(
    () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
  )
  expect(overflow).toBeLessThanOrEqual(1)
})
```

- [x] **Step 2: Run the test to verify it fails**

Run: `npm run build && npx playwright test tests/e2e/contact.spec.ts --project=desktop`
Expected: FAIL because the placeholder has no copy button, no status region and no prompt.

- [x] **Step 3: Add the availability line**

In `src/data/profile.ts`, add after `links`:

```ts
export const availability = {
  status: "Open to select work",
  detail: "Johannesburg, South Africa (SAST)",
  reply: "I read every message myself and reply by email.",
} as const
```

In `src/components/home/HomeHero.tsx`, import `availability` alongside `buildEmail` and replace the literal `Available for select work` with `{availability.status}`.

- [x] **Step 4: Replace the Contact page**

Replace `src/pages/ContactPage.tsx` with:

```tsx
import { ArrowUpRight, Check, Copy, Mail, MapPin } from "lucide-react"
import { useEffect, useState } from "react"
import { availability, buildEmail, links } from "@/data/profile"
import { mailtoHref, projectPrompt } from "@/lib/mail"

const include = [
  "The problem, in your own words.",
  "The deadline that actually matters.",
  "The constraints: stack, compliance, team and anything already decided.",
  "Whether there is an existing codebase, and who else has touched it.",
]

export function ContactPage() {
  const email = buildEmail()
  const [status, setStatus] = useState<"idle" | "copied" | "failed">("idle")

  useEffect(() => {
    if (status === "idle") return
    const timer = window.setTimeout(() => setStatus("idle"), 3000)
    return () => window.clearTimeout(timer)
  }, [status])

  async function copyEmail() {
    try {
      await navigator.clipboard.writeText(email)
      setStatus("copied")
    } catch {
      setStatus("failed")
    }
  }

  return (
    <>
      <section className="relative isolate overflow-hidden px-4 pb-10 pt-12 sm:px-6 sm:pt-16 lg:px-8">
        <div aria-hidden="true" className="hero-grid pointer-events-none absolute inset-0 -z-10 opacity-50" />
        <div className="mx-auto max-w-7xl">
          <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-primary">Contact</p>
          <h1 className="mt-4 max-w-4xl text-balance font-serif text-5xl leading-[0.94] sm:text-7xl lg:text-[6rem]">
            Tell me what you are building.
          </h1>
          <p className="mt-6 max-w-2xl text-pretty text-lg leading-relaxed text-muted-foreground sm:text-xl">
            A short email is enough. I will tell you whether it is a fit, what shape the work could
            take and what it would need in rand.
          </p>
        </div>
      </section>

      <section aria-labelledby="availability-title" className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <h2 id="availability-title" className="sr-only">
          Availability
        </h2>
        <div className="grid gap-6 rounded-3xl border border-border bg-card/60 p-6 sm:grid-cols-3 sm:p-8">
          <div>
            <p className="inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.18em] text-teal">
              <span aria-hidden="true" className="size-2 rounded-full bg-teal" />
              {availability.status}
            </p>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{availability.detail}</p>
          </div>
          <div className="sm:col-span-2">
            <p className="text-sm leading-relaxed">{availability.reply}</p>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              No contact form. A form that quietly fails is worse than an email that works.
            </p>
          </div>
        </div>
      </section>

      <section aria-labelledby="email-title" className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-[1fr_0.8fr] lg:gap-16">
          <div>
            <h2 id="email-title" className="font-serif text-4xl leading-[1.02] sm:text-5xl">
              Start with an email.
            </h2>
            <p className="mt-4 max-w-xl text-sm leading-relaxed text-muted-foreground">
              The address is assembled in your browser, so it is not sitting in the page source as
              plain text. Copy it, or open your mail app with the project prompt already filled in.
            </p>

            <div className="mt-6 rounded-2xl border border-border bg-card/60 p-4 sm:p-5">
              <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
                Email
              </p>
              <code className="mt-2 block select-all break-all text-lg font-semibold">{email}</code>
              <div className="mt-4 flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={copyEmail}
                  className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition hover:brightness-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  {status === "copied" ? (
                    <Check className="size-4" aria-hidden="true" />
                  ) : (
                    <Copy className="size-4" aria-hidden="true" />
                  )}
                  Copy email address
                </button>
                <a
                  href={mailtoHref("Project enquiry", projectPrompt)}
                  className="inline-flex items-center gap-2 rounded-full border border-border px-5 py-2.5 text-sm font-semibold transition hover:border-primary hover:text-primary"
                >
                  <Mail className="size-4" aria-hidden="true" />
                  Open in your mail app
                </a>
              </div>
              <p role="status" aria-live="polite" className="mt-3 min-h-5 text-sm">
                {status === "copied" && "Email address copied."}
                {status === "failed" && "Copy failed. Select the address and copy it manually."}
              </p>
            </div>
          </div>

          <div>
            <h2 className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
              What to include
            </h2>
            <ol className="mt-4 space-y-3">
              {include.map((item, index) => (
                <li key={item} className="flex gap-3 text-sm leading-relaxed">
                  <span aria-hidden="true" className="font-mono text-xs text-primary">0{index + 1}</span>
                  {item}
                </li>
              ))}
            </ol>

            <h2 className="mt-10 font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
              Elsewhere
            </h2>
            <ul className="mt-4 divide-y divide-border border-y border-border">
              {[
                { label: "LinkedIn", href: links.linkedin },
                { label: "GitHub", href: links.github },
                { label: "Credly badges", href: links.credly },
              ].map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between gap-4 py-3 text-sm font-medium hover:text-primary"
                  >
                    {link.label}
                    <ArrowUpRight className="size-4" aria-hidden="true" />
                  </a>
                </li>
              ))}
            </ul>
            <p className="mt-6 inline-flex items-center gap-2 text-sm text-muted-foreground">
              <MapPin className="size-4" aria-hidden="true" />
              {availability.detail}
            </p>
          </div>
        </div>
      </section>

      <section className="px-4 py-20 sm:px-6 lg:px-8">
        <div className="relative isolate mx-auto max-w-7xl overflow-hidden rounded-[2rem] border border-border bg-card px-6 py-14 sm:px-10 lg:px-16 lg:py-20">
          <div aria-hidden="true" className="hero-glow pointer-events-none absolute inset-0 -z-10 opacity-80" />
          <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-primary">Not ready to write?</p>
          <h2 className="mt-4 max-w-2xl font-serif text-5xl leading-[0.98] sm:text-6xl">
            Look at the work first.
          </h2>
          <p className="mt-5 max-w-xl text-lg leading-relaxed text-muted-foreground">
            The case studies show the constraints, the decisions and the limits. If one of them looks
            like your problem, that is a good place to start.
          </p>
          <a
            href={`mailto:${email}`}
            className="group mt-8 inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition hover:brightness-105"
          >
            Email {email}
            <ArrowUpRight className="size-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" aria-hidden="true" />
          </a>
        </div>
      </section>
    </>
  )
}
```

- [x] **Step 5: Run the test to verify it passes**

Run: `npm run build && npx playwright test tests/e2e/contact.spec.ts`
Expected: 8 passed.

- [x] **Step 6: Run the accessibility gate**

Run: `npx playwright test tests/e2e/a11y.spec.ts --project=desktop`
Expected: all pass, including `/contact`.

- [x] **Step 7: Commit**

```bash
git add src/data/profile.ts src/components/home/HomeHero.tsx src/pages/ContactPage.tsx tests/e2e/contact.spec.ts
git commit -m "feat: build the contact page with copy and mailto"
```

---

### Task 6: Credits data, page and hosted license texts

**Files:**
- Modify: `src/data/types.ts` (CreditEntry)
- Modify: `src/data/credits.ts` (replace the file)
- Create: `src/pages/CreditsPage.tsx` (replace the placeholder)
- Create: `public/licenses/mit.txt`
- Create: `public/licenses/isc.txt`
- Create: `public/licenses/ofl-1.1.txt`
- Create: `tests/e2e/credits.spec.ts`
- Modify: `tests/unit/content.test.ts`

**Interfaces:**
- Produces: `CreditEntry { name; author; license; href; usedFor; adapted; group }`, where `license` is `"MIT" | "ISC" | "OFL" | "original" | "inspiration"` and `group` is `"components" | "libraries" | "typefaces"`.
- Consumes: `credits` from `src/data/credits`.

- [x] **Step 1: Write the failing test**

Add to `tests/unit/content.test.ts`:

```ts
import { credits } from "@/data/credits"
import { existsSync } from "node:fs"
import { join } from "node:path"

it("credits every third-party piece with what changed", () => {
  expect(credits.length).toBeGreaterThanOrEqual(15)
  for (const credit of credits) {
    expect(credit.author.trim()).not.toBe("")
    expect(credit.href.startsWith("https://")).toBe(true)
    expect(credit.usedFor.trim()).not.toBe("")
    expect(credit.adapted.trim()).not.toBe("")
    expect(["components", "libraries", "typefaces"]).toContain(credit.group)
  }
  const unlicensed = credits.filter((credit) => credit.license === "inspiration")
  expect(unlicensed.length).toBeGreaterThanOrEqual(2)
  for (const credit of unlicensed) {
    expect(credit.adapted).toContain("No source copied")
  }
})

it("hosts the license texts the credits page links to", () => {
  for (const file of ["mit.txt", "isc.txt", "ofl-1.1.txt"]) {
    expect(existsSync(join(process.cwd(), "public", "licenses", file))).toBe(true)
  }
})
```

Create `tests/e2e/credits.spec.ts`:

```ts
import { test, expect } from "@playwright/test"

test("credits names authors, sources, licenses and what changed", async ({ page }) => {
  await page.goto("/credits")
  await expect(page.getByRole("heading", { level: 1 })).toContainText("Credits")
  const components = page.getByRole("region", { name: "Components and inspiration" })
  await expect(components.getByRole("article")).toHaveCount(4)
  await expect(components.getByText("Kedhareswer Naidu").first()).toBeVisible()
  await expect(components.getByRole("link", { name: "MIT license" }).first()).toHaveAttribute(
    "href",
    "/licenses/mit.txt",
  )
  await expect(components.getByText(/No source copied/).first()).toBeVisible()
})

test("credits links every library and typeface to its source", async ({ page }) => {
  await page.goto("/credits")
  const libraries = page.getByRole("region", { name: "Libraries" })
  await expect(libraries.getByRole("article")).toHaveCount(7)
  await expect(libraries.getByRole("link", { name: "React" })).toHaveAttribute("href", "https://react.dev")
  const typefaces = page.getByRole("region", { name: "Typefaces" })
  await expect(typefaces.getByRole("article")).toHaveCount(4)
  await expect(typefaces.getByRole("link", { name: "OFL license" }).first()).toHaveAttribute(
    "href",
    "/licenses/ofl-1.1.txt",
  )
})

test("credits does not scroll sideways at 320px", async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 720 })
  await page.goto("/credits")
  const overflow = await page.evaluate(
    () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
  )
  expect(overflow).toBeLessThanOrEqual(1)
})
```

- [x] **Step 2: Run the tests to verify they fail**

Run: `npm run typecheck && npm test -- tests/unit/content.test.ts`
Expected: FAIL because `CreditEntry` has no `adapted` or `group`, and the license files do not exist.

Run: `npm run build && npx playwright test tests/e2e/credits.spec.ts --project=desktop`
Expected: FAIL because the placeholder lists six libraries and has no regions.

- [x] **Step 3: Update the CreditEntry type**

In `src/data/types.ts`, replace `CreditEntry` with:

```ts
export interface CreditEntry {
  name: string
  author: string
  license: "MIT" | "ISC" | "OFL" | "original" | "inspiration"
  href: string
  usedFor: string
  /** Plain statement of what this site changed, or that nothing was copied. */
  adapted: string
  group: "components" | "libraries" | "typefaces"
}
```

- [x] **Step 4: Replace `src/data/credits.ts`**

Use exactly this content:

```ts
import type { CreditEntry } from "./types"

export const credits: CreditEntry[] = [
  {
    name: "Glassmorphism Folder Cards",
    author: "Kedhareswer Naidu",
    license: "MIT",
    href: "https://21st.dev/@kedhareswer/components/glass-folder-cards",
    usedFor: "The folder shelf on the home page",
    adapted:
      "Rebuilt as this site's folder shelf: project files, keyboard support and case-study links.",
    group: "components",
  },
  {
    name: "Mascot Portfolio Hero",
    author: "Kedhareswer Naidu",
    license: "MIT",
    href: "https://21st.dev/@kedhareswer/components/mascot-portfolio-hero",
    usedFor: "The illustrated character in the home hero",
    adapted:
      "Adapted the character's skin tone, beanie and palette, and wrote new copy for this site.",
    group: "components",
  },
  {
    name: "Circular Navigation Bar",
    author: "Kaif UI",
    license: "inspiration",
    href: "https://21st.dev/@kaif-ui/components/cicular-navigation-bar",
    usedFor: "The radial menu in the site header",
    adapted:
      "No source copied. The original radial menu borrows only the circular arrangement.",
    group: "components",
  },
  {
    name: "Interactive 3D Machine",
    author: "Evgeny Shilov (eugeneshilow)",
    license: "inspiration",
    href: "https://agentic-factory-3d.vercel.app",
    usedFor: "The six-station workshop on the work page",
    adapted:
      "No source copied. The original three.js workshop borrows only the station metaphor.",
    group: "components",
  },
  {
    name: "React",
    author: "Meta and contributors",
    license: "MIT",
    href: "https://react.dev",
    usedFor: "The interface runtime",
    adapted: "Used as a dependency, unmodified.",
    group: "libraries",
  },
  {
    name: "Vite",
    author: "Vite contributors",
    license: "MIT",
    href: "https://vite.dev",
    usedFor: "Development server and production build",
    adapted: "Used as a dependency, unmodified.",
    group: "libraries",
  },
  {
    name: "Tailwind CSS",
    author: "Tailwind Labs",
    license: "MIT",
    href: "https://tailwindcss.com",
    usedFor: "Styling and design tokens",
    adapted: "Used as a dependency, unmodified.",
    group: "libraries",
  },
  {
    name: "Framer Motion",
    author: "Framer",
    license: "MIT",
    href: "https://www.framer.com/motion/",
    usedFor: "Interface motion",
    adapted: "Used as a dependency, unmodified.",
    group: "libraries",
  },
  {
    name: "Radix UI",
    author: "WorkOS",
    license: "MIT",
    href: "https://www.radix-ui.com",
    usedFor: "Accessible dialog primitives",
    adapted: "Used as a dependency, unmodified.",
    group: "libraries",
  },
  {
    name: "lucide",
    author: "Lucide contributors",
    license: "ISC",
    href: "https://lucide.dev",
    usedFor: "Interface icons",
    adapted: "Used as a dependency, unmodified.",
    group: "libraries",
  },
  {
    name: "cmdk",
    author: "Paco Coursey",
    license: "MIT",
    href: "https://cmdk.paco.me",
    usedFor: "The command menu",
    adapted: "Used as a dependency, unmodified.",
    group: "libraries",
  },
  {
    name: "Inter",
    author: "Rasmus Andersson",
    license: "OFL",
    href: "https://rsms.me/inter/",
    usedFor: "Body type",
    adapted: "Self-hosted with Fontsource, unmodified.",
    group: "typefaces",
  },
  {
    name: "Archivo Black",
    author: "Omnibus-Type",
    license: "OFL",
    href: "https://fonts.google.com/specimen/Archivo+Black",
    usedFor: "Display headings",
    adapted: "Self-hosted with Fontsource, unmodified.",
    group: "typefaces",
  },
  {
    name: "Instrument Serif",
    author: "Instrument",
    license: "OFL",
    href: "https://fonts.google.com/specimen/Instrument+Serif",
    usedFor: "Editorial headings",
    adapted: "Self-hosted with Fontsource, unmodified.",
    group: "typefaces",
  },
  {
    name: "JetBrains Mono",
    author: "JetBrains",
    license: "OFL",
    href: "https://www.jetbrains.com/lp/mono/",
    usedFor: "Labels, metadata and code",
    adapted: "Self-hosted with Fontsource, unmodified.",
    group: "typefaces",
  },
]
```

- [x] **Step 5: Add the license texts**

Create `public/licenses/mit.txt`:

```text
MIT License

Copyright (c) the respective copyright holders

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

Create `public/licenses/isc.txt`:

```text
ISC License

Copyright (c) the respective copyright holders

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted, provided that the above
copyright notice and this permission notice appear in all copies.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES
WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF
MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY
SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES
WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION
OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF OR IN
CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.
```

Create `public/licenses/ofl-1.1.txt` with the SIL Open Font License 1.1 text:

```text
SIL OPEN FONT LICENSE Version 1.1 - 26 February 2007

PREAMBLE
The goals of the Open Font License (OFL) are to stimulate worldwide
development of collaborative font projects, to support the font creation
efforts of academic and linguistic communities, and to provide a free and
open framework in which fonts may be shared and improved in partnership with
others.

The OFL allows the licensed fonts to be used, studied, modified and
redistributed freely as long as they are not sold by themselves. The fonts,
including any derivative works, can be bundled, embedded, redistributed
and/or sold with any software provided that any reserved names are not used
by derivative works. The fonts and derivatives, however, cannot be released
under any other type of license. The requirement for fonts to remain under
this license does not apply to any document created using the fonts or their
derivatives.

DEFINITIONS
"Font Software" refers to the set of files released by the Copyright
Holder(s) under this license and clearly marked as such. This may include
source files, build scripts and documentation.

"Reserved Font Name" refers to any names specified as such after the
copyright statement(s).

"Original Version" refers to the collection of Font Software components as
distributed by the Copyright Holder(s).

"Modified Version" refers to any derivative made by adding to, deleting, or
substituting, in part or in whole, any of the components of the Original
Version, by changing formats or by porting the Font Software to a new
environment.

"Author" refers to any designer, engineer, programmer, technical writer or
other person who contributed to the Font Software.

PERMISSION & CONDITIONS
Permission is hereby granted, free of charge, to any person obtaining a copy
of the Font Software, to use, study, copy, merge, embed, modify, redistribute,
and sell modified and unmodified copies of the Font Software, subject to the
following conditions:

1) Neither the Font Software nor any of its individual components, in
Original or Modified Versions, may be sold by itself.

2) Original or Modified Versions of the Font Software may be bundled,
redistributed and/or sold with any software, provided that each copy contains
the above copyright notice and this license. These can be included either as
stand-alone text files, human-readable headers or in the appropriate
machine-readable metadata fields within text or binary files as long as those
fields can be easily viewed by the user.

3) No Modified Version of the Font Software may use the Reserved Font Name(s)
unless explicit written permission is granted by the corresponding Copyright
Holder. This restriction only applies to the primary font name as presented
to the users.

4) The name(s) of the Copyright Holder(s) or the Author(s) of the Font
Software shall not be used to promote, endorse or advertise any Modified
Version, except to acknowledge the contribution(s) of the Copyright Holder(s)
and the Author(s) or with their explicit written permission.

5) The Font Software, modified or unmodified, in part or in whole, must be
distributed entirely under this license, and must not be distributed under
any other license. The requirement for fonts to remain under this license does
not apply to any document created using the Font Software.

TERMINATION
This license becomes null and void if any of the above conditions are not met.

DISCLAIMER
THE FONT SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
OR IMPLIED, INCLUDING BUT NOT LIMITED TO ANY WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT OF COPYRIGHT, PATENT,
TRADEMARK, OR OTHER RIGHT. IN NO EVENT SHALL THE COPYRIGHT HOLDER BE LIABLE
FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, INCLUDING ANY GENERAL, SPECIAL,
INDIRECT, INCIDENTAL, OR CONSEQUENTIAL DAMAGES, WHETHER IN AN ACTION OF
CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF THE USE OR INABILITY TO USE
THE FONT SOFTWARE OR FROM OTHER DEALINGS IN THE FONT SOFTWARE.
```

- [x] **Step 6: Replace the Credits page**

Replace `src/pages/CreditsPage.tsx` with:

```tsx
import type { CreditEntry } from "@/data/types"
import { credits } from "@/data/credits"

const groups: Array<{ id: CreditEntry["group"]; title: string; lead: string }> = [
  {
    id: "components",
    title: "Components and inspiration",
    lead: "Components adapted from the UI Vault and older studio work, plus the references that shaped original implementations.",
  },
  {
    id: "libraries",
    title: "Libraries",
    lead: "Runtime and build dependencies, used unmodified.",
  },
  {
    id: "typefaces",
    title: "Typefaces",
    lead: "Fonts self-hosted with Fontsource under the SIL Open Font License.",
  },
]

const licenseHref: Record<CreditEntry["license"], string | null> = {
  MIT: "/licenses/mit.txt",
  ISC: "/licenses/isc.txt",
  OFL: "/licenses/ofl-1.1.txt",
  original: null,
  inspiration: null,
}

const licenseLabel: Record<CreditEntry["license"], string> = {
  MIT: "MIT license",
  ISC: "ISC license",
  OFL: "OFL license",
  original: "Original work",
  inspiration: "No license recorded",
}

export function CreditsPage() {
  return (
    <>
      <section className="relative isolate overflow-hidden px-4 pb-10 pt-12 sm:px-6 sm:pt-16 lg:px-8">
        <div aria-hidden="true" className="hero-grid pointer-events-none absolute inset-0 -z-10 opacity-50" />
        <div className="mx-auto max-w-7xl">
          <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-primary">Credits</p>
          <h1 className="mt-4 max-w-4xl text-balance font-serif text-5xl leading-[0.94] sm:text-7xl">
            Credits and licenses.
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground">
            Every third-party piece, with its author, source, license and what changed. Components
            adapted from the UI Vault are also credited where they appear.
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-7xl space-y-16 px-4 py-10 sm:px-6 lg:px-8">
        {groups.map((group) => {
          const entries = credits.filter((credit) => credit.group === group.id)
          return (
            <section key={group.id} aria-labelledby={`credits-${group.id}-title`}>
              <div className="max-w-2xl">
                <h2 id={`credits-${group.id}-title`} className="font-serif text-4xl leading-[1.02] sm:text-5xl">
                  {group.title}
                </h2>
                <p className="mt-4 text-sm leading-relaxed text-muted-foreground">{group.lead}</p>
              </div>
              <ul className="mt-8 grid gap-4 md:grid-cols-2">
                {entries.map((credit) => {
                  const href = licenseHref[credit.license]
                  return (
                    <li key={credit.name}>
                      <article className="h-full rounded-3xl border border-border bg-card/60 p-5 sm:p-6">
                        <h3 className="font-serif text-2xl leading-tight">
                          <a
                            href={credit.href}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="underline-offset-4 hover:underline"
                          >
                            {credit.name}
                          </a>
                        </h3>
                        <dl className="mt-4 space-y-3 text-sm leading-relaxed">
                          <div className="grid gap-1 sm:grid-cols-[7rem_1fr] sm:gap-4">
                            <dt className="font-mono text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
                              Author
                            </dt>
                            <dd>{credit.author}</dd>
                          </div>
                          <div className="grid gap-1 sm:grid-cols-[7rem_1fr] sm:gap-4">
                            <dt className="font-mono text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
                              License
                            </dt>
                            <dd>
                              {href ? (
                                <a
                                  href={href}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="font-medium underline underline-offset-4 hover:text-primary"
                                >
                                  {licenseLabel[credit.license]}
                                </a>
                              ) : (
                                <span>{licenseLabel[credit.license]}</span>
                              )}
                            </dd>
                          </div>
                          <div className="grid gap-1 sm:grid-cols-[7rem_1fr] sm:gap-4">
                            <dt className="font-mono text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
                              Used for
                            </dt>
                            <dd>{credit.usedFor}</dd>
                          </div>
                          <div className="grid gap-1 sm:grid-cols-[7rem_1fr] sm:gap-4">
                            <dt className="font-mono text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
                              What changed
                            </dt>
                            <dd>{credit.adapted}</dd>
                          </div>
                        </dl>
                      </article>
                    </li>
                  )
                })}
              </ul>
            </section>
          )
        })}
      </div>

      <section className="mx-auto max-w-7xl px-4 pb-20 sm:px-6 lg:px-8">
        <div className="rounded-3xl border border-border bg-card/60 p-6 text-sm leading-relaxed text-muted-foreground">
          The two inspiration entries record no license because none was recorded at the source. No
          source code from them was used. If a rights holder believes an attribution is wrong, the
          email on the contact page reaches me directly.
        </div>
      </section>
    </>
  )
}
```

- [x] **Step 7: Run the tests to verify they pass**

Run: `npm run typecheck && npm test -- tests/unit/content.test.ts`
Expected: PASS.

Run: `npm run build && npx playwright test tests/e2e/credits.spec.ts`
Expected: 6 passed.

- [x] **Step 8: Run the accessibility gate**

Run: `npx playwright test tests/e2e/a11y.spec.ts --project=desktop`
Expected: all pass, including `/credits`.

- [x] **Step 9: Commit**

```bash
git add src/data/types.ts src/data/credits.ts src/pages/CreditsPage.tsx public/licenses tests/e2e/credits.spec.ts tests/unit/content.test.ts
git commit -m "feat: credit every component and host the licenses"
```

---

### Task 7: Phase verification and PR update

**Files:**
- No new source files. This task checks the five pages together and records the result.

- [x] **Step 1: Run the full unit suite**

Run: `npm run typecheck && npm test`
Expected: typecheck passes and every unit test passes.

- [x] **Step 2: Run the full Playwright suite**

Run: `npm run test:e2e`
Expected: every desktop and phone test passes, including the five new specs and the axe gate.

- [x] **Step 3: Check the 320px overflow for every route**

Run this once against the preview server:

```bash
npm run build
npm run preview -- --port 4173 &
node -e "
const { chromium } = require('playwright');
(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 320, height: 720 } });
  for (const path of ['/services', '/about', '/playground', '/contact', '/credits']) {
    await page.goto('http://127.0.0.1:4173' + path);
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
    console.log(path, overflow);
  }
  await browser.close();
})();
"
```

Expected: every value is `0` or `1`. Stop the preview server afterwards.

- [x] **Step 4: Review the pages in a browser**

Open `/services`, `/about`, `/playground`, `/contact` and `/credits` at 1440px and at 390px in both themes. Check:

- Services: six cards, proof links open the right case studies, the FAQ opens and closes by keyboard, the email CTA opens a mail client with the prompt.
- About: the portrait loads, the timeline rail highlights the chapter in view, every evidence link opens, the lightbox closes with Escape and returns focus, the principles and stack proof links open case studies.
- Playground: the switch turns autoplay off without breaking the demos, the shelf credits are visible, the dark lab band reads correctly in light mode.
- Contact: copy works, the status line announces success, the mailto carries the prompt, no form exists.
- Credits: every entry shows author, source, license and what changed, and the license links open the hosted texts.

If a visual issue appears, fix it and rerun the affected spec before continuing.

- [x] **Step 5: Push the branch and update PR #4**

```bash
git push origin feat/flagship-v1
```

Update the pull request body so the phase list reads:

```markdown
## Phases

- Phase 1: foundation, theme, router and page shells
- Phase 2: content, home and navigation
- Phase 3: work archive, case studies and the 3D workshop
- Phase 4: services, about, playground, contact and credits
- Phase 5: assets, verification and release (next)
```

Add a short Phase 4 section with the verified numbers: unit tests, Playwright tests, axe findings (zero serious or critical), the six service offers, seven story chapters, five gallery photos with a working lightbox, three vault shelf cards and three hosted license texts.

- [x] **Step 6: Mark the plan complete**

Change every checkbox in this file from `[ ]` to `[x]` and commit:

```bash
git add docs/superpowers/plans/2026-10-30-portfolio-flagship-04-services-about-playground-contact-credits.md
git commit -m "docs: close the phase 4 plan"
git push origin feat/flagship-v1
```
