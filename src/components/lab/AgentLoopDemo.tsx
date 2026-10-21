/* Written by Kone Tshivhinda & Claude */
import { useEffect, useState } from "react"
import { Brain, Eye, OctagonX, Pause, Play, RotateCcw, ShieldCheck, StepForward, UserCheck, Wrench } from "lucide-react"
import { Button } from "@/components/ui/button"
import { agentScenarios, type AgentKind } from "@/data/lab"
import { useFx } from "@/lib/fx"
import { cn } from "@/lib/utils"
import { PanelIntro, panel } from "./shared"

const kindMeta: Record<AgentKind, { icon: typeof Brain; tint: string }> = {
  plan: { icon: Brain, tint: "text-violet-300 border-violet-400/40" },
  act: { icon: Wrench, tint: "text-cyan-300 border-cyan-400/40" },
  observe: { icon: Eye, tint: "text-sky-300 border-sky-400/40" },
  verify: { icon: ShieldCheck, tint: "text-emerald-300 border-emerald-400/40" },
  gate: { icon: UserCheck, tint: "text-pink-300 border-pink-400/40" },
  halt: { icon: OctagonX, tint: "text-rose-300 border-rose-400/40" },
}

const flagStyle = {
  ok: "border-emerald-400/30 bg-emerald-400/10 text-emerald-200",
  warn: "border-amber-300/30 bg-amber-300/10 text-amber-100",
  stop: "border-rose-400/30 bg-rose-400/10 text-rose-100",
} as const

const loopWords = ["Plan", "Act", "Observe", "Verify"]

export function AgentLoopDemo() {
  const { animate } = useFx()
  const [sid, setSid] = useState(agentScenarios[0].id)
  const [shown, setShown] = useState(0)
  const [playing, setPlaying] = useState(false)
  const sc = agentScenarios.find((s) => s.id === sid) ?? agentScenarios[0]

  useEffect(() => {
    if (!playing) return
    if (shown >= sc.steps.length) {
      setPlaying(false)
      return
    }
    const t = window.setTimeout(() => setShown((n) => n + 1), animate ? 1200 : 0)
    return () => window.clearTimeout(t)
  }, [playing, shown, sc, animate])

  const visible = sc.steps.slice(0, shown)
  const used = visible.reduce((n, s) => n + s.tokens, 0)
  const finished = shown >= sc.steps.length
  const pct = Math.min(100, (used / sc.cap) * 100)
  const last = visible[visible.length - 1]

  const choose = (id: string) => {
    setSid(id)
    setShown(0)
    setPlaying(false)
  }
  const reset = () => {
    setShown(0)
    setPlaying(false)
  }

  return (
    <div>
      <PanelIntro kind="scripted" title="The agent loop, with the guardrails that matter">
        An agent is a loop: plan, act with a tool, observe the result, verify it, and go round again. What makes it safe to leave running is
        everything around the loop: untrusted content fenced as data, checks that are deterministic code, a hard budget that stops it, and a
        human gate in front of anything irreversible. This is a scripted trace of that pattern, modelled on the apply copilot in SA-JAS. No
        model is running, and the token counts are illustrative.
      </PanelIntro>

      <div className={panel}>
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex flex-wrap gap-2" role="group" aria-label="Scenario">
            {agentScenarios.map((s) => (
              <button
                key={s.id}
                type="button"
                aria-pressed={sid === s.id}
                onClick={() => choose(s.id)}
                className={cn(
                  "rounded-full border px-3.5 py-1.5 text-sm transition",
                  sid === s.id ? "border-transparent bg-[image:var(--grad)] font-semibold text-[#05060d]" : "border-white/12 bg-white/[0.03] text-slate-300 hover:border-white/30 hover:text-white",
                )}
              >
                {s.label}
              </button>
            ))}
          </div>
          <div className="ml-auto flex gap-2">
            <Button
              size="sm"
              onClick={() => {
                if (finished) setShown(0)
                setPlaying((p) => !p)
              }}
            >
              {playing ? <Pause aria-hidden="true" /> : <Play aria-hidden="true" />} {playing ? "Pause" : finished ? "Replay" : "Play"}
            </Button>
            <Button size="sm" variant="outline" disabled={finished} onClick={() => setShown((n) => Math.min(sc.steps.length, n + 1))}>
              <StepForward aria-hidden="true" /> Step
            </Button>
            <Button size="sm" variant="ghost" onClick={reset} disabled={shown === 0}>
              <RotateCcw aria-hidden="true" /> Reset
            </Button>
          </div>
        </div>
        <p className="mt-3 text-sm text-muted-foreground">
          <span className="font-medium text-slate-200">Goal:</span> {sc.goal}
        </p>
      </div>

      <div className="mt-5 grid grid-cols-1 gap-4 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)]">
        <section aria-label="Agent steps" className={panel}>
          <h4 className="font-mono text-[11px] uppercase tracking-[0.2em] text-cyan-300">Trace</h4>
          {visible.length === 0 ? (
            <p className="mt-4 text-sm text-muted-foreground">Press Play or Step to run it.</p>
          ) : (
            <ol className="mt-4 space-y-3" aria-live="polite">
              {visible.map((s, i) => {
                const { icon: Icon, tint } = kindMeta[s.kind]
                return (
                  <li key={i} className={cn("rounded-xl border bg-white/[0.03] p-3", i === visible.length - 1 && !finished ? "border-cyan-300/50" : "border-white/10")}>
                    <div className="flex items-center gap-2.5">
                      <span className={cn("grid size-7 shrink-0 place-items-center rounded-lg border bg-white/[0.04]", tint)}>
                        <Icon className="size-4" aria-hidden="true" />
                      </span>
                      <span className="text-sm font-semibold">{s.title}</span>
                      {s.tokens > 0 && <span className="ml-auto font-mono text-[11px] text-slate-400">+{s.tokens}</span>}
                    </div>
                    <p className="mt-2 text-[13px] leading-relaxed text-slate-300">{s.detail}</p>
                    {s.flag && <p className={cn("mt-2 rounded-lg border px-2.5 py-1.5 text-xs leading-relaxed", flagStyle[s.flag.tone])}>{s.flag.text}</p>}
                  </li>
                )
              })}
            </ol>
          )}
        </section>

        <div className="space-y-4">
          <section aria-label="Token budget" className={panel}>
            <h4 className="font-mono text-[11px] uppercase tracking-[0.2em] text-amber-200">Budget circuit breaker</h4>
            <div className="mt-4 flex items-baseline justify-between font-mono text-xs text-slate-300">
              <span>{used.toLocaleString("en-ZA")} tokens</span>
              <span className="text-slate-400">cap {sc.cap.toLocaleString("en-ZA")}</span>
            </div>
            <div
              className="mt-2 h-3 overflow-hidden rounded-full bg-white/[0.07]"
              role="progressbar"
              aria-label="Token budget used"
              aria-valuemin={0}
              aria-valuemax={sc.cap}
              aria-valuenow={used}
            >
              <div
                className={cn(
                  "h-full rounded-full transition-[width] duration-700 motion-reduce:transition-none",
                  pct > 90 ? "bg-rose-400" : pct > 70 ? "bg-amber-300" : "bg-cyan-400",
                )}
                style={{ width: `${pct}%` }}
              />
            </div>
            <p className="mt-3 text-xs leading-relaxed text-muted-foreground">
              Every step is charged to a ledger before the next one runs. When the cap would be crossed, the loop stops by itself. SA-JAS keeps a
              usage ledger and a daily budget guard for the same reason.
            </p>
          </section>

          <section aria-label="The loop" className={panel}>
            <h4 className="font-mono text-[11px] uppercase tracking-[0.2em] text-violet-300">The loop</h4>
            <ol className="mt-3 grid grid-cols-2 gap-2 text-center text-xs">
              {loopWords.map((w) => {
                const active = last && w.toLowerCase() === last.kind
                return (
                  <li key={w} className={cn("rounded-lg border px-2 py-2 transition", active ? "border-cyan-300/60 bg-cyan-300/10 text-cyan-100" : "border-white/10 text-slate-400")}>
                    {w}
                  </li>
                )
              })}
            </ol>
            <p className="mt-3 text-xs leading-relaxed text-muted-foreground">
              Verify is code, not the model grading itself. A person or a budget stands at the end of the line, so the loop always terminates.
            </p>
          </section>
        </div>
      </div>
    </div>
  )
}
