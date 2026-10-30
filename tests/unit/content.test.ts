import { describe, expect, it } from "vitest"
import { caseStudies } from "@/data/case-studies"
import { liveProjects } from "@/data/live"
import { projects, projectBySlug } from "@/data/projects"
import { services } from "@/data/services"

describe("content model", () => {
  it("has a case study for every routable project", () => {
    const slugs = ["vigil", "clearcut", "timelex", "sa-jas", "munisolve", "reservoir", "ui-vault", "k-one"]
    for (const slug of slugs) {
      expect(caseStudies.some((study) => study.slug === slug)).toBe(true)
      expect(projectBySlug(slug)).toBeDefined()
    }
  })

  it("only lists live projects with a verified https URL", () => {
    for (const live of liveProjects) {
      expect(live.url.startsWith("https://")).toBe(true)
      expect(projectBySlug(live.slug)).toBeDefined()
    }
  })

  it("uses the k-one slug, not the old k-one-website id", () => {
    expect(projects.some((project) => project.slug === "k-one")).toBe(true)
    expect(projects.some((project) => project.slug === "k-one-website")).toBe(false)
  })

  it("gives every service at least three deliverables", () => {
    for (const service of services) {
      expect(service.deliverables.length).toBeGreaterThanOrEqual(3)
    }
  })
})
