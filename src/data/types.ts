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

export type CaseStudySection =
  | { kind: "prose"; heading?: string; body: string[] }
  | { kind: "list"; heading: string; items: string[] }
  | { kind: "facts"; heading?: string; facts: { label: string; value: string }[] }
  | { kind: "quote"; quote: string; attribution?: string }
  | { kind: "figure"; src: string; alt: string; caption?: string; width: number; height: number }

export interface CaseStudy {
  slug: string
  tagline: string
  status: "live" | "archive" | "in-progress"
  year: string
  team: string
  role: string
  stack: string[]
  summary: string
  heroAlt: string
  accent: "brass" | "copper" | "teal"
  sections: CaseStudySection[]
  technicalBrief?: string
  gallery?: { src: string; alt: string; width: number; height: number }[]
}

export interface Service {
  id: string
  title: string
  promise: string
  deliverables: string[]
  bestFor: string
  timeline: string
  from: string
  icon: "layers" | "compass" | "code" | "spark" | "book" | "wrench"
}

export interface CreditEntry {
  name: string
  author: string
  license: "MIT" | "ISC" | "OFL" | "original" | "inspiration"
  href: string
  usedFor: string
}

export interface LiveProject {
  slug: string
  name: string
  url: string
  tag: string
  accent: "brass" | "copper" | "teal"
}
