/*
 * Written by Kone Tshivhinda & Claude
 *
 * A small, honest retrieval engine that runs entirely in the browser: no model download, no network.
 *
 *   keyword retriever   BM25 over stemmed words
 *   fuzzy retriever     cosine similarity over character trigrams (stands in for a dense embedding here)
 *   fusion              Reciprocal Rank Fusion, score(d) = sum over lists of 1 / (k + rank)
 *   guardrail           abstain instead of answering when nothing in the index supports the question
 *
 * In a production system the fuzzy slot is a real embedding search (pgvector) and the keyword slot is
 * Postgres full text search; the fusion maths and the abstain rule are exactly the same.
 */
import type { Project } from "../../data/types"

/* ------------------------------------------------------------------ corpus */

export interface Chunk {
  id: string
  slug: string
  title: string
  kind: "pitch" | "highlight" | "note" | "stack"
  /** The passage as shown to a reader and cited. */
  text: string
  /** What is indexed: the passage with its project's name and category in front, so a passage never loses its context. */
  ctx: string
}

/** Every project becomes a handful of citable passages: its pitch, each highlight, a stack line and its candid note. */
export function buildCorpus(projects: Project[]): Chunk[] {
  const chunks: Chunk[] = []
  for (const p of projects) {
    const add = (suffix: string, kind: Chunk["kind"], text: string) =>
      chunks.push({ id: `${p.slug}#${suffix}`, slug: p.slug, title: p.title, kind, text, ctx: `${p.title}. ${p.kicker}. ${text}` })
    add("pitch", "pitch", p.pitch)
    p.highlights.forEach((h, i) => add(`h${i + 1}`, "highlight", h))
    add("stack", "stack", `Built with ${p.stack.join(", ")}. Topics: ${p.tags.join(", ")}.`)
    // Short boilerplate notes ("Local project; not published") would only add noise to retrieval.
    if (p.note && p.note.length >= 60) add("note", "note", p.note)
  }
  return chunks
}

/* ------------------------------------------------------------- text helpers */

const STOP = new Set(
  `a about above after again all also am an and any are as at be because been before being below between both but by can could did do does doing
   down during each few for from further had has have having he her here hers him his how i if in into is it its itself just me more most my no nor not
   of off on once only or other our out over own same she should so some such than that the their them then there these they this those through to too
   under until up very was we were what when where which while who whom why will with would you your tell show give find use used using want need get project projects call calls lets let built build work works did you each both keep`.split(
    /\s+/,
  ),
)

/** Light stemmer: enough to match "agents" with "agent" and "tailors" with "tailor", nothing clever. */
export function stem(word: string): string {
  let w = word
  if (w.length > 4 && w.endsWith("ies")) return w.slice(0, -3) + "y"
  if (w.length > 5 && w.endsWith("ing")) w = w.slice(0, -3)
  else if (w.length > 4 && w.endsWith("ed")) w = w.slice(0, -2)
  else if (w.length > 4 && w.endsWith("es")) w = w.slice(0, -2)
  else if (w.length > 3 && w.endsWith("s") && !w.endsWith("ss")) w = w.slice(0, -1)
  return w
}

export function tokenize(text: string): string[] {
  return (text.toLowerCase().match(/[a-z0-9]+/g) ?? []).filter((t) => !STOP.has(t)).map(stem)
}

function trigrams(text: string): Map<string, number> {
  const norm = ` ${text.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim()} `
  const grams = new Map<string, number>()
  for (let i = 0; i + 3 <= norm.length; i++) {
    const g = norm.slice(i, i + 3)
    grams.set(g, (grams.get(g) ?? 0) + 1)
  }
  return grams
}

/* ------------------------------------------------------------------- index */

export interface Index {
  chunks: Chunk[]
  tokens: string[][]
  df: Map<string, number>
  avgLen: number
  gramIdf: Map<string, number>
  gramVec: Map<string, number>[]
  gramNorm: number[]
}

export function createIndex(chunks: Chunk[]): Index {
  const tokens = chunks.map((c) => tokenize(c.ctx))
  const df = new Map<string, number>()
  for (const toks of tokens) for (const t of new Set(toks)) df.set(t, (df.get(t) ?? 0) + 1)
  const avgLen = tokens.reduce((s, t) => s + t.length, 0) / Math.max(1, tokens.length)

  const rawGrams = chunks.map((c) => trigrams(c.ctx))
  const gramDf = new Map<string, number>()
  for (const g of rawGrams) for (const k of g.keys()) gramDf.set(k, (gramDf.get(k) ?? 0) + 1)
  const n = chunks.length
  const gramIdf = new Map<string, number>()
  for (const [k, d] of gramDf) gramIdf.set(k, Math.log(1 + n / d))

  const gramVec = rawGrams.map((g) => {
    const v = new Map<string, number>()
    for (const [k, tf] of g) v.set(k, Math.sqrt(tf) * (gramIdf.get(k) ?? 0))
    return v
  })
  const gramNorm = gramVec.map((v) => Math.sqrt([...v.values()].reduce((s, x) => s + x * x, 0)))
  return { chunks, tokens, df, avgLen, gramIdf, gramVec, gramNorm }
}

/* ---------------------------------------------------------------- retrievers */

export interface Scored {
  id: string
  score: number
}

const K1 = 1.4
const B = 0.75

export function bm25(index: Index, query: string): Scored[] {
  const q = [...new Set(tokenize(query))]
  const N = index.chunks.length
  const out: Scored[] = []
  index.chunks.forEach((chunk, i) => {
    const toks = index.tokens[i]
    const len = toks.length
    let score = 0
    for (const term of q) {
      const df = index.df.get(term)
      if (!df) continue
      const tf = toks.reduce((c, t) => (t === term ? c + 1 : c), 0)
      if (!tf) continue
      const idf = Math.log(1 + (N - df + 0.5) / (df + 0.5))
      score += (idf * (tf * (K1 + 1))) / (tf + K1 * (1 - B + (B * len) / index.avgLen))
    }
    if (score > 0) out.push({ id: chunk.id, score })
  })
  return out.sort((a, b) => b.score - a.score)
}

export function fuzzy(index: Index, query: string): Scored[] {
  const qg = trigrams(query)
  const qv = new Map<string, number>()
  for (const [k, tf] of qg) {
    const idf = index.gramIdf.get(k)
    if (idf) qv.set(k, Math.sqrt(tf) * idf)
  }
  const qn = Math.sqrt([...qv.values()].reduce((s, x) => s + x * x, 0))
  if (!qn) return []
  const out: Scored[] = []
  index.chunks.forEach((chunk, i) => {
    let dot = 0
    for (const [k, w] of qv) dot += w * (index.gramVec[i].get(k) ?? 0)
    const sim = dot / (qn * (index.gramNorm[i] || 1))
    if (sim > 0) out.push({ id: chunk.id, score: sim })
  })
  return out.sort((a, b) => b.score - a.score)
}

/* ------------------------------------------------------------------- fusion */

export interface Fused {
  id: string
  score: number
  /** 1-based rank in each input list, or null when the passage was not retrieved by that list. */
  ranks: (number | null)[]
}

/** Reciprocal Rank Fusion: no score normalisation needed, only ranks. */
export function rrf(lists: Scored[][], k = 60, depth = 20): Fused[] {
  const table = new Map<string, Fused>()
  lists.forEach((list, li) => {
    list.slice(0, depth).forEach((item, rank) => {
      const row = table.get(item.id) ?? { id: item.id, score: 0, ranks: lists.map(() => null) }
      row.score += 1 / (k + rank + 1)
      row.ranks[li] = rank + 1
      table.set(item.id, row)
    })
  })
  return [...table.values()].sort((a, b) => b.score - a.score)
}

/* ------------------------------------------------------------ query rewriting */

/**
 * A small domain lexicon the agentic pipeline uses when its first retrieval is graded as too weak.
 * Plain synonyms, written by hand from the vocabulary of the indexed material. A production system would ask a
 * model to rewrite the query (and could still be checked against a lexicon like this one).
 */
const LEXICON: Record<string, string[]> = {
  cap: ["budget", "limit", "guard", "ledger"],
  spend: ["cost", "budget", "ledger", "usage"],
  cost: ["budget", "ledger", "usage", "spend"],
  llm: ["model", "claude", "ai"],
  approval: ["sign-off", "approve", "validation", "review"],
  approve: ["approval", "sign-off", "validation", "review"],
  submit: ["application", "approve", "sign-off"],
  human: ["person", "user", "analyst", "review", "approval"],
  control: ["approval", "gate", "guard", "submit", "never"],
  safe: ["guard", "never", "validation", "approval"],
  safety: ["guard", "never", "validation", "approval"],
  private: ["local", "sovereign", "popia"],
  privacy: ["local", "sovereign", "popia"],
  offline: ["local", "ollama", "on-device"],
  sovereign: ["local", "ollama", "popia"],
  agent: ["mcp", "autonomous", "tool"],
  tool: ["mcp", "agent"],
  invoice: ["invoicing", "billing", "vat"],
  bill: ["invoicing", "billing", "time"],
  law: ["legal", "lawyers", "firm"],
  legal: ["lawyers", "timelex", "popia"],
  test: ["tests", "ci", "verified"],
  testing: ["tests", "ci", "verified"],
  search: ["retrieval", "rag", "embeddings"],
  retrieval: ["rag", "embeddings", "search"],
  document: ["report", "generator", "docx"],
}

/** Returns the extra terms the lexicon contributes to a query (empty when it knows nothing about it). */
export function expansionTerms(query: string): string[] {
  const have = new Set(tokenize(query))
  const extra = new Set<string>()
  for (const raw of query.toLowerCase().match(/[a-z0-9-]+/g) ?? []) {
    for (const syn of LEXICON[raw] ?? LEXICON[stem(raw)] ?? []) if (!have.has(stem(syn))) extra.add(syn)
  }
  return [...extra]
}

/* ---------------------------------------------------------------- the search */

export interface SearchResult {
  query: string
  stems: string[]
  bm25: Scored[]
  fuzzy: Scored[]
  fused: Fused[]
  /** Share (idf weighted) of the query's content words found in the best passage, 0 to 1. */
  coverage: number
  /** Best trigram similarity, 0 to 1. */
  similarity: number
  /** True when nothing in the index supports the question: the system says so instead of guessing. */
  abstain: boolean
}

/** Below both of these the question is treated as outside the indexed material. Tuned on the portfolio's own corpus. */
export const ABSTAIN = { coverage: 0.34, similarity: 0.3 } as const

/**
 * Hybrid search. With `slug` the ranked lists are limited to one project's passages (a metadata filter), while the
 * statistics (document frequency, idf) still come from the whole corpus, as they would in a real vector store.
 */
export function search(index: Index, query: string, k = 60, slug?: string): SearchResult {
  const stems = [...new Set(tokenize(query))]
  const only = (list: Scored[]) => (slug ? list.filter((s) => s.id.startsWith(`${slug}#`)) : list)
  const kw = only(bm25(index, query))
  const fz = only(fuzzy(index, query))
  const fused = rrf([kw, fz], k)

  let coverage = 0
  if (stems.length && fused.length) {
    const N = index.chunks.length
    const idfOf = (t: string) => {
      const df = index.df.get(t) ?? 0
      return df ? Math.log(1 + (N - df + 0.5) / (df + 0.5)) : Math.log(1 + N)
    }
    const total = stems.reduce((s, t) => s + idfOf(t), 0)
    // best coverage over the top few fused passages, so one strong passage is enough
    for (const f of fused.slice(0, 3)) {
      const i = index.chunks.findIndex((c) => c.id === f.id)
      const have = new Set(index.tokens[i])
      const got = stems.reduce((s, t) => (have.has(t) ? s + idfOf(t) : s), 0)
      coverage = Math.max(coverage, got / total)
    }
  }
  const similarity = fz[0]?.score ?? 0
  const abstain = stems.length === 0 || fused.length === 0 || (coverage < ABSTAIN.coverage && similarity < ABSTAIN.similarity)
  return { query, stems, bm25: kw, fuzzy: fz, fused, coverage, similarity, abstain }
}

/* ---------------------------------------------------------- answer + display */

export interface AnswerLine {
  text: string
  chunkId: string
}

function sentences(text: string): string[] {
  return text.split(/(?<=[.!?])\s+/).map((x) => x.trim()).filter(Boolean)
}

/** The sentence of a passage that shares the most query words, and how many it shares. */
export function bestSentence(text: string, stems: string[]): { text: string; hits: number } {
  let best = ""
  let hits = -1
  for (const s of sentences(text)) {
    const have = new Set(tokenize(s))
    const n = stems.reduce((c, t) => (have.has(t) ? c + 1 : c), 0)
    if (n > hits) {
      best = s
      hits = n
    }
  }
  return { text: best, hits: Math.max(0, hits) }
}

/**
 * An extractive answer: the best-matching sentence from each of the top passages, each one carrying its citation.
 * No model writes anything here, so nothing can be invented. A generative system would phrase this more fluently
 * and then check every claim against the same citations.
 */
export function extractiveAnswer(index: Index, result: SearchResult, max = 2): AnswerLine[] {
  if (result.abstain) return []
  const lines: AnswerLine[] = []
  const seenSlugs = new Set<string>()
  let topHits = 0
  for (const f of result.fused) {
    if (lines.length >= max) break
    const chunk = index.chunks.find((c) => c.id === f.id)
    if (!chunk || chunk.kind === "stack" || seenSlugs.has(chunk.slug)) continue
    const { text, hits } = bestSentence(chunk.text, result.stems)
    // Later lines must be about as relevant as the first, or they are left out.
    if (!text || hits === 0 || (lines.length > 0 && hits < Math.max(1, topHits * 0.6))) continue
    if (lines.length === 0) topHits = hits
    lines.push({ text, chunkId: chunk.id })
    seenSlugs.add(chunk.slug)
  }
  return lines
}

/** Split text into runs, marking the words that match the query so the UI can highlight what was found. */
export function highlight(text: string, stems: string[]): { text: string; hit: boolean }[] {
  if (!stems.length) return [{ text, hit: false }]
  const set = new Set(stems)
  const parts = text.split(/([A-Za-z0-9]+)/)
  return parts.filter((p) => p !== "").map((p) => ({ text: p, hit: /^[A-Za-z0-9]+$/.test(p) && set.has(stem(p.toLowerCase())) }))
}
