import { mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs"
import { tmpdir } from "node:os"
import { join } from "node:path"
import { afterEach, describe, expect, it } from "vitest"
import { ensureDeps, missingPackages, requiredPackages } from "../../scripts/ensure-deps.mjs"

const dirs: string[] = []

function tempRoot(installed: string[]) {
  const root = mkdtempSync(join(tmpdir(), "ensure-deps-"))
  dirs.push(root)
  for (const name of installed) {
    mkdirSync(join(root, "node_modules", name), { recursive: true })
    writeFileSync(join(root, "node_modules", name, "package.json"), "{}")
  }
  return root
}

afterEach(() => {
  while (dirs.length > 0) rmSync(dirs.pop()!, { recursive: true, force: true })
})

describe("ensure-deps", () => {
  it("covers every tool the build and test scripts call", () => {
    const pkg = JSON.parse(readFileSync("package.json", "utf8"))
    expect(pkg.scripts.build).toContain("tsc")
    expect(pkg.scripts.build).toContain("vite build")
    expect(pkg.scripts.test).toContain("vitest")
    expect(requiredPackages).toEqual(expect.arrayContaining(["typescript", "vite", "vitest"]))
    expect(pkg.scripts.prebuild).toBe("node scripts/ensure-deps.mjs")
    expect(pkg.scripts.pretest).toBe("node scripts/ensure-deps.mjs")
  })

  it("reports every required package when node_modules is absent", () => {
    expect(missingPackages(tempRoot([]))).toEqual(requiredPackages)
  })

  it("reports only the packages that are absent", () => {
    expect(missingPackages(tempRoot(["typescript", "vite"]))).toEqual(["vitest"])
  })

  it("does nothing when every package is installed", () => {
    expect(ensureDeps(tempRoot(requiredPackages))).toEqual({ installed: false, missing: [] })
  })

  it("fails with a clear message when packages are missing and there is no lockfile", () => {
    expect(() => ensureDeps(tempRoot([]))).toThrow(/no package-lock\.json/)
  })
})
