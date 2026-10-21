import type { FirmWork, Role } from "./types"

const GH = "https://github.com/konethegreat"

export const roles: Role[] = [
  {
    id: "firm",
    title: "Software Engineer",
    org: "A law firm",
    place: "Johannesburg, South Africa",
    period: "June 2026 – Present",
    current: true,
    summary: "Founding engineer on a six-member team building the firm's software engineering department and its AI platforms from scratch.",
    bullets: [
      {
        lead: "Founding engineer, six-member team",
        text: "Spearhead the setup, structure and growth of a new software engineering department inside a law firm; project lead on scalable multi-tenant enterprise applications with schema-per-tenant isolation, row-level security and POPIA-aligned compliance.",
      },
      {
        lead: "Agentic AI and automation",
        text: "Design and run multi-agent pipelines using loop engineering (plan, act, verify, retry across delegated sub-agents) with supervisor agents, tool calling, MCP and human sign-off, eliminating manual bottlenecks across tender, due-diligence and invoicing workflows. Spec-driven development with CLAUDE.md and AGENTS.md instruction files, ADRs and audit trails keeps AI-assisted code reviewable.",
      },
      {
        lead: "AI platforms",
        text: "Primary developer on six systems: a forensic due-diligence platform, a tender-intelligence platform, a careers platform for lawyers, a fee-invoice analysis tool, delivery telemetry and an engineering command centre. Claude and Voyage AI sit behind owned provider seams with prompt caching, Batch API, tiered model routing, usage metering and hard cost circuit-breakers; hybrid RAG with grounded, cited answers and offline evals for prompt-injection defence and source attribution.",
      },
      {
        lead: "Local and sovereign AI",
        text: "Train, fine-tune and deploy local LLMs (Ollama, LM Studio) for privacy-sensitive work; researched on-premise LLM infrastructure (GPU sizing, POPIA, Johannesburg colocation, open-weight stacks); built API-key-based AI integrations for internal tooling.",
      },
      {
        lead: "Cloud, security and administration",
        text: "Administer the GitHub organisation, the AWS estate (ECS Fargate, RDS, S3, CloudFront, EC2 with SSM-only access) and all critical developer accounts and AI API keys (Anthropic, Voyage AI and others); Terraform, CloudFormation and GitHub Actions (OIDC) pipelines with secret scanning, SBOM and CVE gates.",
      },
      {
        lead: "Application management and leadership",
        text: "Oversee production uptime, security and performance; work with senior members and shareholders to deliver legal-sector software with a view to expanding across industries. Developed the keynote “The Great Shift: AGI and Africa's Next Century” for a legal-sector audience (September 2026).",
      },
    ],
  },
  {
    id: "kone",
    title: "Founder",
    org: "K-ONE IT SOLUTIONS",
    place: "Johannesburg, South Africa",
    period: "2025 – Present",
    current: true,
    summary: "Independent IT and software studio.",
    bullets: [
      {
        lead: "Studio",
        text: "Founded an independent IT and software studio; delivered the company website (HTML, CSS, PHP), a React social-media platform and a Dockerised server-health monitoring tool (Python) with Slack and email alerting.",
      },
    ],
  },
  {
    id: "gao-platoon",
    title: "Intern Assistant Platoon Leader",
    org: "GAO Tek Inc.",
    place: "Canada (remote)",
    period: "July 2024 – August 2024",
    bullets: [
      { lead: "Operations", text: "Directed operations for multiple technical squads, ensuring seamless coordination and high productivity." },
      { lead: "Mentoring", text: "Mentored and provided technical support to interns so project benchmarks were met." },
      { lead: "Reporting", text: "Collaborated with senior management to deliver data-driven reports on squad performance and project milestones." },
    ],
  },
  {
    id: "gao-squad",
    title: "Intern Assistant Squad Leader & Tech Support",
    org: "GAO Tek Inc.",
    place: "Canada (remote)",
    period: "April 2024 – July 2024",
    bullets: [
      { lead: "Quality control", text: "Managed quality control by reviewing technical descriptions and code and giving constructive feedback." },
      { lead: "Alignment", text: "Facilitated team meetings to align technical execution with management's strategic goals." },
      { lead: "Onboarding", text: "Onboarded new interns on tools and workflow; managed WordPress product descriptions with 100% accuracy." },
    ],
  },
]

/**
 * Systems built in the law-firm role. The code lives in the firm's private repositories, so most entries are
 * labelled Private or Internal and carry no link. The two public snapshots are published demonstrations with
 * fictional data, and only those link out.
 */
export const firmWorks: FirmWork[] = [
  {
    id: "due-diligence",
    title: "Forensic due-diligence platform",
    status: { label: "Private", tone: "private" },
    role: "Primary developer",
    detail:
      "An agentic integrity-intelligence platform that sweeps 20+ sanctions, PEP, registry and media sources, resolves entities into a graph and delivers cited, sign-off-gated due-diligence reports. A multi-agent state machine handles aggregation, entity resolution and adversarial review, and a RAG chat answers only from indexed sources. About 900 source files and 78 migrations, with an offline AI eval baseline.",
    stack: ["Python", "FastAPI", "Next.js", "PostgreSQL + pgvector", "Neo4j", "AWS"],
  },
  {
    id: "tender-intelligence",
    title: "Tender intelligence platform",
    status: { label: "Private", tone: "private" },
    role: "Primary developer",
    detail:
      "A multi-tenant, agent-driven SaaS that finds, reads, qualifies and assembles public-sector tenders: multi-source acquisition, Docling PDF and OCR understanding, a cheap-first relevance cascade, win-probability scoring and submission packs that are never auto-submitted. Schema-per-tenant PostgreSQL, six-role RBAC and a POPIA consent gate, shipped through release R22.",
    stack: ["Python", "FastAPI", "PostgreSQL + pgvector", "React", "Claude", "Voyage AI", "AWS"],
  },
  {
    id: "case-management",
    title: "Enterprise case-management platform",
    status: { label: "Private", tone: "private" },
    role: "Project lead",
    detail:
      "A multi-tenant platform for corporate and state-owned clients covering the full matter lifecycle, with 13 oversight reports and four role-based portals. A modular monolith of 20 modules across six domains with row-level security, Keycloak and a custom Java MFA authenticator, malware scanning and SBOM and CVE scanning in CI. About 560 Java files and 63 migrations.",
    stack: ["Java 21", "Spring Boot 4", "Spring Modulith", "PostgreSQL", "Keycloak", "Next.js 16", "AWS"],
  },
  {
    id: "invoice-analysis",
    title: "Fee invoice analysis tool",
    status: { label: "Internal tool", tone: "private" },
    role: "Primary developer",
    detail:
      "Decodes glyph-obfuscated legal invoice PDFs, reconciles every fee line to the cent, categorises with learned rules and Claude, and exports the team's Excel analysis. Runs on AWS through Terraform, with CloudWatch alarms and SNS alerts.",
    stack: ["Java 21", "Spring Boot", "Python", "FastAPI", "Claude", "Terraform", "AWS"],
  },
  {
    id: "careers-platform",
    title: "Careers platform for lawyers",
    status: { label: "Private · in development", tone: "wip" },
    role: "Solo build",
    detail:
      "Verified credentials, salary-transparent jobs and explainable checklists instead of black-box match scores. Open Badges v2 credentials with public verification and consent-based Claude drafting, under a hard rule that AI never verifies credentials or decides hiring.",
    stack: ["NestJS", "Next.js", "Prisma", "PostgreSQL", "Claude", "pnpm"],
  },
  {
    id: "command-centre",
    title: "Engineering command centre",
    status: { label: "Public demo snapshot", tone: "code" },
    role: "Solo build",
    detail:
      "Projects, sprints and tasks, five role-based dashboards, documentation, meeting notes, Mermaid diagrams and an optional AI assistant that needs human approval before any destructive tool runs. The public snapshot uses fictional data; a fuller private version adds Claude-powered agents, an MCP endpoint and hybrid RAG.",
    stack: ["React 18", "TypeScript", "Vite", "Express", "Prisma", "SQLite"],
    href: `${GH}/systems-project-management-`,
  },
  {
    id: "performance-management",
    title: "Attorney performance-management system",
    status: { label: "Public demo snapshot", tone: "code" },
    role: "Team project",
    detail:
      "A 360° review platform for a legal firm: attorneys launch quarterly cycles, managers, peers, subordinates and clients give feedback, and managers draft, finalise and approve reports that roll up into an annual one. Optional AI assists but never finalises, and every state change is audited. The public snapshot uses fictional data.",
    stack: ["React 18", "Vite", "Express", "PostgreSQL", "Prisma", "Claude (optional)"],
    href: `${GH}/performance-management-tool`,
  },
  {
    id: "delivery-telemetry",
    title: "Delivery telemetry",
    status: { label: "Internal tool", tone: "private" },
    role: "Primary developer",
    detail:
      "A daily pipeline that measures delivery consistency from tamper-proof, server-stamped evidence (pull-request, review and issue dates) instead of commit counts. It generates an executive dashboard, SVG graphs and a key-person-risk view, updates the organisation profile and fails loudly by design.",
    stack: ["Python", "GitHub Actions", "GitHub API"],
  },
  {
    id: "event-platforms",
    title: "Event and engagement platforms",
    status: { label: "Team projects", tone: "muted" },
    role: "Team delivery",
    detail:
      "A public registration site for a firm event with POPIA consent capture, a JWT-secured admin dashboard, transactional email and CSV export; a staff-engagement games platform for a convention (live leaderboard, quizzes, a QR scavenger hunt and an admin studio) on a single hardened AWS EC2 host; a knowledge-vault and library-circulation system on Supabase; and a community campaign site.",
    stack: ["Node.js", "Express", "PostgreSQL", "Docker", "Supabase", "AWS EC2", "Render"],
  },
]
