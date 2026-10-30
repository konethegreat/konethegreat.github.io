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
