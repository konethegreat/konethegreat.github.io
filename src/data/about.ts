export interface AboutChapter {
  id: string
  year: string
  title: string
  body: string
  proof: string[]
}

export const aboutChapters: AboutChapter[] = [
  {
    id: "foundations",
    year: "Before 2025",
    title: "Foundations, mostly at night",
    body: "IBM Full Stack Software Developer coursework, then a long stretch of building small things to understand how the pieces fit: APIs, databases, deployment, the unglamorous parts that decide whether software survives contact with a real user.",
    proof: ["IBM coursework", "Full-stack fundamentals", "Git and GitHub"],
  },
  {
    id: "studio",
    year: "2025",
    title: "K-ONE IT SOLUTIONS",
    body: "I founded a small independent studio in Johannesburg. The first work was a company site, a React social platform and a server health monitor in Docker. It taught me to scope, quote and deliver without a team to hide behind.",
    proof: ["K-ONE website", "K-One Solutions Media", "Server Health Monitor"],
  },
  {
    id: "legal",
    year: "2026",
    title: "Legal tech and the trust problem",
    body: "I built the first TimeLex prototypes, then an open, API-first successor designed around earned autonomy. By day I am a founding engineer on a law firm's new engineering team, working on multi-tenant, POPIA-aligned AI platforms with hybrid retrieval, MCP tools and human sign-off.",
    proof: ["TimeLex", "Autonomy ladder", "POPIA-aligned delivery"],
  },
  {
    id: "sovereign",
    year: "2026",
    title: "Sovereign systems",
    body: "Vigil made the constraint explicit: the evidence stays in the country. ClearCut made correctness the core of an agent product. Reservoir made consent part of the data model. Different problems, the same question: what should the machine never decide alone?",
    proof: ["Vigil", "ClearCut", "Reservoir"],
  },
  {
    id: "now",
    year: "Now",
    title: "Building in public",
    body: "I publish the decisions, the failure modes and the parts that are not built yet. UI Vault indexes the patterns I learn from. This portfolio is the same idea in a different shape: a place to show the work and the thinking behind it.",
    proof: ["UI Vault", "Open case studies", "This site"],
  },
]
