import { mkdir, readFile, writeFile } from "node:fs/promises"
import { dirname, join } from "node:path"

const dist = "dist"
const routes = JSON.parse(await readFile("src/data/routes.json", "utf8"))
const html = await readFile(join(dist, "index.html"), "utf8")

for (const route of routes) {
  const target = route.path === "/" ? join(dist, "index.html") : join(dist, route.path, "index.html")
  await mkdir(dirname(target), { recursive: true })
  await writeFile(target, html)
}

await writeFile(join(dist, "404.html"), html)
console.log(`Copied index.html into ${routes.length} route folders and 404.html`)
