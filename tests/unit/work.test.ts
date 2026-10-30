import { describe, expect, it } from "vitest"
import { archiveOnlyProjects, caseStudyProjects, projectMatchesStation, stations } from "@/data/work"

describe("work page data", () => {
  it("has six stations with unique ids and project mappings", () => {
    expect(stations).toHaveLength(6)
    expect(new Set(stations.map((station) => station.id)).size).toBe(6)
    for (const station of stations) {
      const matches = caseStudyProjects.filter((project) => projectMatchesStation(project, station.id))
      expect(matches.length).toBeGreaterThan(0)
    }
  })

  it("lists all eight case-study projects once", () => {
    expect(caseStudyProjects.map((project) => project.slug)).toEqual([
      "vigil", "clearcut", "timelex", "sa-jas", "munisolve", "reservoir", "ui-vault", "k-one",
    ])
  })

  it("keeps case-study projects out of the archive-only list", () => {
    const studySlugs = new Set(caseStudyProjects.map((project) => project.slug))
    expect(archiveOnlyProjects.some((project) => studySlugs.has(project.slug))).toBe(false)
  })
})
