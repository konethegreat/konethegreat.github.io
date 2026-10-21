/* Written by Kone Tshivhinda & Claude */
import { useDeferredValue, useMemo, useState } from "react"
import { Search } from "lucide-react"
import { hybridPresets } from "@/data/lab"
import { useProjects } from "@/lib/project-dialog"
import { getLab } from "@/lib/lab/corpus"
import { ABSTAIN, extractiveAnswer, search, type Scored } from "@/lib/lab/retrieval"
import { cn } from "@/lib/utils"
import { Highlighted, Meter, PanelIntro, panel } from "./shared"

const TOP = 5

export function HybridRagDemo() {
  const { index, byId } = getLab()
  const { openProject } = useProjects()
  const [query, setQuery] = useState(hybridPresets[0])
  const [k, setK] = useState(60)
  const deferred = useDeferredValue(query)

  const result = useMemo(() => search(index, deferred, k), [index, deferred, k])
  const answer = useMemo(() => extractiveAnswer(index, result), [index, result])
  const maxKw = result.bm25[0]?.score ?? 1
  const maxFz = result.fuzzy[0]?.score ?? 1

  return (
    <div>
      <PanelIntro kind="real" title="Hybrid RAG, on my own portfolio">
        Ask anything about my projects. Two retrievers search {index.chunks.length} passages from the project data in this page: BM25 for exact
        words and character trigrams for fuzzy matches. Reciprocal Rank Fusion merges their rankings, and if the evidence is weak the system
        says so instead of guessing. In production the fuzzy half is a vector search; the fusion and the abstain rule stay the same.
      </PanelIntro>

      <div className={panel}>
        <label className="block">
          <span className="sr-only">Ask a question about the projects</span>
          <span className="relative block">
            <Search className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-slate-400" aria-hidden="true" />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Ask about agents, RAG, MCP, local models…"
              className="h-12 w-full rounded-full border border-white/12 bg-white/[0.03] pl-11 pr-4 text-[15px] text-foreground outline-none transition placeholder:text-slate-400 focus:border-cyan-300/60 focus:ring-2 focus:ring-cyan-300/30"
            />
          </span>
        </label>
        <div className="mt-3 flex flex-wrap gap-2" role="group" aria-label="Example questions">
          {hybridPresets.map((p) => (
            <button
              key={p}
              type="button"
              onClick={() => setQuery(p)}
              aria-pressed={query === p}
              className={cn(
                "rounded-full border px-3 py-1.5 text-xs transition",
                query === p ? "border-cyan-300/60 bg-cyan-300/10 text-cyan-100" : "border-white/12 bg-white/[0.03] text-slate-300 hover:border-white/30 hover:text-white",
              )}
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-5 grid grid-cols-1 items-start gap-4 lg:grid-cols-3">
        <RankedList title="1 · BM25 (words)" note="Rare words count for more" items={result.bm25.slice(0, TOP)} max={maxKw} stems={result.stems} tone="cyan" />
        <RankedList title="2 · Trigrams (fuzzy)" note="Survives typos and word forms" items={result.fuzzy.slice(0, TOP)} max={maxFz} stems={result.stems} tone="violet" />
        <section aria-label="Fused ranking" className={cn(panel, "border-cyan-300/25")}>
          <h4 className="font-mono text-[11px] uppercase tracking-[0.2em] text-cyan-300">3 · Fused (RRF)</h4>
          <p className="mt-1 text-xs text-muted-foreground">
            score = Σ 1 / (k + rank)
          </p>
          <ol className="mt-3 space-y-3">
            {result.fused.slice(0, TOP).map((f, i) => {
              const c = byId.get(f.id)
              if (!c) return null
              const terms = f.ranks.flatMap((r) => (r ? [`1/(${k}+${r})`] : []))
              return (
                <li key={f.id} className="rounded-xl border border-white/10 bg-white/[0.03] p-3">
                  <div className="flex items-center gap-2">
                    <span className="grid size-6 shrink-0 place-items-center rounded-full bg-[image:var(--grad)] font-mono text-[11px] font-bold text-[#05060d]">{i + 1}</span>
                    <span className="min-w-0 flex-1 truncate text-sm font-medium">{c.title}</span>
                    <span className="font-mono text-[11px] text-cyan-200">{f.score.toFixed(4)}</span>
                  </div>
                  <p className="mt-1.5 line-clamp-2 text-xs leading-relaxed text-muted-foreground">
                    <Highlighted text={c.text} stems={result.stems} />
                  </p>
                  <p className="mt-1.5 font-mono text-[10px] text-slate-400">
                    {terms.join(" + ")}
                    {f.ranks.filter(Boolean).length === 2 && <span className="ml-1.5 text-emerald-300">· found by both</span>}
                  </p>
                </li>
              )
            })}
            {result.fused.length === 0 && <li className="text-sm text-muted-foreground">Nothing matched at all.</li>}
          </ol>
        </section>
      </div>

      <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
        <section aria-label="Evidence check" className={panel}>
          <h4 className="font-mono text-[11px] uppercase tracking-[0.2em] text-amber-200">Is there enough evidence?</h4>
          <div className="mt-4 space-y-4">
            <Meter label="Query words found in the best passages" value={result.coverage} threshold={ABSTAIN.coverage} display={`${Math.round(result.coverage * 100)}%`} />
            <Meter label="Best trigram similarity" value={result.similarity} threshold={ABSTAIN.similarity} display={result.similarity.toFixed(2)} tone="violet" />
          </div>
          <p className="mt-4 text-xs leading-relaxed text-muted-foreground">
            The amber ticks are the abstain rule: if both bars stay left of their tick, nothing in the index supports the question and no
            answer is given. The thresholds were tuned on this corpus and are not universal.
          </p>
          <div className="mt-4">
            <label className="flex items-center justify-between gap-3 text-xs text-slate-300">
              <span>Fusion constant k</span>
              <span className="font-mono text-slate-400">{k}</span>
            </label>
            <input
              type="range"
              min={5}
              max={100}
              step={5}
              value={k}
              onChange={(e) => setK(Number(e.target.value))}
              aria-label="Reciprocal Rank Fusion constant k"
              className="mt-1 h-2 w-full cursor-pointer accent-cyan-400"
            />
            <p className="mt-1 text-[11px] text-slate-400">A small k lets the top ranks dominate. A large k treats the lists more equally.</p>
          </div>
        </section>

        <section aria-label="Answer" aria-live="polite" className={cn(panel, result.abstain ? "border-amber-300/30" : "border-emerald-400/25")}>
          <h4 className={cn("font-mono text-[11px] uppercase tracking-[0.2em]", result.abstain ? "text-amber-200" : "text-emerald-300")}>
            {result.abstain ? "Abstained" : "Cited answer"}
          </h4>
          {result.abstain ? (
            <p className="mt-3 text-[15px] leading-relaxed text-slate-200">
              That is not in the material I indexed, so I will not guess. A system that always answers would have picked the closest-looking
              passage and made up the rest.
            </p>
          ) : (
            <ul className="mt-3 space-y-3">
              {answer.map((l) => {
                const c = byId.get(l.chunkId)
                return (
                  <li key={l.chunkId} className="text-[15px] leading-relaxed text-slate-200">
                    <Highlighted text={l.text} stems={result.stems} />
                    {c && (
                      <button
                        type="button"
                        onClick={() => openProject(c.slug)}
                        className="ml-2 inline-flex items-center rounded-md border border-cyan-300/30 bg-cyan-300/10 px-1.5 py-0.5 align-middle font-mono text-[11px] text-cyan-100 transition hover:bg-cyan-300/20"
                      >
                        [{c.title}]<span className="sr-only"> open project</span>
                      </button>
                    )}
                  </li>
                )
              })}
            </ul>
          )}
          <p className="mt-4 text-[11px] leading-relaxed text-slate-400">
            This answer is extractive: each line is a sentence lifted from a passage, so nothing can be invented. A generative system phrases it
            more fluently and then checks every claim against the same citations.
          </p>
        </section>
      </div>
    </div>
  )
}

function RankedList({
  title,
  note,
  items,
  max,
  stems,
  tone,
}: {
  title: string
  note: string
  items: Scored[]
  max: number
  stems: string[]
  tone: "cyan" | "violet"
}) {
  const { byId } = getLab()
  return (
    <section aria-label={title} className={panel}>
      <h4 className={cn("font-mono text-[11px] uppercase tracking-[0.2em]", tone === "cyan" ? "text-cyan-300" : "text-violet-300")}>{title}</h4>
      <p className="mt-1 text-xs text-muted-foreground">{note}</p>
      <ol className="mt-3 space-y-3">
        {items.map((s, i) => {
          const c = byId.get(s.id)
          if (!c) return null
          return (
            <li key={s.id}>
              <div className="flex items-center gap-2 text-sm">
                <span className="w-4 shrink-0 font-mono text-[11px] text-slate-400">{i + 1}</span>
                <span className="min-w-0 flex-1 truncate font-medium">{c.title}</span>
                <span className="font-mono text-[11px] text-slate-400">{s.score.toFixed(2)}</span>
              </div>
              <div className="ml-6 mt-1 h-1.5 rounded-full bg-white/[0.07]">
                <div
                  className={cn("h-full rounded-full transition-[width] duration-500 motion-reduce:transition-none", tone === "cyan" ? "bg-cyan-400" : "bg-violet-400")}
                  style={{ width: `${Math.max(3, (s.score / max) * 100)}%` }}
                />
              </div>
              <p className="ml-6 mt-1 line-clamp-1 text-[11px] text-slate-400">
                <Highlighted text={c.text} stems={stems} />
              </p>
            </li>
          )
        })}
        {items.length === 0 && <li className="text-sm text-muted-foreground">No matches.</li>}
      </ol>
    </section>
  )
}
