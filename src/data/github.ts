import { links, publicRepoCount } from "./profile"

/** Snapshot date for the repository facts on the GitHub section. */
export const githubSnapshot = "October 2026"

/** Primary language (as GitHub reports it) and fork status for each public repository on konethegreat. */
export const repoMeta: Record<string, { lang: string; fork?: boolean }> = {
  scratch: { lang: "JavaScript" },
  Diary: { lang: "Python" },
  "munisolve-za": { lang: "JavaScript" },
  "timelex-automated-time-tracking": { lang: "JavaScript" },
  "timelex-automated-time-tracking-v2": { lang: "TypeScript" },
  "server-health-monitor": { lang: "Python" },
  "k-one-it-solutions-website": { lang: "HTML" },
  "k-one-solutions-media": { lang: "JavaScript" },
  "oaqjp-final-project-emb-ai": { lang: "Python", fork: true },
  "xrwvm-fullstack_developer_capstone": { lang: "JavaScript", fork: true },
  "tfjzl-final-cloud-app-with-database": { lang: "JavaScript", fork: true },
  expressBookReviews: { lang: "JavaScript", fork: true },
  "Paradise-Nursery": { lang: "JavaScript" },
  "e-plantShopping": { lang: "JavaScript" },
  "github-final-project": { lang: "Shell" },
  "mcino-Introduction-to-Git-and-GitHub": { lang: "Python", fork: true },
}

/** GitHub's own language colours, used for the little dot beside each repository. */
export const langColor: Record<string, string> = {
  JavaScript: "#f1e05a",
  TypeScript: "#3178c6",
  Python: "#3572A5",
  HTML: "#e34c26",
  Shell: "#89e051",
}

export const account = {
  handle: "konethegreat",
  href: links.github,
  badge: "Public work",
  blurb:
    "The public home for my own projects: live products, source snapshots of earlier builds, studio work and my IBM coursework. Everything listed below can be opened.",
  facts: [
    { label: "Public repositories", value: `${publicRepoCount}, including my profile README` },
    { label: "Live products", value: "MuniSolve ZA and a TimeLex prototype" },
    { label: "Coursework", value: "IBM Full Stack capstones (several are forks of course templates)" },
  ],
} as const

/** Repository practices, each one visible in my own projects. */
export const hygiene = [
  "An INSTRUCTIONS.md contract that binds humans and AI agents (Vigil)",
  "Architecture decision records (12 in Vigil)",
  "Phased roadmaps (43 phases planned for Vigil)",
  "Automated tests (65 server tests in SA-JAS)",
  "Clean public snapshots, private history kept separate",
  "Licences and upstream attribution kept",
  "Usage ledgers and budget guards on AI spend (SA-JAS)",
]
