/* Written by Kone Tshivhinda & Claude */
import { useMemo, useState } from "react"
import { CheckCircle2, CircleDashed, Eye, Lightbulb, ListChecks, Octagon, ShieldAlert } from "lucide-react"
import { draftEntries, neverAutonomous, rungs } from "@/data/lab"
import { cn } from "@/lib/utils"
import { PanelIntro, panel } from "./shared"

type Outcome = { label: string; tone: "post" | "queue" | "draft" | "suggest" | "none"; why?: string }

export function AutonomyLadder() {
  const [rung, setRung] = useState(3)
  const [threshold, setThreshold] = useState(0.9)
  const [kill, setKill] = useState(false)
  const [auditFailed, setAuditFailed] = useState(false)

  let effective = rung
  if (auditFailed) effective = Math.max(0, effective - 1)
  if (kill) effective = Math.min(effective, 1)
  const note =
    effective !== rung
      ? kill && effective === 1
        ? `Kill switch: dropped to L1 immediately.`
        : `Demoted from L${rung} to L${effective}${auditFailed ? " after a failed audit sample" : ""}.`
      : null

  const outcomes = useMemo<Outcome[]>(
    () =>
      draftEntries.map((e) => {
        if (effective === 0) return { label: "Captured only", tone: "none" }
        if (effective === 1) return { label: "Suggested", tone: "suggest" }
        if (effective === 2) return { label: "Drafted · awaiting approval", tone: "draft" }
        if (!e.checks) return { label: "Review queue", tone: "queue", why: e.reason }
        if (e.confidence < threshold) return { label: "Review queue", tone: "queue", why: `Confidence ${e.confidence.toFixed(2)} is below ${threshold.toFixed(2)}` }
        return { label: "Auto-posted", tone: "post" }
      }),
    [effective, threshold],
  )
  const posted = outcomes.filter((o) => o.tone === "post").length
  const queued = outcomes.filter((o) => o.tone === "queue").length
  const current = rungs[effective]

  return (
    <div>
      <PanelIntro kind="model" title="Autonomy as a ladder, not a switch">
        &ldquo;Fully autonomous&rdquo; is not one setting. In the TimeLex design (ADR-0005), autonomy is a per-tenant policy on five rungs, and a
        draft posts by itself only when its confidence clears a calibrated threshold, the deterministic checks pass, policy allows it and
        recent audited precision is above a floor. This is an interactive model of that proposed design. The ladder is not built yet, the
        thresholds are proposals still to be calibrated, and the ten entries are invented.
      </PanelIntro>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
        <section aria-label="Controls" className={panel}>
          <h4 className="font-mono text-[11px] uppercase tracking-[0.2em] text-violet-300">Policy</h4>
          <div className="mt-4 space-y-2" role="radiogroup" aria-label="Autonomy rung">
            {[...rungs].reverse().map((r) => (
              <button
                key={r.level}
                type="button"
                role="radio"
                aria-checked={rung === r.level}
                onClick={() => setRung(r.level)}
                className={cn(
                  "flex w-full items-start gap-3 rounded-xl border px-3.5 py-2.5 text-left transition",
                  rung === r.level ? "border-cyan-300/60 bg-cyan-300/10" : "border-white/10 bg-white/[0.02] hover:border-white/30",
                  effective === r.level && rung !== r.level && "border-amber-300/50",
                )}
              >
                <span className="mt-0.5 grid size-7 shrink-0 place-items-center rounded-lg bg-white/[0.06] font-mono text-xs font-bold">L{r.level}</span>
                <span className="min-w-0">
                  <span className="block text-sm font-semibold">{r.name}</span>
                  <span className="mt-0.5 block text-xs leading-relaxed text-muted-foreground">{r.behaviour}</span>
                </span>
              </button>
            ))}
          </div>

          <div className="mt-5">
            <label className="flex items-center justify-between gap-3 text-xs text-slate-300">
              <span>Confidence threshold (proposed, uncalibrated)</span>
              <span className="font-mono text-slate-400">{threshold.toFixed(2)}</span>
            </label>
            <input
              type="range"
              min={0.8}
              max={0.99}
              step={0.01}
              value={threshold}
              onChange={(e) => setThreshold(Number(e.target.value))}
              aria-label="Confidence threshold"
              className="mt-1 h-2 w-full cursor-pointer accent-cyan-400"
            />
          </div>

          <div className="mt-4 space-y-2">
            <Check label="A sampled audit fails" hint="Earned trust is lost: demoted one rung." checked={auditFailed} onChange={setAuditFailed} />
            <Check label="Kill switch" hint="Drops to L1 immediately." checked={kill} onChange={setKill} />
          </div>
        </section>

        <section aria-label="Outcome" className={panel} aria-live="polite">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h4 className="font-mono text-[11px] uppercase tracking-[0.2em] text-cyan-300">
              Effective rung · L{effective} {current.name}
            </h4>
            <p className="font-mono text-xs text-slate-400">
              {posted} auto-posted · {queued} for review
            </p>
          </div>
          {note && <p className="mt-2 rounded-lg border border-amber-300/30 bg-amber-300/10 px-3 py-1.5 text-xs text-amber-100">{note}</p>}
          <ul className="mt-4 divide-y divide-white/[0.06]">
            {draftEntries.map((e, i) => {
              const o = outcomes[i]
              return (
                <li key={e.id} className="flex items-start gap-3 py-2.5">
                  <OutcomeIcon tone={o.tone} />
                  <div className="min-w-0 flex-1">
                    <p className="text-sm leading-snug">{e.text}</p>
                    <p className="mt-0.5 font-mono text-[11px] text-slate-400">
                      confidence {e.confidence.toFixed(2)}
                      {!e.checks && <span className="ml-2 text-rose-300">check failed</span>}
                    </p>
                  </div>
                  <div className="shrink-0 text-right">
                    <p
                      className={cn(
                        "text-xs font-medium",
                        o.tone === "post" ? "text-emerald-300" : o.tone === "queue" ? "text-amber-200" : "text-slate-300",
                      )}
                    >
                      {o.label}
                    </p>
                    {o.why && <p className="mt-0.5 max-w-[11rem] text-[11px] leading-snug text-slate-400">{o.why}</p>}
                  </div>
                </li>
              )
            })}
          </ul>
          {effective === 4 && (
            <p className="mt-3 rounded-lg border border-pink-400/30 bg-pink-400/10 px-3 py-2 text-xs leading-relaxed text-pink-100">
              L4 also assembles the pro-forma from the {posted} posted entries. A person or partner still certifies it before it goes anywhere.
            </p>
          )}
        </section>
      </div>

      <section aria-label="Never autonomous" className={cn(panel, "mt-4 border-rose-400/25")}>
        <h4 className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.2em] text-rose-300">
          <ShieldAlert className="size-4" aria-hidden="true" /> Outside the ladder, hard-coded
        </h4>
        <p className="mt-2 text-sm text-muted-foreground">There is no L5. These are never autonomous at any rung, and are not configurable:</p>
        <ul className="mt-3 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {neverAutonomous.map((n) => (
            <li key={n} className="flex gap-2 rounded-lg border border-white/10 bg-white/[0.02] px-3 py-2 text-xs leading-relaxed text-slate-300">
              <Octagon className="mt-0.5 size-3.5 shrink-0 text-rose-300" aria-hidden="true" />
              {n}
            </li>
          ))}
        </ul>
        <p className="mt-3 text-xs text-slate-400">Source: ADR-0005 and AUTONOMY.md in the TimeLex repository.</p>
      </section>
    </div>
  )
}

function Check({ label, hint, checked, onChange }: { label: string; hint: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-white/10 bg-white/[0.02] px-3.5 py-2.5 transition hover:border-white/30">
      <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} className="mt-1 size-4 accent-cyan-400" />
      <span>
        <span className="block text-sm font-medium">{label}</span>
        <span className="block text-xs text-muted-foreground">{hint}</span>
      </span>
    </label>
  )
}

function OutcomeIcon({ tone }: { tone: Outcome["tone"] }) {
  const cls = "mt-0.5 size-4 shrink-0"
  if (tone === "post") return <CheckCircle2 className={cn(cls, "text-emerald-300")} aria-hidden="true" />
  if (tone === "queue") return <ListChecks className={cn(cls, "text-amber-200")} aria-hidden="true" />
  if (tone === "draft") return <CircleDashed className={cn(cls, "text-slate-300")} aria-hidden="true" />
  if (tone === "suggest") return <Lightbulb className={cn(cls, "text-slate-300")} aria-hidden="true" />
  return <Eye className={cn(cls, "text-slate-400")} aria-hidden="true" />
}
