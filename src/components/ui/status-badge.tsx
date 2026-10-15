import { Badge } from "@/components/ui/badge"
import type { Project } from "@/data/types"
import { cn } from "@/lib/utils"

const toneVariant = {
  live: "live",
  code: "code",
  wip: "wip",
  private: "private",
  muted: "muted",
} as const

const dotColor = {
  live: "bg-emerald-400",
  code: "bg-cyan-400",
  wip: "bg-amber-300",
  private: "bg-violet-400",
  muted: "bg-slate-400",
} as const

/** Honest status chip: Live, Public source, In development, Private, Coursework… */
export function StatusBadge({ status, className }: { status: Project["status"]; className?: string }) {
  return (
    <Badge variant={toneVariant[status.tone]} className={cn("font-mono text-[11px] font-medium tracking-wide", className)}>
      <span className="relative flex size-1.5">
        {status.tone === "live" && (
          <span className="fx-anim absolute inline-flex size-full animate-ping-soft rounded-full bg-emerald-400/70" />
        )}
        <span className={cn("relative inline-flex size-1.5 rounded-full", dotColor[status.tone])} />
      </span>
      {status.label}
    </Badge>
  )
}
