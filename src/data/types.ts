export type Access = "live" | "code" | "private" | "local"

export type Tone = "live" | "code" | "wip" | "private" | "muted"

export type ProjectGroup = "ai" | "web-civic" | "coursework"

/** Where the code lives: the public GitHub account, a private repository, or only on my machine. */
export type Home = "konethegreat" | "private" | "local"

export interface ProjectLink {
  label: string
  href: string
  kind: "live" | "code" | "docs"
}

export interface Project {
  slug: string
  title: string
  /** One-line category label shown above the title. */
  kicker: string
  period: string
  group: ProjectGroup
  /** Where the code lives. */
  home: Home
  role: string
  access: Access
  /** Honest status chip, e.g. "Live", "Public source snapshot", "Private · in development". */
  status: { label: string; tone: Tone }
  featured?: boolean
  pitch: string
  highlights: string[]
  stack: string[]
  links: ProjectLink[]
  metrics?: { label: string; value: string }[]
  /** Candid note about what is and isn't verified, simulated or shareable. */
  note?: string
  tags: string[]
}

export interface Role {
  id: string
  title: string
  org: string
  place: string
  period: string
  current?: boolean
  summary?: string
  bullets: { lead: string; text: string }[]
}

/** A system built in the law-firm role. The firm is deliberately never named; only public repositories carry a link. */
export interface FirmWork {
  id: string
  title: string
  /** Honest label: whether the code can be read, and whether the system is finished. */
  status: { label: string; tone: Tone }
  role: string
  detail: string
  stack: string[]
  /** Set only when the repository is public, so a link here can never lead to a 404. */
  href?: string
}

export interface SkillGroup {
  id: string
  title: string
  blurb?: string
  items: string[]
}

export interface JourneyNode {
  id: number
  title: string
  /** Short label drawn under the node on the orbit. */
  short: string
  date: string
  content: string
  category: string
  icon: string
  related: number[]
  status: "done" | "now" | "next"
  tech: string[]
  /** Optional deep link: a project slug to open or a section id to scroll to. */
  projectSlug?: string
}
