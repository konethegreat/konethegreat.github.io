import { projectBySlug } from "./projects"
import type { LiveProject } from "./types"

const entries: Array<{ slug: string; tag: string; accent: LiveProject["accent"] }> = [
  { slug: "sa-jas", tag: "AI agents", accent: "copper" },
  { slug: "clearcut", tag: "Invoicing", accent: "brass" },
  { slug: "munisolve", tag: "Civic tech", accent: "teal" },
  { slug: "timelex-v1", tag: "Legal tech prototype", accent: "copper" },
  { slug: "k-one", tag: "Studio", accent: "copper" },
  { slug: "ui-vault", tag: "Design system", accent: "brass" },
  { slug: "reservoir", tag: "Culture archive", accent: "teal" },
]

export const liveProjects: LiveProject[] = entries.map(({ slug, tag, accent }) => {
  const project = projectBySlug(slug)
  const live = project?.links.find((link) => link.kind === "live")
  if (!project || !live) {
    throw new Error(`Live project data is missing for "${slug}"`)
  }
  return { slug, name: project.title, url: live.href, tag, accent }
})
