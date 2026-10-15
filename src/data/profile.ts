export const site = {
  url: "https://konethegreat.github.io",
  name: "Kone Tshivhinda",
  firstName: "Kone",
  title: "AI Systems Engineer · Full-Stack Developer",
  location: "Johannesburg, South Africa",
  updated: "October 2026",
} as const

export const links = {
  githubMain: "https://github.com/konethegreatest",
  githubPersonal: "https://github.com/konethegreat",
  linkedin: "https://www.linkedin.com/in/kone-tshivhinda-32a760233/",
  credly: "https://www.credly.com/users/kone-tshivhinda/badges",
  ibmCert: "https://www.coursera.org/account/accomplishments/specialization/ESSIQ8HCQBA6",
  orgTelemetry: "https://github.com/Motsoeneng-Bill-Tech/.github",
  cv: "/Kone_Tshivhinda_CV_2026.pdf",
} as const

/** Assembled in the browser so the address is not sitting in the page source as plain text. */
export const emailParts = { user: "erictshivhinda", domain: "gmail.com" } as const
export const buildEmail = () => `${emailParts.user}@${emailParts.domain}`

export const rotatingWords = [
  "agentic",
  "auditable",
  "grounded",
  "multi-tenant",
  "cost-capped",
  "sovereign",
] as const

export const heroIntro =
  "AI systems engineer and full-stack developer in Johannesburg. Founding engineer at Motsoeneng Bill Technology, where I lead POPIA-aligned platforms built on Claude, hybrid RAG and MCP, with a human signing off every decision that matters."

export const aboutParagraphs = [
  "I ship agent-driven software from the first commit to production. As founding engineer in the technology division of Motsoeneng Bill, a law, forensics and advisory firm, I help set up and grow a new software engineering department and lead multi-tenant platforms for due diligence, tendering, engineering delivery and case management.",
  "Outside the firm's repositories I build civic tech, legal tech and local-first AI of my own, from a municipal fault-reporting platform to a desktop agent that finds jobs and tailors applications, and I run K-ONE IT SOLUTIONS, a small independent studio.",
  "I use every major AI coding tool every day (Claude Code, OpenAI Codex, GitHub Copilot, Gemini, Cursor, Kiro, Antigravity) and I am just as comfortable on local and sovereign models with Ollama and LM Studio. I also administer the firm's GitHub organisation, AWS estate and AI keys.",
]

export const stats = [
  { value: 20, suffix: "+", label: "Projects built", hint: "AI, legal-tech, civic-tech & enterprise" },
  { value: 5, suffix: "", label: "Live deployments", hint: "Public or staff-access systems running today" },
  { value: 6, suffix: "", label: "AI platforms", hint: "Led, built solo or primary developer" },
  { value: 20, suffix: "+", label: "Sentinel integrations", hint: "Sanctions, PEP, registry & media sources" },
] as const

export const moreNumbers = [
  { value: "12", label: "SA job boards covered by SA-JAS scrapers" },
  { value: "13", label: "MCP tools exposed by MB IQ's endpoint" },
  { value: "78", label: "database migrations behind Sentinel" },
  { value: "6", label: "specialised agents inside MB IQ" },
] as const

export interface Principle {
  id: string
  title: string
  line: string
  body: string
  proof: { label: string; slug: string }[]
}

export const principles: Principle[] = [
  {
    id: "humans-sign-off",
    title: "Humans sign off",
    line: "AI drafts. People decide.",
    body: "Every system I build has a human gate before anything consequential happens: sign-off before a report is issued, a pack is authorised or an application is submitted. AI never verifies credentials, never finalises a review and never presses Submit.",
    proof: [
      { label: "Sentinel", slug: "sentinel" },
      { label: "Tender Intelligence", slug: "tender-intelligence" },
      { label: "SA-JAS", slug: "sa-jas" },
      { label: "Attest", slug: "attest" },
    ],
  },
  {
    id: "cheap-first",
    title: "Cheap first, capped always",
    line: "Predictable LLM spend by design.",
    body: "Cheap-first relevance cascades, capability-tier model routing, prompt caching, the Batch API, usage metering and hard cost circuit-breakers keep AI features useful without surprise invoices.",
    proof: [
      { label: "Tender Intelligence", slug: "tender-intelligence" },
      { label: "MB IQ", slug: "mb-iq" },
      { label: "SA-JAS", slug: "sa-jas" },
    ],
  },
  {
    id: "honest-status",
    title: "Honest about status",
    line: "Live, simulated, private or demo, said plainly.",
    body: "Claims match verified behaviour. Public snapshots say they use synthetic data, simulated integrations are labelled as simulated, and licences are respected. If it has not been verified, I do not call it production-ready.",
    proof: [
      { label: "TimeLex v2", slug: "timelex-v2" },
      { label: "MB IQ v0.6", slug: "mb-iq" },
      { label: "PMS", slug: "pms" },
      { label: "Diary", slug: "diary" },
    ],
  },
  {
    id: "sovereign",
    title: "Sovereign by design",
    line: "Local models and data that stay home.",
    body: "Privacy-sensitive work runs on local or open-weight models, with POPIA-aware data handling and South African data residency, so prompts and evidence do not have to leave the country.",
    proof: [
      { label: "Vigil", slug: "vigil" },
      { label: "Diary", slug: "diary" },
      { label: "Local AI Document Generator", slug: "local-ai-docgen" },
      { label: "Sentinel", slug: "sentinel" },
    ],
  },
]

export const nowItems = [
  { label: "Founding engineer", detail: "Motsoeneng Bill Technology" },
  { label: "Building", detail: "Vigil, sovereign intelligence for Africa" },
  { label: "Next", detail: "Public case studies of the private work" },
] as const

export const languages = [
  { name: "English", level: "Advanced", dots: 3 },
  { name: "Tshivenda", level: "Native", dots: 4 },
  { name: "Northern Sotho", level: "Intermediate", dots: 2 },
] as const

export const talk = {
  title: "The Great Shift: AGI and Africa's Next Century",
  kind: "Keynote",
  when: "September 2026",
  audience: "Legal-sector audience",
  blurb:
    "A keynote I developed for a legal-sector audience in September 2026, looking at AGI and what it could mean for Africa over the next century.",
}

export const studio = {
  name: "K-ONE IT SOLUTIONS",
  role: "Founder",
  since: "2025",
  blurb:
    "An independent IT and software studio I founded in Johannesburg in 2025. So far it has delivered a company website, a React social-media platform and a Dockerised server-health monitor.",
  works: [
    {
      title: "Company website",
      detail: "HTML, CSS and PHP site for the studio.",
      stack: ["HTML", "CSS", "PHP"],
      href: "https://github.com/konethegreat/k-one-it-solutions-website",
    },
    {
      title: "K-One Solutions Media",
      detail: "A React social-media platform.",
      stack: ["React", "JavaScript"],
      href: "https://github.com/konethegreat/k-one-solutions-media",
    },
    {
      title: "Server Health Monitor",
      detail: "CPU, memory and disk checks with Slack and email alerts, packaged in Docker.",
      stack: ["Python", "Docker"],
      href: "https://github.com/konethegreat/server-health-monitor",
    },
  ],
}
