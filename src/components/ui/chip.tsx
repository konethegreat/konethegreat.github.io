import type { HTMLAttributes } from "react"
import { cn } from "@/lib/utils"

/** Small monospace pill used for tech-stack and tag lists. */
export function Chip({ className, ...props }: HTMLAttributes<HTMLSpanElement>) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-md border border-white/10 bg-white/[0.04] px-2 py-1 font-mono text-[11px] leading-none text-slate-300",
        className,
      )}
      {...props}
    />
  )
}
