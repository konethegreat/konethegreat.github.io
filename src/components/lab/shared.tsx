/* Written by Kone Tshivhinda & Claude */
import type { ReactNode } from "react"
import { Badge } from "@/components/ui/badge"
import { highlight } from "@/lib/lab/retrieval"
import { cn } from "@/lib/utils"

const honesty = {
  real: { variant: "live" as const, label: "Real · runs in your browser" },
  planner: { variant: "code" as const, label: "Real retrieval · rule-based planner" },
  scripted: { variant: "wip" as const, label: "Scripted trace · no model running" },
  model: { variant: "private" as const, label: "Interactive model of a proposed design" },
}

export function Honesty({ kind }: { kind: keyof typeof honesty }) {
  const h = honesty[kind]
  return (
    <Badge variant={h.variant} className="font-mono text-[11px] font-medium uppercase tracking-wider">
      {h.label}
    </Badge>
  )
}

export function PanelIntro({ kind, title, children }: { kind: keyof typeof honesty; title: string; children: ReactNode }) {
  return (
    <div className="mb-6 max-w-3xl">
      <div className="flex flex-wrap items-center gap-3">
        <h3 className="font-display text-2xl font-semibold tracking-tight sm:text-3xl">{title}</h3>
        <Honesty kind={kind} />
      </div>
      <p className="mt-3 text-[15px] leading-relaxed text-muted-foreground">{children}</p>
    </div>
  )
}

/** Text with the words that matched the query picked out. */
export function Highlighted({ text, stems, className }: { text: string; stems: string[]; className?: string }) {
  return (
    <span className={className}>
      {highlight(text, stems).map((part, i) =>
        part.hit ? (
          <mark key={i} className="rounded bg-cyan-300/15 px-0.5 text-cyan-100">
            {part.text}
          </mark>
        ) : (
          <span key={i}>{part.text}</span>
        ),
      )}
    </span>
  )
}

export function Meter({
  label,
  value,
  threshold,
  display,
  tone = "cyan",
}: {
  label: string
  /** 0 to 1 */
  value: number
  /** 0 to 1: where the bar of the abstain rule sits */
  threshold?: number
  display: string
  tone?: "cyan" | "violet"
}) {
  return (
    <div>
      <div className="flex items-baseline justify-between gap-3 text-xs">
        <span className="text-slate-300">{label}</span>
        <span className="font-mono text-slate-400">{display}</span>
      </div>
      <div
        className="relative mt-1.5 h-2 rounded-full bg-white/[0.07]"
        role="meter"
        aria-label={label}
        aria-valuemin={0}
        aria-valuemax={1}
        aria-valuenow={Number(value.toFixed(2))}
        aria-valuetext={display}
      >
        <div
          className={cn(
            "h-full rounded-full transition-[width] duration-500 motion-reduce:transition-none",
            tone === "cyan" ? "bg-cyan-400" : "bg-violet-400",
          )}
          style={{ width: `${Math.max(2, Math.min(100, value * 100))}%` }}
        />
        {threshold !== undefined && (
          <span
            aria-hidden="true"
            className="absolute -top-1 h-4 w-0.5 rounded bg-amber-300"
            style={{ left: `${threshold * 100}%` }}
            title={`Abstain rule: ${Math.round(threshold * 100)}%`}
          />
        )}
      </div>
    </div>
  )
}

export const panel = "rounded-2xl border border-white/10 bg-white/[0.03] p-4 sm:p-5"
