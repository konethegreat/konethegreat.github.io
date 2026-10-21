/*
 * Written by Kone Tshivhinda & Claude
 *
 * Agentic RAG, as a plain pipeline over the same retrieval engine the hybrid demo uses:
 *
 *   route      is the question about the indexed material at all? If not, stop before spending a retrieval.
 *   decompose  a comparison across named projects becomes one sub-question per project.
 *   retrieve   hybrid search (BM25 + trigram, fused with RRF).
 *   grade      is the evidence strong enough to answer from? (coverage and similarity, see ABSTAIN)
 *   rewrite    if not, add synonyms from a small lexicon and retrieve once more.
 *   answer     extractive and cited, or an honest "not in the material", or a partial answer that says what is missing.
 *
 * The planner here is rule-based so the whole run is deterministic and can be tested. In a production agent a model
 * proposes the route, the split and the rewrite; the grading and the abstain rule stay in code, outside the model.
 */
import type { Project } from "../../data/types"
import {
  ABSTAIN,
  bestSentence,
  expansionTerms,
  extractiveAnswer,
  search,
  tokenize,
  type AnswerLine,
  type Index,
  type SearchResult,
} from "./retrieval"

export type StepKind = "route" | "decompose" | "retrieve" | "grade" | "rewrite" | "answer"

export interface TraceStep {
  kind: StepKind
  /** Short label for the step. */
  title: string
  /** What happened, in one or two plain sentences. */
  detail: string
  /** Optional outcome chip: pass / fail / info. */
  verdict?: "pass" | "fail" | "info"
  /** Sub-question this step belongs to (when the question was decomposed). */
  sub?: number
  /** The retrieval this step performed, when it did one. */
  result?: SearchResult
}

export interface AgenticRun {
  question: string
  steps: TraceStep[]
  lines: AnswerLine[]
  /** Sub-questions the evidence could not support. */
  unsupported: string[]
  outcome: "answered" | "partial" | "declined"
  /** Number of retrieval calls made. */
  retrievals: number
}

export interface NaiveRun {
  result: SearchResult
  line: AnswerLine | null
}

/** Single-pass RAG for comparison: retrieve once and answer from the top passage, whatever its quality. */
export function naiveRun(index: Index, question: string): NaiveRun {
  const result = search(index, question)
  for (const f of result.fused) {
    const c = index.chunks.find((x) => x.id === f.id)
    if (!c || c.kind === "stack") continue
    return { result, line: { text: bestSentence(c.text, result.stems).text || c.text, chunkId: c.id } }
  }
  return { result, line: null }
}

function mentioned(projects: Project[], question: string): Project[] {
  const q = question.toLowerCase()
  const found: { p: Project; at: number; len: number }[] = []
  const taken: [number, number][] = []
  // Longest titles first so "TimeLex v2" is not also read as "TimeLex".
  for (const p of [...projects].sort((a, b) => b.title.length - a.title.length)) {
    const name = p.title.toLowerCase().replace(/\s*\(.*\)$/, "")
    const at = q.search(new RegExp(`(^|[^a-z0-9])${name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}($|[^a-z0-9])`))
    if (at < 0) continue
    const start = at + (q[at] && /[a-z0-9]/.test(q[at]) ? 0 : 1)
    if (taken.some(([s, e]) => start < e && start + name.length > s)) continue
    taken.push([start, start + name.length])
    found.push({ p, at: start, len: name.length })
  }
  return found.sort((a, b) => a.at - b.at).map((f) => f.p)
}

function focus(question: string, keep: Project, all: Project[]): string {
  let q = question
  // The project filter already scopes the search, so every project name is dropped from the query text; otherwise the
  // name alone would "match" the passages and make weak evidence look strong.
  void keep
  for (const other of all) {
    q = q.replace(new RegExp(other.title.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "ig"), " ")
  }
  return q.replace(/\b(compare|and|versus|vs\.?|with|between|both)\b/gi, " ").replace(/\s+/g, " ").trim()
}

const pct = (n: number) => `${Math.round(n * 100)}%`

export function runAgentic(index: Index, projects: Project[], question: string): AgenticRun {
  const steps: TraceStep[] = []
  let retrievals = 0
  const known = tokenize(question).filter((t) => index.df.has(t))

  // 1. Route
  if (known.length === 0) {
    steps.push({
      kind: "route",
      title: "Route",
      verdict: "fail",
      detail: "None of the question's content words appear anywhere in the indexed material, so no retrieval is spent on it.",
    })
    steps.push({ kind: "answer", title: "Answer", verdict: "info", detail: "Declined: this is outside what the index covers." })
    return { question, steps, lines: [], unsupported: [question], outcome: "declined", retrievals }
  }
  steps.push({
    kind: "route",
    title: "Route",
    verdict: "pass",
    detail: `${known.length} content word${known.length === 1 ? "" : "s"} found in the index (${[...new Set(known)].slice(0, 5).join(", ")}). In scope.`,
  })

  // 2. Decompose
  const named = mentioned(projects, question)
  const subs: { text: string; label: string; slug?: string }[] =
    named.length >= 2
      ? named.slice(0, 3).map((p) => ({ text: focus(question, p, named), label: p.title, slug: p.slug }))
      : [{ text: question, label: "" }]
  steps.push({
    kind: "decompose",
    title: "Decompose",
    verdict: "info",
    detail:
      subs.length > 1
        ? `The question names ${subs.length} projects (${subs.map((s) => s.label).join(", ")}), so it is split into ${subs.length} sub-questions, each retrieved on its own.`
        : "One focused question; no need to split it.",
  })

  const lines: AnswerLine[] = []
  const unsupported: string[] = []

  subs.forEach((sub, si) => {
    const tag = subs.length > 1 ? si : undefined
    const prefix = subs.length > 1 ? `${sub.label}: ` : ""
    let text = sub.text
    let result = search(index, text, 60, sub.slug)
    retrievals++
    steps.push({
      kind: "retrieve",
      title: "Retrieve",
      sub: tag,
      result,
      verdict: "info",
      detail: `${prefix}hybrid search${sub.slug ? ` limited to ${sub.label}'s passages` : ""} for “${text.trim()}”. Best passage: ${result.fused[0]?.id ?? "none"}.`,
    })
    let weak = result.abstain
    steps.push({
      kind: "grade",
      title: "Grade",
      sub: tag,
      result,
      verdict: weak ? "fail" : "pass",
      detail: `${prefix}coverage ${pct(result.coverage)}, similarity ${result.similarity.toFixed(2)} (needs coverage ≥ ${pct(ABSTAIN.coverage)} or similarity ≥ ${ABSTAIN.similarity.toFixed(2)}). ${weak ? "Too weak to answer from." : "Enough evidence."}`,
    })

    if (weak) {
      const extra = expansionTerms(text)
      if (extra.length) {
        text = `${text} ${extra.join(" ")}`
        steps.push({
          kind: "rewrite",
          title: "Rewrite",
          sub: tag,
          verdict: "info",
          detail: `${prefix}added related terms from the lexicon: ${extra.join(", ")}. Retrieving once more.`,
        })
        result = search(index, text, 60, sub.slug)
        retrievals++
        weak = result.abstain
        steps.push({
          kind: "retrieve",
          title: "Retrieve again",
          sub: tag,
          result,
          verdict: "info",
          detail: `${prefix}best passage now ${result.fused[0]?.id ?? "none"}.`,
        })
        steps.push({
          kind: "grade",
          title: "Grade again",
          sub: tag,
          result,
          verdict: weak ? "fail" : "pass",
          detail: `${prefix}coverage ${pct(result.coverage)}, similarity ${result.similarity.toFixed(2)}. ${weak ? "Still too weak." : "Enough evidence now."}`,
        })
      }
    }

    if (weak) {
      unsupported.push(sub.label || question)
      return
    }
    const got = extractiveAnswer(index, result, subs.length > 1 ? 1 : 2)
    if (got.length === 0) unsupported.push(sub.label || question)
    lines.push(...got)
  })

  const outcome: AgenticRun["outcome"] = lines.length === 0 ? "declined" : unsupported.length ? "partial" : "answered"
  steps.push({
    kind: "answer",
    title: "Answer",
    verdict: outcome === "answered" ? "pass" : outcome === "partial" ? "info" : "fail",
    detail:
      outcome === "answered"
        ? `${lines.length} cited line${lines.length === 1 ? "" : "s"}, each traceable to a passage.`
        : outcome === "partial"
          ? `Answered what the evidence supports and said plainly what it did not: ${unsupported.join("; ")}.`
          : "Declined: the material does not support an answer, so none is invented.",
  })
  return { question, steps, lines, unsupported, outcome, retrievals }
}
