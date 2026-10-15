import { projects } from "./projects"

export const site = {
  url: "https://konethegreat.github.io",
  name: "Kone Tshivhinda",
  firstName: "Kone",
  title: "AI Systems Engineer · Full-Stack Developer",
  location: "Johannesburg, South Africa",
  updated: "October 2026",
} as const

export const links = {
  github: "https://github.com/konethegreat",
  linkedin: "https://www.linkedin.com/in/kone-tshivhinda-32a760233/",
  credly: "https://www.credly.com/users/kone-tshivhinda/badges",
  ibmCert: "https://www.coursera.org/account/accomplishments/specialization/ESSIQ8HCQBA6",
} as const

/** Public repositories on the GitHub account, including the profile README (a snapshot, see data/github.ts). */
export const publicRepoCount = 19

/** Assembled in the browser so the address is not sitting in the page source as plain text. */
export const emailParts = { user: "erictshivhinda", domain: "gmail.com" } as const
export const buildEmail = () => `${emailParts.user}@${emailParts.domain}`

export const rotatingWords = [
  "agentic",
  "auditable",
  "grounded",
  "local-first",
  "cost-capped",
  "sovereign",
] as const

export const heroIntro =
  "AI systems engineer and full-stack developer in Johannesburg. I design and build agentic, auditable, local-first software, from a sovereign intelligence platform to a desktop agent that finds jobs and tailors applications, with a human signing off every decision that matters."

export const aboutParagraphs = [
  "I ship agent-driven software from the first commit to production, mostly on my own: a sovereign operational-intelligence platform, a desktop agent that finds South African vacancies and tailors each application, and a live municipal service-delivery site with an AI assistant.",
  "I also build civic tech, legal tech and local-first AI, from a private diary you can question with RAG to a prototype that drafts lawyers' time entries for approval, and I run K-ONE IT SOLUTIONS, a small independent studio.",
  "I use every major AI coding tool every day (Claude Code, OpenAI Codex, GitHub Copilot, Gemini, Cursor, Kiro, Antigravity) and I am just as comfortable on local and sovereign models with Ollama and LM Studio.",
]

/** The headline numbers are counted from the project data, so they cannot drift from the cards. */
const built = projects.filter((p) => p.group !== "coursework")

export const stats = [
  { value: built.length, suffix: "", label: "Projects built", hint: "AI, legal-tech, civic-tech & studio work" },
  {
    value: projects.filter((p) => p.access === "live").length,
    suffix: "",
    label: "Live deployments",
    hint: "Public products running today",
  },
  { value: publicRepoCount, suffix: "", label: "Public repositories", hint: "On GitHub, coursework included" },
  {
    value: built.filter((p) => p.tags.includes("AI")).length,
    suffix: "",
    label: "AI projects",
    hint: "Agents, RAG and local models",
  },
] as const

export const moreNumbers = [
  { value: "12", label: "SA job boards covered by SA-JAS scrapers" },
  { value: "65", label: "server tests behind SA-JAS" },
  { value: "12", label: "architecture decision records in Vigil" },
  { value: "43", label: "roadmap phases planned for Vigil" },
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
    body: "Every system I build has a human gate before anything consequential happens: analyst review before a model's proposal is published, a person approving every drafted time entry, a person pressing Submit on every application. AI never finalises anything on its own and never presses Submit.",
    proof: [
      { label: "Vigil", slug: "vigil" },
      { label: "SA-JAS", slug: "sa-jas" },
      { label: "TimeLex v2", slug: "timelex-v2" },
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
      { label: "Diary", slug: "diary" },
    ],
  },
  {
    id: "honest-status",
    title: "Honest about status",
    line: "Live, simulated, private or demo, said plainly.",
    body: "Claims match verified behaviour. Public snapshots say what they are, simulated integrations are labelled as simulated, and licences are respected. If it has not been verified, I do not call it production-ready.",
    proof: [
      { label: "TimeLex v2", slug: "timelex-v2" },
      { label: "SA-JAS", slug: "sa-jas" },
      { label: "Diary", slug: "diary" },
    ],
  },
  {
    id: "sovereign",
    title: "Sovereign by design",
    line: "Local models and data that stay home.",
    body: "Privacy-sensitive work runs on local or open-weight models, with POPIA-aware data handling, so prompts and evidence do not have to leave the machine, or the country.",
    proof: [
      { label: "Vigil", slug: "vigil" },
      { label: "Diary", slug: "diary" },
      { label: "Local AI Document Generator", slug: "local-ai-docgen" },
    ],
  },
]

export const nowItems = [
  { label: "Founder", detail: "K-ONE IT SOLUTIONS" },
  { label: "Building", detail: "Vigil, sovereign intelligence for Africa" },
  { label: "Next", detail: "A public case study of Vigil" },
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
