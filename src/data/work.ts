import { caseStudies } from "./case-studies"
import { projectBySlug, projects } from "./projects"
import type { Project } from "./types"

export type StationId = "agents" | "retrieval" | "product" | "local-first" | "cloud" | "quality"

export interface Station {
  id: StationId
  label: string
  blurb: string
  position: [number, number, number]
}

export const stations: Station[] = [
  { id: "agents", label: "Agents", blurb: "Tool use, sign-off and visible automation", position: [-3.1, 0, -0.4] },
  { id: "retrieval", label: "Retrieval", blurb: "Cited answers over real documents", position: [-1.8, 0, 1.7] },
  { id: "product", label: "Product", blurb: "Interfaces people can actually use", position: [0, 0, 2.4] },
  { id: "local-first", label: "Local-first", blurb: "Sovereign models and offline capture", position: [1.8, 0, 1.7] },
  { id: "cloud", label: "Cloud", blurb: "Deployed, monitored and operated", position: [3.1, 0, -0.4] },
  { id: "quality", label: "Quality", blurb: "Tests, ADRs and threat models", position: [0, 0, -2.6] },
]

const slugsForStation: Record<StationId, string[]> = {
  agents: ["vigil", "sa-jas", "timelex"],
  retrieval: ["vigil", "reservoir", "ui-vault"],
  product: ["sa-jas", "munisolve", "ui-vault", "k-one"],
  "local-first": ["vigil", "timelex", "reservoir"],
  cloud: ["clearcut", "munisolve", "k-one"],
  quality: ["vigil", "clearcut", "timelex", "ui-vault"],
}

export const caseStudyProjects: Project[] = caseStudies.flatMap((study) => {
  const project = projectBySlug(study.slug)
  return project ? [project] : []
})

const studySlugs = new Set(caseStudies.map((study) => study.slug))
export const archiveOnlyProjects = projects.filter((project) => !studySlugs.has(project.slug))

export function projectMatchesStation(project: Project, station: StationId): boolean {
  return slugsForStation[station].includes(project.slug)
}

export function projectsForStation(station: StationId | null): Project[] {
  if (!station) return caseStudyProjects
  return caseStudyProjects.filter((project) => projectMatchesStation(project, station))
}
