import { readFileSync } from "node:fs"
import { join } from "node:path"
import { describe, expect, it } from "vitest"
import { matchRoute, routeMeta } from "@/lib/routes"

describe("matchRoute", () => {
  it("matches the home route", () => {
    expect(matchRoute("/")?.path).toBe("/")
  })

  it("ignores a trailing slash", () => {
    expect(matchRoute("/work/")?.path).toBe("/work")
  })

  it("captures a project slug", () => {
    expect(matchRoute("/work/vigil")?.params.slug).toBe("vigil")
  })

  it("returns null for an unknown project", () => {
    expect(matchRoute("/work/nope")).toBeNull()
  })
})

describe("routeMeta", () => {
  it("returns a title and description", () => {
    const meta = routeMeta("/services")
    expect(meta.title).toContain("Services")
    expect(meta.description.length).toBeGreaterThan(20)
  })
})

describe("sitemap", () => {
  it("lists every route with the release date", () => {
    const xml = readFileSync(join(process.cwd(), "public/sitemap.xml"), "utf8")
    const records = JSON.parse(
      readFileSync(join(process.cwd(), "src/data/routes.json"), "utf8"),
    ) as Array<{ path: string }>
    const locs = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => match[1])
    expect(locs).toHaveLength(records.length)
    for (const record of records) {
      expect(locs).toContain(`https://konethegreat.github.io${record.path === "/" ? "/" : record.path}`)
    }
    expect(xml).toContain("<lastmod>2026-10-30</lastmod>")
  })
})
