import { caseStudies } from "../src/data/case-studies"
import { site } from "../src/data/profile"
import { projects } from "../src/data/projects"

const urls = new Set<string>([site.url, `${site.url}/sitemap.xml`])
for (const project of projects) for (const link of project.links) urls.add(link.href)
if (process.env.CHECK_PRODUCTION === "1") {
  for (const study of caseStudies) urls.add(`${site.url}/work/${study.slug}`)
}

let failures = 0
await Promise.all(
  [...urls].map(async (url) => {
    try {
      const response = await fetch(url, {
        redirect: "follow",
        signal: AbortSignal.timeout(20_000),
        headers: { "user-agent": "kone-portfolio-link-check" },
      })
      if (response.status >= 400) throw new Error(`HTTP ${response.status}`)
      console.log(`ok   ${response.status} ${url}`)
    } catch (error) {
      failures += 1
      console.error(`fail ${url} ${(error as Error).message}`)
    }
  }),
)
if (failures) process.exit(1)
console.log(`checked ${urls.size} URLs`)
