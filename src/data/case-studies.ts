import type { CaseStudy } from "./types"

export const caseStudies: CaseStudy[] = [
  {
    slug: "vigil",
    tagline: "Operational intelligence that stays inside the country",
    status: "archive",
    year: "2026",
    team: "Solo build",
    role: "Product, architecture, engineering",
    stack: ["Java", "Python", "TypeScript", "Next.js", "PostgreSQL", "Ollama"],
    summary:
      "A sovereign operational-intelligence platform that models evidence, investigations and missions as a governed ontology, designed so that no prompt ever leaves South Africa.",
    heroAlt: "Abstract brass evidence lines converging on a teal audit seal",
    accent: "teal",
    sections: [
      {
        kind: "facts",
        facts: [
          { label: "State", value: "Local increment" },
          { label: "Decisions recorded", value: "12 ADRs" },
          { label: "Roadmap", value: "43 phases" },
          { label: "Source", value: "Public" },
        ],
      },
      {
        kind: "prose",
        heading: "The problem",
        body: [
          "Analysts working on sensitive investigations are often asked to choose between useful software and software that keeps their material in the country. Cloud-first tools make that choice for them. Vigil starts from the opposite assumption: the evidence stays where the work happens, and the model is a guest with no tools of its own.",
          "The product models evidence, investigations and missions as one governed ontology. Every claim in the interface can be traced back to the record that supports it, and every consequential change is a command with an owner, a reason and an audit trail.",
        ],
      },
      {
        kind: "list",
        heading: "What is built",
        items: [
          "A Java core and PostgreSQL record with idempotent, concurrency-checked commands.",
          "A Python intelligence service for extraction, planning and JSON-schema contracts, with optional local Ollama reasoner and challenger models.",
          "A Next.js cockpit for analysts, built around evidence and review rather than chat.",
          "A locally verifiable audit chain, evidence-linked plans and POPIA section 71 human-decision controls.",
          "Twelve architecture decision records and a 43-phase roadmap, published with the code.",
        ],
      },
      {
        kind: "prose",
        heading: "The trust design",
        body: [
          "Model proposals must quote exact evidence and pass analyst review before publication. Untrusted content is fenced as data: the planner wraps it in boundary tags and sends the model no tools, and a test asserts both behaviours.",
          "The site describes an earlier increment honestly. The running system is a local build on synthetic data. The larger platform is still in development, and the case study will grow as it does.",
        ],
      },
    ],
  },
  {
    slug: "clearcut",
    tagline: "Invoicing that agents can call, and people can trust",
    status: "live",
    year: "2026",
    team: "Solo build",
    role: "Product, Rust engineering, protocol design",
    stack: ["Rust", "axum", "PostgreSQL", "MCP", "TypeScript", "Claude plugin"],
    summary:
      "An agent-native invoicing core for South Africa: one Rust codebase exposed as a REST API, an MCP server and a Claude plugin, with the VAT rules already written as tested code.",
    heroAlt: "A brass invoice grid with a teal approval seal",
    accent: "brass",
    sections: [
      {
        kind: "facts",
        facts: [
          { label: "State", value: "Live alpha" },
          { label: "VAT", value: "15%" },
          { label: "MCP tools", value: "3" },
          { label: "Rust test functions", value: "282" },
        ],
      },
      {
        kind: "prose",
        heading: "The problem",
        body: [
          "An agent can draft an invoice in seconds. Getting the money right, and making the result defensible to an accountant, is the hard part. South African tax invoices have thresholds, VAT has rounding rules, and an agent that invents a figure is worse than no agent at all.",
          "ClearCut puts the determinism first. The core is a Rust library that knows how to calculate, validate and explain an invoice. Agents are a surface on top of it, not the source of truth.",
        ],
      },
      {
        kind: "list",
        heading: "Money rules as code",
        items: [
          "Integer cents and deterministic rounding, so totals do not drift between services.",
          "15% VAT and the South African tax-invoice thresholds: full above R5 000, abridged down to R50, none at or below R50.",
          "A number guard that rejects any figure the source evidence does not contain.",
          "Citation-first derivation, so every line in a narrated invoice points back to its evidence.",
        ],
      },
      {
        kind: "prose",
        heading: "One core, three surfaces",
        body: [
          "The same core is exposed as a multi-tenant REST API, an MCP server over stdio and a Claude plugin. The MCP surface has three tools: calculate an invoice, check whether a tax invoice is required, and check whether a status transition is allowed.",
          "A typed TypeScript SDK and upload client make the API practical from a web app. The plugin manifest lets a Claude user work with invoices without leaving the conversation.",
        ],
      },
      {
        kind: "prose",
        heading: "Security and what comes next",
        body: [
          "The API runs on PostgreSQL with row-level security that fails closed, a restricted service role, hashed and scoped API keys, audited key management and a streamed document-upload endpoint.",
          "The alpha does not yet read documents with models, export invoices, show a dashboard, or handle e-invoicing and payments. Those are named in the open so that the demo is not mistaken for a finished product.",
        ],
      },
    ],
  },
  {
    slug: "timelex",
    tagline: "Legal practice management with an autonomy ladder",
    status: "archive",
    year: "2026",
    team: "Solo build",
    role: "Product design, architecture, systems engineering",
    stack: ["Rust", "Python", "TypeScript", "PostgreSQL", "MCP", "Claude"],
    summary:
      "An open, API-first legal practice platform designed to capture work signals, attribute them to the right matter and prepare the bill, asking a person only when it must.",
    heroAlt: "A teal ladder of autonomy rising through brass legal columns",
    accent: "copper",
    sections: [
      {
        kind: "facts",
        facts: [
          { label: "State", value: "Pre-alpha" },
          { label: "Decisions recorded", value: "12 ADRs" },
          { label: "Research notes", value: "8" },
          { label: "Rust test functions", value: "171" },
        ],
      },
      {
        kind: "prose",
        heading: "The problem",
        body: [
          "Lawyers lose billable time in the gap between the work and the record of it. A platform that watches everything creates a different problem: it puts sensitive client material into a system that may not deserve that trust.",
          "TimeLex is designed around earned autonomy. It captures work signals, attributes them to the right matter with cited evidence, writes the narrative and prepares the bill, and asks a person only when the decision is consequential.",
        ],
      },
      {
        kind: "list",
        heading: "The autonomy ladder",
        items: [
          "L0 Observe: the system watches and records, but changes nothing.",
          "L1 Suggest: it proposes a time entry for a person to accept.",
          "L2 Draft: it writes the narrative and prepares the entry for review.",
          "L3 Supervised: it acts within a policy, with sampling and a person on call.",
          "L4 Autonomous to pre-bill: it prepares the bill, never sends it. Trust money and fee notes are never autonomous.",
        ],
      },
      {
        kind: "prose",
        heading: "Bring your own keys",
        body: [
          "Each firm carries its own model cost through a bring-your-own-keys vault specified in an ADR. Captured emails and documents are treated as data, never as instructions. The threat model covers prompt injection, data exfiltration and the boundaries between tenants.",
          "The work is design-first and published in the open: twelve ADRs, eight research notes, contract-first OpenAPI, event and MCP schemas, and accuracy gates that must exist before any autonomy is switched on.",
        ],
      },
      {
        kind: "prose",
        heading: "What exists today",
        body: [
          "The gateway and identity services are built in Rust, with shared auth, database and billing-unit crates, a Python redaction worker and a TypeScript SDK stub. Five GitHub Actions workflows cover CodeQL, dependency review and a supply-chain scorecard.",
          "Capture, attribution, narration, the ledger, billing and trust accounting are specified, not implemented. The autonomy thresholds are proposals waiting for a gold set. The case study says so plainly.",
        ],
      },
    ],
  },
  {
    slug: "sa-jas",
    tagline: "A job agent suite that never presses Submit",
    status: "live",
    year: "2026",
    team: "Solo build",
    role: "Product, desktop engineering, agent design",
    stack: ["Electron", "React", "Express", "Playwright", "Claude", "Gemini"],
    summary:
      "A desktop suite where three AI agents find real South African vacancies, tailor an application for each role and drive a visible browser copilot, always leaving the final Submit to the person.",
    heroAlt: "A warm copper desk with job cards and a visible browser window",
    accent: "copper",
    sections: [
      {
        kind: "facts",
        facts: [
          { label: "State", value: "Live" },
          { label: "AI agents", value: "3" },
          { label: "SA job boards", value: "12" },
          { label: "Server tests", value: "65" },
        ],
      },
      {
        kind: "prose",
        heading: "The problem",
        body: [
          "Applying for work in South Africa is a fragmented, repetitive job. Listings live across a dozen boards, each application asks for the same information in a different shape, and the advice online is written for a different market.",
          "SA-JAS treats the application as a pipeline with three agents and one hard boundary. The agents can search, tailor and fill. They cannot submit, solve a CAPTCHA or hide what they are doing.",
        ],
      },
      {
        kind: "list",
        heading: "The three agents",
        items: [
          "Job Hunter: grounded web search returns real vacancies with source URLs, backed by twelve South African job-board scrapers and AI link validation and repair.",
          "Document Tailor: an ATS-optimised CV and a 300 to 400 word cover letter per role in South African English, rendered to PDF.",
          "Apply Copilot: a per-page planner, vision fallback, three-pass smart fill and a learn-as-you-go answer bank, all inside a visible browser.",
        ],
      },
      {
        kind: "prose",
        heading: "Safety is a product feature",
        body: [
          "The copilot scans pages for prompt injection, never auto-submits and never solves a CAPTCHA. Candidate memory evolves through a curation step called Dreaming, with scheduled routines, parallel sub-agents, a referral pipeline and cost controls that include a usage ledger and a daily budget guard.",
          "The public repository is a clean source snapshot. It was verified with 65 server tests and a synthetic walkthrough. No live application or paid model call was made during testing.",
        ],
      },
    ],
  },
  {
    slug: "munisolve",
    tagline: "Municipal faults, reported and resolved in public",
    status: "live",
    year: "2026",
    team: "Personal project",
    role: "Full-stack engineering, product design",
    stack: ["React 19", "Node.js", "Express", "PostgreSQL", "Prisma", "Claude"],
    summary:
      "A municipal service-delivery platform where citizens report faults, administrators triage them on a live heat map and an assistant answers common questions within a rate limit.",
    heroAlt: "A brass map pin over a teal heat map of a city",
    accent: "teal",
    sections: [
      {
        kind: "facts",
        facts: [
          { label: "State", value: "Live" },
          { label: "User roles", value: "3" },
          { label: "Assistant limit", value: "30 per hour" },
          { label: "Hosting", value: "Vercel, Render, Neon" },
        ],
      },
      {
        kind: "prose",
        heading: "The problem",
        body: [
          "A broken streetlight is easy to report and hard to track. Municipal teams need a shared picture of where faults are, and residents need to know that a report went somewhere.",
          "MuniSolve ZA gives citizens a simple reporting flow and administrators a live operational view. The assistant, Siyanda, handles the questions that do not need a person, with a visible limit so that it cannot become an unbounded cost centre.",
        ],
      },
      {
        kind: "list",
        heading: "What the product does",
        items: [
          "Citizen reporting with location and photo context, and a status the reporter can follow.",
          "An administrator view with a Leaflet heat map and triage controls.",
          "Three roles (citizen, admin, super-admin) with activity logs and role-based access.",
          "Open-Meteo and Nager.Date widgets for local context, and a Claude-powered assistant limited to 30 messages per hour.",
        ],
      },
      {
        kind: "prose",
        heading: "The build",
        body: [
          "JWT, bcrypt and Google OAuth handle identity. Helmet and rate limiting sit in front of the API. The app is deployed as a React frontend on Vercel, an Express API on Render and a PostgreSQL database on Neon.",
          "The live site is the proof. It is a real deployment with real access rules, not a screenshot of one.",
        ],
      },
    ],
  },
  {
    slug: "reservoir",
    tagline: "A community memory with consent built in",
    status: "live",
    year: "2026",
    team: "Solo build",
    role: "Product, systems design, engineering",
    stack: ["Rust", "Python", "TypeScript", "SQLite", "PostgreSQL"],
    summary:
      "A free, open, community-grown memory of South African culture: plants, practices and languages, with community-controlled consent and a mission-native AI.",
    heroAlt: "A teal reservoir of knowledge with brass roots",
    accent: "brass",
    sections: [
      {
        kind: "facts",
        facts: [
          { label: "State", value: "Live" },
          { label: "Core", value: "Rust and Python" },
          { label: "Capture", value: "Offline-first" },
          { label: "Consent", value: "Community-controlled" },
        ],
      },
      {
        kind: "prose",
        heading: "The problem",
        body: [
          "Cultural knowledge is often collected in a hurry and stored on someone else's terms. The people who hold it lose control of how it is attributed, reused and questioned.",
          "Reservoir starts with consent as a data model, not a checkbox. Communities decide what can be shared, how it is credited and what the AI is allowed to do with it.",
        ],
      },
      {
        kind: "list",
        heading: "How it is built",
        items: [
          "Offline-first capture for places with unreliable connectivity.",
          "A Rust core API, a provider-agnostic Python AI layer and a mobile client.",
          "Community-controlled consent, attribution and reuse, modelled explicitly in the data.",
          "Architecture decisions and safety notes published in the repository.",
        ],
      },
      {
        kind: "prose",
        heading: "Why it matters",
        body: [
          "The AI is mission-native: it serves the archive and the community, not the other way around. The live site is a working index and a statement of intent, free and open to the people who contribute to it.",
        ],
      },
    ],
  },
  {
    slug: "ui-vault",
    tagline: "A provenance-first index of interface patterns",
    status: "live",
    year: "2026",
    team: "Solo build",
    role: "Product, curation, frontend engineering",
    stack: ["React", "Vite", "Tailwind CSS", "shadcn/ui", "MCP"],
    summary:
      "A curated index of UI and UX patterns with live demos, an API, a CLI and a read-only MCP server, built around the question of where a component came from and what its license allows.",
    heroAlt: "A brass card catalogue of interface patterns",
    accent: "brass",
    sections: [
      {
        kind: "facts",
        facts: [
          { label: "State", value: "Live" },
          { label: "Surfaces", value: "Site, API, CLI, MCP" },
          { label: "Rights", value: "Recorded per entry" },
          { label: "Source", value: "Public" },
        ],
      },
      {
        kind: "prose",
        heading: "The problem",
        body: [
          "Most component galleries answer one question: what does it look like? UI Vault also answers the questions that decide whether you can use it: who made it, where it came from, what license applies and whether the demo is real.",
          "The index records provenance and rights per entry. Permissive work can be installed and credited. Unknown or restricted work is inspiration only, and the site says so.",
        ],
      },
      {
        kind: "list",
        heading: "Four ways in",
        items: [
          "A browsable site with live demos and a catalogue you can filter by type, tags, stack and rights.",
          "A free API for entries, components and health.",
          "A CLI for listing, searching and reading setup prompts.",
          "A read-only MCP server with search and lookup tools, so an agent can consult the vault without changing it.",
        ],
      },
      {
        kind: "prose",
        heading: "Used on this site",
        body: [
          "The glass folder cards and the mascot on this portfolio are adapted from UI Vault patterns under the MIT license, with credit in the footer and on the credits page. The circular menu and the 3D workshop are original builds that credit their inspirations, not their source.",
        ],
      },
    ],
  },
  {
    slug: "k-one",
    tagline: "An independent studio with a small, honest portfolio",
    status: "live",
    year: "2025",
    team: "Founder",
    role: "Founder, engineer, designer",
    stack: ["HTML", "CSS", "PHP", "React", "Python", "Docker"],
    summary:
      "K-ONE IT SOLUTIONS is the studio I founded in Johannesburg in 2025: a company site, a React social platform and a Dockerised server health monitor, built for real clients and real operations.",
    heroAlt: "A copper studio stamp on warm paper",
    accent: "copper",
    sections: [
      {
        kind: "facts",
        facts: [
          { label: "Founded", value: "2025" },
          { label: "Base", value: "Johannesburg" },
          { label: "Focus", value: "Software and IT" },
          { label: "State", value: "Live" },
        ],
      },
      {
        kind: "prose",
        heading: "The studio",
        body: [
          "K-ONE is a small independent IT and software studio. It exists so that I can take a problem from a conversation to a running system without handing it between agencies.",
          "The studio site is hand-built with HTML, CSS and PHP. The work behind it is a React social-media platform and a server-health monitor packaged in Docker, with CPU, memory and disk checks that raise Slack and email alerts.",
        ],
      },
      {
        kind: "list",
        heading: "Selected studio work",
        items: [
          "The K-ONE company website, live and open source.",
          "K-One Solutions Media, a React social-media platform.",
          "Server Health Monitor, a Python and Docker service with threshold alerts and tests on Windows and Linux.",
        ],
      },
      {
        kind: "prose",
        heading: "How I work",
        body: [
          "Small scope, clear interfaces and a running system at the end. I quote in rand after scoping, not before. The same standard applies here: every project on this site has a link you can open or a repository you can read.",
        ],
      },
    ],
  },
]

export const caseStudyBySlug = (slug: string) => caseStudies.find((study) => study.slug === slug)
