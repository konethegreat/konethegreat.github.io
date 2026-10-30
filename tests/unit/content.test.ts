import { existsSync, readFileSync, statSync } from "node:fs"
import { join } from "node:path"
import { describe, expect, it } from "vitest"
import { aboutChapters, aboutIntro, stackProof } from "@/data/about"
import { caseStudies, nextCaseStudy } from "@/data/case-studies"
import { credits } from "@/data/credits"
import { liveProjects } from "@/data/live"
import { principles } from "@/data/profile"
import { projects, projectBySlug } from "@/data/projects"
import {
  engagementModels,
  processSteps,
  serviceFaq,
  serviceHonesty,
  services,
} from "@/data/services"

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

  it("has six service offers with real proof links", () => {
    const studySlugs = new Set(caseStudies.map((study) => study.slug))
    expect(services).toHaveLength(6)
    expect(services.map((service) => service.title)).toEqual([
      "Agent systems",
      "Knowledge and retrieval",
      "Product engineering",
      "Sovereign and local-first AI",
      "Cloud delivery and operations",
      "Technical audits and documentation",
    ])
    for (const service of services) {
      expect(service.included.length).toBeGreaterThanOrEqual(4)
      expect(service.proof.length).toBeGreaterThanOrEqual(2)
      expect(service.outcome.trim()).not.toBe("")
      expect(service.fits.trim()).not.toBe("")
      expect(service.shape.trim()).not.toBe("")
      for (const proof of service.proof) {
        expect(studySlugs.has(proof.slug)).toBe(true)
      }
    }
  })

  it("keeps the engagement, process, honesty and FAQ content complete", () => {
    expect(engagementModels).toHaveLength(4)
    expect(processSteps.map((step) => step.name)).toEqual([
      "Discover",
      "Design",
      "Build",
      "Prove",
      "Hand over",
    ])
    expect(serviceHonesty.map((note) => note.title)).toEqual([
      "What K-ONE does",
      "What K-ONE does not do",
      "When a specialist is the better choice",
    ])
    expect(serviceFaq.length).toBeGreaterThanOrEqual(4)
    for (const note of serviceHonesty) {
      expect(note.items.length).toBeGreaterThanOrEqual(3)
    }
  })

  it("never puts a price or an em dash in service copy", () => {
    const copy = JSON.stringify({
      services,
      engagementModels,
      processSteps,
      serviceHonesty,
      serviceFaq,
    })
    expect(copy).not.toMatch(/R\s?\d/)
    expect(copy).not.toContain("\u2014")
  })

  it("gives every case study three decisions with all fields filled", () => {
    for (const study of caseStudies) {
      expect(study.decisions?.length).toBeGreaterThanOrEqual(3)
      for (const decision of study.decisions ?? []) {
        expect(decision.title.trim()).not.toBe("")
        expect(decision.choice.trim()).not.toBe("")
        expect(decision.why.trim()).not.toBe("")
        expect(decision.tradeoff.trim()).not.toBe("")
      }
    }
  })

  it("wraps the next case study from the last one", () => {
    expect(nextCaseStudy("vigil").slug).toBe("clearcut")
    expect(nextCaseStudy("k-one").slug).toBe("vigil")
    expect(nextCaseStudy("missing").slug).toBe("vigil")
  })

  it("tells the story in seven dated chapters with evidence", () => {
    expect(aboutIntro.length).toBeGreaterThanOrEqual(3)
    expect(aboutChapters).toHaveLength(7)
    for (const chapter of aboutChapters) {
      expect(chapter.date.trim()).not.toBe("")
      expect(chapter.title.trim()).not.toBe("")
      expect(chapter.body.trim()).not.toBe("")
      expect(chapter.evidence.length).toBeGreaterThanOrEqual(2)
      for (const link of chapter.evidence) {
        expect(link.label.trim()).not.toBe("")
        expect(link.to.startsWith("/") || link.to.startsWith("https://")).toBe(true)
      }
    }
  })

  it("keeps every principle and stack proof on a real case study", () => {
    const studySlugs = new Set(caseStudies.map((study) => study.slug))
    for (const principle of principles) {
      expect(principle.proof.length).toBeGreaterThanOrEqual(2)
      for (const proof of principle.proof) {
        expect(studySlugs.has(proof.slug)).toBe(true)
      }
    }
    for (const links of Object.values(stackProof)) {
      for (const link of links) {
        if (!link.to.startsWith("/work/")) continue
        expect(studySlugs.has(link.to.replace("/work/", ""))).toBe(true)
      }
    }
  })

  it("credits every third-party piece with what changed", () => {
    expect(credits.length).toBeGreaterThanOrEqual(15)
    for (const credit of credits) {
      expect(credit.author.trim()).not.toBe("")
      expect(credit.href.startsWith("https://")).toBe(true)
      expect(credit.usedFor.trim()).not.toBe("")
      expect(credit.adapted.trim()).not.toBe("")
      expect(["components", "libraries", "typefaces"]).toContain(credit.group)
    }
    const unlicensed = credits.filter((credit) => credit.license === "inspiration")
    expect(unlicensed.length).toBeGreaterThanOrEqual(2)
    for (const credit of unlicensed) {
      expect(credit.adapted).toContain("No source copied")
    }
    for (const name of ["React", "Vite", "Tailwind CSS", "three.js", "Radix UI", "lucide", "cmdk"]) {
      expect(credits.some((credit) => credit.name === name)).toBe(true)
    }
  })

  it("hosts the license texts the credits page links to", () => {
    for (const file of ["mit.txt", "isc.txt", "ofl-1.1.txt", "apache-2.0.txt"]) {
      expect(existsSync(join(process.cwd(), "public", "licenses", file))).toBe(true)
    }
  })

  it("has a committed PDF for every brief", () => {
    for (const study of caseStudies) {
      const file = join(process.cwd(), "public", "docs", `${study.slug}-brief.pdf`)
      expect(existsSync(file), file).toBe(true)
      expect(statSync(file).size, file).toBeGreaterThan(15_000)
    }
  })

  it("uses no em dashes in the data that becomes copy", () => {
    for (const file of ["case-studies.ts", "projects.ts", "services.ts", "about.ts", "credits.ts"]) {
      expect(readFileSync(join(process.cwd(), "src", "data", file), "utf8")).not.toContain("—")
    }
  })
})
