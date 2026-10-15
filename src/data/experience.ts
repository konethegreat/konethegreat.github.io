import type { Role } from "./types"

export const roles: Role[] = [
  {
    id: "mbt",
    title: "Software Engineer",
    org: "Motsoeneng Bill (Technology Division)",
    place: "Johannesburg, South Africa",
    period: "June 2026 – Present",
    current: true,
    summary: "Founding engineer on a six-member team inside a law, forensics and advisory firm.",
    bullets: [
      {
        lead: "Founding engineer, six-member team",
        text: "Spearhead the setup, structure and growth of a new software engineering department inside a law, forensics and advisory firm; project lead on scalable multi-tenant enterprise applications with schema-per-tenant isolation, row-level security and POPIA-aligned compliance.",
      },
      {
        lead: "Agentic AI and automation",
        text: "Design and run multi-agent pipelines using loop engineering (plan, act, verify, retry across delegated sub-agents) with supervisor agents, tool calling, MCP and human sign-off, eliminating manual bottlenecks across tender, due-diligence and invoicing workflows. Spec-driven development with CLAUDE.md and AGENTS.md instruction files, ADRs and audit trails keeps AI-assisted code reviewable.",
      },
      {
        lead: "AI platforms",
        text: "Primary developer on six systems (Sentinel, Tender Intelligence, MB IQ, Attest, Fee Invoice Analysis, delivery telemetry). Claude and Voyage AI sit behind owned provider seams with prompt caching, Batch API, tiered model routing, usage metering and hard cost circuit-breakers; hybrid RAG with grounded, cited answers and offline evals for prompt-injection defence and source attribution.",
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
