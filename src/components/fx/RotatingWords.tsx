import { useEffect, useState } from "react"
import { motion, useReducedMotion } from "framer-motion"
import { cn } from "@/lib/utils"

interface RotatingWordsProps {
  words: readonly string[]
  interval?: number
  className?: string
}

/**
 * Rotating words, adapted from the 21st.dev "Animated hero". Every word sits in the same grid
 * cell, so the slot is always as wide as the longest word and the layout never jumps. Put the
 * slot at the END of a sentence: the spare width after a short word is then invisible, instead of
 * a gap in the middle of the line. The rotating text is decorative; callers provide a static,
 * accessible sentence next to it.
 */
export function RotatingWords({ words, interval = 2300, className }: RotatingWordsProps) {
  const [index, setIndex] = useState(0)
  const reduce = useReducedMotion()

  useEffect(() => {
    if (reduce) return
    const id = window.setTimeout(() => setIndex((i) => (i + 1) % words.length), interval)
    return () => window.clearTimeout(id)
  }, [index, interval, reduce, words.length])

  return (
    <span
      aria-hidden="true"
      className={cn("relative inline-grid overflow-hidden pb-[0.14em] align-bottom -mb-[0.14em]", className)}
    >
      {words.map((word, i) => (
        <motion.span
          key={word}
          className="text-gradient-anim fx-anim col-start-1 row-start-1 whitespace-nowrap font-semibold"
          initial={false}
          animate={
            index === i
              ? { y: "0%", opacity: 1 }
              : { y: index > i || (index === 0 && i === words.length - 1) ? "-115%" : "115%", opacity: 0 }
          }
          transition={{ type: "spring", stiffness: 70, damping: 16 }}
        >
          {word}
        </motion.span>
      ))}
    </span>
  )
}
