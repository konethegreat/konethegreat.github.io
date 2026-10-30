import { chromium } from "@playwright/test"
import { mkdir } from "node:fs/promises"
import { caseStudies } from "../src/data/case-studies"
import { projectBySlug } from "../src/data/projects"

const esc = (value: string) =>
  value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;")
const list = (items: string[], limit: number) =>
  items.slice(0, limit).map((item) => `<li>${esc(item)}</li>`).join("")

function prose(study: (typeof caseStudies)[number], heading: string) {
  const section = study.sections.find((s) => s.kind === "prose" && s.heading === heading)
  return section && section.kind === "prose" ? section.body.slice(0, 2) : []
}

function built(study: (typeof caseStudies)[number], highlights: string[]) {
  const section = study.sections.find((s) => s.kind === "list" && s.heading === "What is built")
  return section && section.kind === "list" ? section.items : highlights
}

function html(study: (typeof caseStudies)[number]) {
  const project = projectBySlug(study.slug)
  if (!project) throw new Error(`missing project ${study.slug}`)
  const source =
    project.home === "konethegreat"
      ? "Generated from the public repository, October 2026."
      : "Generated from the project record and published notes, October 2026."
  const decisions = (study.decisions ?? [])
    .slice(0, 3)
    .map(
      (d) => `<article><h3>${esc(d.title)}</h3><p><strong>Choice.</strong> ${esc(d.choice)}</p>
      <p><strong>Why.</strong> ${esc(d.why)}</p><p><strong>Trade-off.</strong> ${esc(d.tradeoff)}</p></article>`,
    )
    .join("")
  const problems = prose(study, "The problem")
    .map((p) => `<p>${esc(p)}</p>`)
    .join("")
  const links = project.links
    .map((link) => `<li>${esc(link.label)}: <a href="${esc(link.href)}">${esc(link.href)}</a></li>`)
    .join("")
  return `<!doctype html><html lang="en"><head><meta charset="utf-8"><title>${esc(project.title)} brief</title>
  <style>
    @page { size: A4; margin: 0; }
    * { box-sizing: border-box; }
    body { margin: 0; color: #17140f; font: 10.2pt/1.5 "Segoe UI", Arial, sans-serif; }
    .page { position: relative; width: 210mm; height: 297mm; padding: 17mm 18mm 20mm; page-break-after: always; overflow: hidden; }
    .page:last-child { page-break-after: auto; }
    .bar { position: absolute; inset: 0 0 auto; height: 5mm; background: linear-gradient(90deg, #b7823b, #2f7d75); }
    .eyebrow { margin: 0; font: 8pt/1.4 "Courier New", monospace; letter-spacing: .18em; text-transform: uppercase; color: #7a5a2e; }
    h1 { margin: 6mm 0 2mm; font-size: 30pt; line-height: 1; letter-spacing: -.02em; text-transform: uppercase; }
    .tagline { margin: 0; font: italic 14pt/1.35 Georgia, serif; color: #4a443b; }
    .meta { display: flex; gap: 8mm; margin: 6mm 0 0; padding: 4mm 0; border-top: 1px solid #d9d1c2; border-bottom: 1px solid #d9d1c2; }
    .meta div { font-size: 9pt; }
    .meta span { display: block; font: 7pt/1.4 "Courier New", monospace; letter-spacing: .14em; text-transform: uppercase; color: #7a7368; }
    h2 { margin: 7mm 0 2mm; font-size: 15pt; }
    p { margin: 0 0 2.5mm; }
    ul { margin: 0; padding-left: 5mm; }
    li { margin-bottom: 1.6mm; }
    article { padding: 3mm 0; border-bottom: 1px solid #e6dfd2; }
    article h3 { margin: 0 0 1.5mm; font-size: 11.5pt; }
    .stack { display: flex; flex-wrap: wrap; gap: 2mm; padding: 0; list-style: none; }
    .stack li { margin: 0; padding: 1mm 2mm; border: 1px solid #d9d1c2; border-radius: 2mm; font: 8pt/1.2 "Courier New", monospace; }
    footer { position: absolute; left: 18mm; right: 18mm; bottom: 10mm; display: flex; justify-content: space-between; gap: 6mm; border-top: 1px solid #d9d1c2; padding-top: 3mm; font: 7.6pt/1.5 "Courier New", monospace; color: #6f685d; }
    a { color: #2f6d66; text-decoration: none; }
  </style></head><body>
  <section class="page"><div class="bar"></div>
    <p class="eyebrow">Kone Tshivhinda · Technical brief</p>
    <h1>${esc(project.title)}</h1>
    <p class="tagline">${esc(study.tagline)}</p>
    <div class="meta">
      <div><span>Year</span>${esc(study.year)}</div>
      <div><span>Role</span>${esc(study.role)}</div>
      <div><span>Team</span>${esc(study.team)}</div>
      <div><span>Status</span>${esc(project.status.label)}</div>
    </div>
    <h2>Summary</h2><p>${esc(study.summary)}</p>
    <h2>The problem</h2>${problems}
    <h2>What is built</h2><ul>${list(built(study, project.highlights), 5)}</ul>
    <footer><span>${esc(source)}</span><span>konethegreat.github.io/work/${esc(study.slug)}</span></footer>
  </section>
  <section class="page"><div class="bar"></div>
    <p class="eyebrow">${esc(project.title)} · decisions and stack</p>
    <h2>Decisions that matter</h2>${decisions}
    <h2>Stack</h2><ul class="stack">${study.stack.map((s) => `<li>${esc(s)}</li>`).join("")}</ul>
    <h2>Where to look</h2>
    <ul>${links}
      <li>Case study: <a href="https://konethegreat.github.io/work/${esc(study.slug)}">konethegreat.github.io/work/${esc(study.slug)}</a></li>
    </ul>
    <footer><span>${esc(source)}</span><span>Kone Tshivhinda · Johannesburg</span></footer>
  </section></body></html>`
}

await mkdir("public/docs", { recursive: true })
const browser = await chromium.launch()
const page = await browser.newPage()
for (const study of caseStudies) {
  await page.setContent(html(study), { waitUntil: "load" })
  const pages = await page.evaluate(() => document.querySelectorAll(".page").length)
  if (pages !== 2) throw new Error(`${study.slug}: expected 2 pages, found ${pages}`)
  const file = `public/docs/${study.slug}-brief.pdf`
  await page.pdf({ path: file, preferCSSPageSize: true, printBackground: true })
  console.log(`wrote ${file}`)
}
await browser.close()
