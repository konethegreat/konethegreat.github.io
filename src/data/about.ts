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
