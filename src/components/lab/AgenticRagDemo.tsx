/* Written by Kone Tshivhinda & Claude */
import { useEffect, useMemo, useState } from "react"
import { AlertTriangle, CheckCircle2, Compass, GitFork, MessageSquareQuote, RefreshCw, RotateCcw, Scale, SearchCheck, Search, XCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { agenticPresets } from "@/data/lab"
import { useFx } from "@/lib/fx"
import { useProjects } from "@/lib/project-dialog"
import { getLab, projects } from "@/lib/lab/corpus"
import { naiveRun, runAgentic, type StepKind, type TraceStep } from "@/lib/lab/agentic"
import { cn } from "@/lib/utils"
import { PanelIntro, panel } from "./shared"

const kindIcon: Record<StepKind, typeof Compass> = {
  route: Compass,
  decompose: GitFork,
  retrieve: Search,
  grade: Scale,
  rewrite: RefreshCw,
  answer: MessageSquareQuote,
}

const verdictStyle = {
  pass: "border-emerald-400/40 text-emerald-300",
  fail: "border-rose-400/40 text-rose-300",
  info: "border-cyan-300/30 text-cyan-200",
} as const

export function AgenticRagDemo() {
  const { index, byId } = getLab()
  const { openProject } = useProjects()
  const { animate } = useFx()
  const [question, setQuestion] = useState(agenticPresets[0].q)
  const [draft, setDraft] = useState(agenticPresets[0].q)
  const [shown, setShown] = useState(0)
  const [replay, setReplay] = useState(0)

  const run = useMemo(() => runAgentic(index, projects, question), [index, question])
  const naive = useMemo(() => naiveRun(index, question), [index, question])

  // Reveal the trace one step at a time; with reduced motion it all appears at once.
  useEffect(() => {
    if (!animate) {
      setShown(run.steps.length)
      return
    }
    setShown(0)
    const t = window.setInterval(() => {
      setShown((n) => {
        if (n >= run.steps.length) {
          window.clearInterval(t)
          return n
        }
        return n + 1
      })
    }, 650)
    return () => window.clearInterval(t)
  }, [run, animate, replay])

  const done = shown >= run.steps.length
  const ask = (q: string) => {
    setDraft(q)
    setQuestion(q.trim() || question)
  }

  return (
    <div>
      <PanelIntro kind="planner" title="Agentic RAG: retrieve, grade, rewrite, decline">
        Plain RAG retrieves once and answers from whatever came back. An agentic pipeline treats retrieval as a step it can check. It routes the
        question, splits a comparison into parts, grades the evidence, rewrites a weak query and retries, and says so when the material does
        not cover something. The retrieval below is real and the planner is rule-based, so every run is deterministic; in production a model
        proposes the route, the split and the rewrite while the grading stays in code.
      </PanelIntro>

      <div className={panel}>
        <form
          onSubmit={(e) => {
            e.preventDefault()
            ask(draft)
          }}
          className="flex flex-col gap-3 sm:flex-row"
        >
          <label className="relative block flex-1">
            <span className="sr-only">Ask the agentic pipeline a question</span>
            <input
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              className="h-12 w-full rounded-full border border-white/12 bg-white/[0.03] px-5 text-[15px] text-foreground outline-none transition placeholder:text-slate-400 focus:border-cyan-300/60 focus:ring-2 focus:ring-cyan-300/30"
              placeholder="Ask a question, or compare two projects…"
            />
          </label>
          <Button type="submit" className="h-12 rounded-full px-6">
            <SearchCheck aria-hidden="true" /> Run
          </Button>
        </form>
        <ul className="mt-3 grid gap-2 sm:grid-cols-2" aria-label="Example questions">
          {agenticPresets.map((p) => (
            <li key={p.q}>
              <button
                type="button"
                onClick={() => ask(p.q)}
                aria-pressed={question === p.q}
                className={cn(
                  "w-full rounded-xl border px-3.5 py-2.5 text-left transition",
                  question === p.q ? "border-cyan-300/60 bg-cyan-300/10" : "border-white/12 bg-white/[0.03] hover:border-white/30",
                )}
              >
                <span className="block text-sm text-foreground">{p.q}</span>
                <span className="mt-0.5 block text-xs text-muted-foreground">{p.why}</span>
              </button>
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-5 grid grid-cols-1 gap-4 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)]">
        <section aria-label="Pipeline trace" className={panel}>
          <div className="flex items-center justify-between gap-3">
            <h4 className="font-mono text-[11px] uppercase tracking-[0.2em] text-cyan-300">Agent trace</h4>
            <button
              type="button"
              onClick={() => setReplay((n) => n + 1)}
              className="inline-flex items-center gap-1.5 text-xs text-slate-400 transition hover:text-cyan-200"
            >
              <RotateCcw className="size-3.5" aria-hidden="true" /> Replay
            </button>
          </div>
          <ol className="mt-4 space-y-3" aria-live="polite">
            {run.steps.slice(0, shown).map((s, i) => (
              <TraceItem key={`${question}-${i}`} step={s} latest={i === shown - 1 && !done} />
            ))}
          </ol>
          {!done && <p className="mt-3 font-mono text-xs text-slate-400">working…</p>}
        </section>

        <div className="space-y-4">
          <section
            aria-label="Agentic answer"
            className={cn(
              panel,
              done && (run.outcome === "answered" ? "border-emerald-400/30" : run.outcome === "partial" ? "border-amber-300/30" : "border-rose-400/30"),
            )}
          >
            <h4 className="font-mono text-[11px] uppercase tracking-[0.2em] text-emerald-300">Agentic answer</h4>
            {done ? (
              <>
                <p className="mt-1 font-mono text-[11px] text-slate-400">
                  {run.retrievals} retrieval{run.retrievals === 1 ? "" : "s"} · {run.outcome}
                </p>
                <ul className="mt-3 space-y-3">
                  {run.lines.map((l) => {
                    const c = byId.get(l.chunkId)
                    return (
                      <li key={l.chunkId} className="text-[15px] leading-relaxed text-slate-200">
                        {l.text}
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
                  {run.unsupported.length > 0 && (
                    <li className="flex gap-2 text-[15px] leading-relaxed text-amber-100">
                      <AlertTriangle className="mt-1 size-4 shrink-0" aria-hidden="true" />
                      <span>
                        {run.outcome === "declined"
                          ? "The indexed material does not cover this, so there is no answer to give."
                          : `The material has nothing on this for: ${run.unsupported.join(", ")}.`}
                      </span>
                    </li>
                  )}
                </ul>
              </>
            ) : (
              <p className="mt-3 text-sm text-muted-foreground">Waiting for the trace to finish…</p>
            )}
          </section>

          <section aria-label="Single-pass RAG for comparison" className={cn(panel, "border-dashed")}>
            <h4 className="font-mono text-[11px] uppercase tracking-[0.2em] text-slate-300">Plain single-pass RAG, same question</h4>
            <p className="mt-1 font-mono text-[11px] text-slate-400">1 retrieval · no grading · always answers</p>
            {naive.line ? (
              <p className="mt-3 text-[15px] leading-relaxed text-slate-300">
                {naive.line.text}
                <span className="ml-2 font-mono text-[11px] text-slate-400">[{byId.get(naive.line.chunkId)?.title}]</span>
              </p>
            ) : (
              <p className="mt-3 text-sm text-slate-300">Nothing retrieved.</p>
            )}
            {done && run.outcome !== "answered" && (
              <p className="mt-3 flex gap-2 text-xs leading-relaxed text-rose-200">
                <XCircle className="mt-0.5 size-3.5 shrink-0" aria-hidden="true" />
                It would give this answer anyway. It cannot see the gap the agentic run found{run.unsupported.length ? `: ${run.unsupported.join(", ")}` : ""}.
              </p>
            )}
            {done && run.outcome === "answered" && run.retrievals === 1 && (
              <p className="mt-3 flex gap-2 text-xs leading-relaxed text-emerald-200">
                <CheckCircle2 className="mt-0.5 size-3.5 shrink-0" aria-hidden="true" />
                When the first pass is good, both approaches agree. The difference shows up on the hard questions.
              </p>
            )}
          </section>
        </div>
      </div>
    </div>
  )
}

function TraceItem({ step, latest }: { step: TraceStep; latest: boolean }) {
  const { byId } = getLab()
  const Icon = kindIcon[step.kind]
  const top = step.result?.fused.slice(0, 3) ?? []
  return (
    <li
      className={cn(
        "rounded-xl border bg-white/[0.03] p-3 transition-colors",
        latest ? "border-cyan-300/50" : "border-white/10",
      )}
    >
      <div className="flex items-center gap-2.5">
        <span className={cn("grid size-7 shrink-0 place-items-center rounded-lg border bg-white/[0.04]", verdictStyle[step.verdict ?? "info"])}>
          <Icon className="size-4" aria-hidden="true" />
        </span>
        <span className="text-sm font-semibold">{step.title}</span>
        {step.verdict === "pass" && <span className="font-mono text-[10px] uppercase tracking-wider text-emerald-300">pass</span>}
        {step.verdict === "fail" && <span className="font-mono text-[10px] uppercase tracking-wider text-rose-300">fail</span>}
      </div>
      <p className="mt-2 text-[13px] leading-relaxed text-slate-300">{step.detail}</p>
      {step.kind === "retrieve" && top.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-1.5">
          {top.map((f) => (
            <span key={f.id} className="rounded-md border border-white/10 bg-white/[0.04] px-1.5 py-0.5 font-mono text-[10px] text-slate-300">
              {byId.get(f.id)?.title} · {byId.get(f.id)?.kind}
            </span>
          ))}
        </div>
      )}
    </li>
  )
}
