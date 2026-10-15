export type Access = "live" | "code" | "private" | "internal" | "local"

export type Tone = "live" | "code" | "wip" | "private" | "muted"

export type ProjectGroup =
  | "ai-platform"
  | "personal-ai"
  | "enterprise"
  | "web-civic"
  | "coursework"

export type Home = "org" | "konethegreatest" | "konethegreat" | "local"

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
  /** Where the work lives: the firm's org, the primary account or the personal account. */
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
