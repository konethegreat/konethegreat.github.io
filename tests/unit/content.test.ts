import { existsSync, readdirSync, readFileSync, statSync } from "node:fs"
import { join } from "node:path"
import { describe, expect, it } from "vitest"
import { aboutChapters, aboutIntro, stackProof } from "@/data/about"
import { caseStudies, nextCaseStudy } from "@/data/case-studies"
import { credits } from "@/data/credits"
import { langColor, repoMeta } from "@/data/github"
import { liveProjects } from "@/data/live"
import { principles, publicRepoCount } from "@/data/profile"
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
    const slugs = ["vigil", "clearcut", "timelex", "sa-jas", "munisolve", "reservoir", "ui-vault", "k-one", "agentos-studio"]
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
    expect(nextCaseStudy("k-one").slug).toBe("agentos-studio")
    expect(nextCaseStudy("agentos-studio").slug).toBe("vigil")
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

  it("uses no em dashes or en dashes in any src/data .ts file", () => {
    const dataDir = join(process.cwd(), "src", "data")
    const dashExcludedFiles = ["shots.generated.ts"]
    const dashes = [
      { char: "\u2014", name: "em dash (U+2014)" },
      { char: "\u2013", name: "en dash (U+2013)" },
    ]
    const files = readdirSync(dataDir)
      .filter((file) => file.endsWith(".ts") && !dashExcludedFiles.includes(file))
      .sort()
    expect(files.length).toBeGreaterThan(0)
    const found: string[] = []
    for (const file of files) {
      const text = readFileSync(join(dataDir, file), "utf8")
      for (const dash of dashes) {
        if (text.includes(dash.char)) found.push(`src/data/${file} contains an ${dash.name}`)
      }
    }
    expect(found, found.join("\n")).toEqual([])
  })

  it("writes no em dashes or en dashes from scripts/gen_photo_data.py", () => {
    const script = readFileSync(join(process.cwd(), "scripts", "gen_photo_data.py"), "utf8")
    expect(script).not.toContain("\u2014")
    expect(script).not.toContain("\u2013")
    const generated = readFileSync(join(process.cwd(), "src", "data", "photos.generated.ts"), "utf8")
    const header = generated.split("\n")[0].trimEnd()
    expect(header.startsWith("// AUTO-GENERATED by scripts/gen_photo_data.py")).toBe(true)
    expect(script).toContain(`"${header}\\n"`)
  })

  it("names the same AgentOS Studio version in projects.ts and case-studies.ts", () => {
    const semver = /\d+\.\d+\.\d+/
    const note = projectBySlug("agentos-studio")?.note
    expect(note, "src/data/projects.ts has no agentos-studio project with a note").toBeTypeOf("string")
    const noteVersion = note?.match(semver)?.[0]
    expect(noteVersion, "the agentos-studio note in src/data/projects.ts names no version").toBeDefined()
    const study = caseStudies.find((entry) => entry.slug === "agentos-studio")
    expect(study, "src/data/case-studies.ts has no agentos-studio case study").toBeDefined()
    const versionFact = study?.sections
      .flatMap((section) => (section.kind === "facts" ? section.facts : []))
      .find((fact) => fact.label === "Version")
    expect(versionFact, "the agentos-studio case study in src/data/case-studies.ts has no Version fact").toBeDefined()
    const factVersion = versionFact?.value.match(semver)?.[0]
    expect(factVersion, "the agentos-studio Version fact in src/data/case-studies.ts names no version").toBeDefined()
    expect(
      factVersion,
      `src/data/projects.ts names AgentOS Studio ${noteVersion} but src/data/case-studies.ts names ${factVersion}`,
    ).toBe(noteVersion)
  })

  it("has a repoMeta entry in github.ts for every konethegreat repository linked from projects.ts", () => {
    // GitHub reports no language for reservoir (gh api repos/konethegreat/reservoir/languages returns {}).
    const noLanguageRepos = ["reservoir"]
    const repoLink = /https:\/\/github\.com\/konethegreat\/([A-Za-z0-9._-]+)/g
    const linked = new Set<string>()
    for (const match of JSON.stringify(projects).matchAll(repoLink)) linked.add(match[1])
    expect(linked.size, "src/data/projects.ts links no konethegreat repositories").toBeGreaterThan(0)
    const missing = [...linked]
      .filter((repo) => !noLanguageRepos.includes(repo) && !Object.hasOwn(repoMeta, repo))
      .sort()
    expect(missing, `src/data/github.ts has no repoMeta entry for: ${missing.join(", ")}`).toEqual([])
  })

  it("has a hex langColor entry in github.ts for every language in repoMeta", () => {
    const langs = new Set(Object.values(repoMeta).map((entry) => entry.lang))
    const missing = [...langs].filter((lang) => !/^#[0-9a-fA-F]{6}$/.test(langColor[lang] ?? "")).sort()
    expect(missing, `src/data/github.ts has no valid hex langColor for: ${missing.join(", ")}`).toEqual([])
  })

  it("keeps publicRepoCount at least as large as the repoMeta entries", () => {
    expect(publicRepoCount).toBeGreaterThanOrEqual(Object.keys(repoMeta).length)
  })
})
