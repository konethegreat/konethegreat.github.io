/* Written by Kone Tshivhinda & Claude */
import { projects } from "../../data/projects"
import { buildCorpus, createIndex, type Chunk, type Index } from "./retrieval"

interface Lab {
  index: Index
  byId: Map<string, Chunk>
}

let cached: Lab | null = null

/** The portfolio's own project data, indexed once on first use. */
export function getLab(): Lab {
  if (!cached) {
    const index = createIndex(buildCorpus(projects))
    cached = { index, byId: new Map(index.chunks.map((c) => [c.id, c])) }
  }
  return cached
}

export { projects }
