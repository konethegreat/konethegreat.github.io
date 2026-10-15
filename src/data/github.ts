import { links } from "./profile"

/** Snapshot date for the repository facts on the GitHub section. */
export const githubSnapshot = "October 2026"

/** Primary language (as GitHub reports it) and fork status for each public repository on konethegreat. */
export const repoMeta: Record<string, { lang: string; fork?: boolean }> = {
  "MB-IQ": { lang: "TypeScript" },
  scratch: { lang: "JavaScript" },
  "mostoeneng-pms": { lang: "JavaScript" },
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

export const accounts = {
  primary: {
    handle: "konethegreatest",
    href: links.githubMain,
    badge: "Primary · most active",
    blurb:
      "Where the day-to-day engineering happens. I work inside the Motsoeneng Bill Technology organisation, where the firm's AI platforms live in private repositories, and Vigil lives here too.",
    facts: [
      { label: "Organisation", value: "Motsoeneng-Bill-Tech (member, administrator)" },
      { label: "Organisation repos", value: "14 repositories, 13 of them private" },
      { label: "Own repositories", value: "Vigil (private)" },
    ],
  },
  personal: {
    handle: "konethegreat",
    href: links.githubPersonal,
    badge: "Personal · public work",
    blurb:
      "Public home for my own projects: live products, source snapshots of earlier builds, studio work and my IBM coursework. Everything listed below can be opened.",
    facts: [
      { label: "Public repositories", value: "19, including my profile README" },
      { label: "Live products", value: "MuniSolve ZA and a TimeLex prototype" },
      { label: "Coursework", value: "IBM Full Stack capstones (several are forks of course templates)" },
    ],
  },
} as const

/** Repository practices, taken from the CV. */
export const hygiene = [
  "CLAUDE.md and AGENTS.md instruction files",
  "ADRs (architecture decision records)",
  "GitHub Actions pipelines with OIDC",
  "Secret scanning (gitleaks)",
  "SBOM and CVE gates",
  "Dependabot",
  "Audit trails around AI-assisted code",
]
