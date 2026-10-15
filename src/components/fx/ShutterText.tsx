import { motion, useReducedMotion } from "framer-motion"
import { cn } from "@/lib/utils"

interface ShutterTextProps {
  text: string
  className?: string
  /** Seconds to wait before this word starts (lets a second line follow the first). */
  baseDelay?: number
  /** Change this number to replay the animation. */
  replayKey?: number
}

const SLICES = [
  { clip: "polygon(0 0, 100% 0, 100% 35%, 0 35%)", from: "-100%", to: "100%", delay: 0, color: "text-cyan-400" },
  { clip: "polygon(0 35%, 100% 35%, 100% 65%, 0 65%)", from: "100%", to: "-100%", delay: 0.1, color: "text-fuchsia-300" },
  { clip: "polygon(0 65%, 100% 65%, 100% 100%, 0 100%)", from: "-100%", to: "100%", delay: 0.2, color: "text-violet-400" },
] as const

/**
 * Hero shutter text — adapted from the 21st.dev "Hero shutter text" component.
 * Each glyph blurs into focus while three clipped slices sweep across it. Letters are decorative
 * (aria-hidden); the parent heading carries the accessible name. Plain text when motion is reduced.
 */
export function ShutterText({ text, className, baseDelay = 0, replayKey = 0 }: ShutterTextProps) {
  const reduce = useReducedMotion()
  const chars = Array.from(text)

  if (reduce) {
    return <span className={cn("inline-block text-white", className)}>{text}</span>
  }

  return (
    <span key={replayKey} className={cn("inline-flex flex-wrap items-center", className)}>
      {chars.map((char, i) => (
        <span key={`${char}-${i}`} className="relative inline-block overflow-hidden px-[0.012em]">
          <motion.span
            initial={{ opacity: 0, filter: "blur(10px)" }}
            animate={{ opacity: 1, filter: "blur(0px)" }}
            transition={{ delay: baseDelay + i * 0.045 + 0.3, duration: 0.8 }}
            className="block leading-none text-white"
          >
            {char === " " ? " " : char}
          </motion.span>
          {SLICES.map((slice) => (
            <motion.span
              key={slice.clip}
              initial={{ x: slice.from, opacity: 0 }}
              animate={{ x: slice.to, opacity: [0, 1, 0] }}
              transition={{ duration: 0.7, delay: baseDelay + i * 0.045 + slice.delay, ease: "easeInOut" }}
              className={cn("pointer-events-none absolute inset-0 z-10 block leading-none", slice.color)}
              style={{ clipPath: slice.clip }}
            >
              {char}
            </motion.span>
          ))}
        </span>
      ))}
    </span>
  )
}
