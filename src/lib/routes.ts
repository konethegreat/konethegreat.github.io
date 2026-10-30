import routes from "@/data/routes.json"

export interface RouteRecord {
  path: string
  title: string
  description: string
  params: Record<string, string>
}

const records = routes as Array<{ path: string; title: string; description: string }>

export function normalizePath(pathname: string): string {
  const clean = pathname.split("?")[0].split("#")[0].replace(/\/+$/, "")
  return clean === "" ? "/" : clean
}

export function matchRoute(pathname: string): RouteRecord | null {
  const clean = normalizePath(pathname)
  const parts = clean.split("/").filter(Boolean)

  for (const record of records) {
    const pattern = record.path.split("/").filter(Boolean)
    if (pattern.length !== parts.length) continue
    const params: Record<string, string> = {}
    let matched = true
    for (let i = 0; i < pattern.length; i++) {
      const segment = pattern[i]
      if (segment.startsWith(":")) {
        params[segment.slice(1)] = decodeURIComponent(parts[i])
      } else if (segment !== parts[i]) {
        matched = false
        break
      }
    }
    if (matched) {
      if (parts[0] === "work" && parts[1]) params.slug = parts[1]
      return { ...record, params }
    }
  }
  return null
}

export function routeMeta(pathname: string): { title: string; description: string } {
  const match = matchRoute(pathname)
  if (match) return { title: match.title, description: match.description }
  return {
    title: "Not found · Kone Tshivhinda",
    description: "That page does not exist. Return to the work or the home page.",
  }
}
