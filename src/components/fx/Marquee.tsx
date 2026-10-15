import type { CSSProperties } from "react"
import { cn } from "@/lib/utils"

interface MarqueeProps {
  items: readonly string[]
  /** Seconds for one full loop. */
  duration?: number
  reverse?: boolean
  className?: string
  label?: string
}

/** Infinite, pausable ticker. Static and wrapped for reduced-motion visitors. */
export function Marquee({ items, duration = 52, reverse = false, className, label = "Tools and technologies" }: MarqueeProps) {
  const style = {
    "--marquee-duration": `${duration}s`,
    animationDirection: reverse ? "reverse" : "normal",
  } as CSSProperties

  const list = (hidden: boolean) => (
    <ul
      aria-hidden={hidden || undefined}
      className={cn(
        "flex shrink-0 items-center gap-3 pr-3",
        hidden && "motion-reduce:hidden",
        "motion-reduce:flex-wrap motion-reduce:justify-center motion-reduce:pr-0",
      )}
    >
      {items.map((item) => (
        <li
          key={item}
          className="flex items-center gap-2.5 whitespace-nowrap rounded-full border border-white/10 bg-white/[0.035] px-4 py-2 font-mono text-[13px] text-slate-300"
        >
          <span className="size-1.5 rounded-full bg-[image:var(--grad)]" aria-hidden="true" />
          {item}
        </li>
      ))}
    </ul>
  )

  return (
    <div className={cn("group relative overflow-hidden mask-fade-x", className)} role="group" aria-label={label}>
      <div
        className="fx-anim flex w-max animate-marquee will-change-transform group-hover:[animation-play-state:paused] motion-reduce:w-full motion-reduce:animate-none"
        style={style}
      >
        {list(false)}
        {list(true)}
      </div>
    </div>
  )
}
