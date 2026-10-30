import { existsSync, statSync } from "node:fs"
import { join } from "node:path"
import { describe, expect, it } from "vitest"
import { caseMedia } from "@/data/case-media"
import { caseStudies } from "@/data/case-studies"

const publicFile = (src: string) => join(process.cwd(), "public", src.replace(/^\//, ""))

describe("case media", () => {
  it("gives every case study a technical brief and a source label", () => {
    for (const study of caseStudies) {
      const media = caseMedia[study.slug]
      expect(media?.technicalBrief, study.slug).toBe(`/docs/${study.slug}-brief.pdf`)
      expect(media.briefSource).toContain("October 2026")
    }
  })

  it("uses a real, non-empty screenshot for every cover", () => {
    for (const [slug, media] of Object.entries(caseMedia)) {
      if (!media.cover) continue
      expect(media.cover.alt.length, slug).toBeGreaterThan(20)
      expect(media.cover.caption).toContain("30 October 2026")
      const file = publicFile(media.cover.src)
      expect(existsSync(file), file).toBe(true)
      expect(statSync(file).size, file).toBeGreaterThan(10_000)
    }
  })

  it("has no cover for the archive-only Vigil study", () => {
    expect(caseMedia.vigil.cover).toBeUndefined()
  })
})
