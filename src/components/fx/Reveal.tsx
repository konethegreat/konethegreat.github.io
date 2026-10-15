import { motion, useReducedMotion } from "framer-motion"
import type { ReactNode } from "react"

interface RevealProps {
  children: ReactNode
  delay?: number
  y?: number
  className?: string
  /** Fade in from the side instead of rising. */
  x?: number
}

/** Fade-and-rise on first view. Renders plainly when the visitor prefers reduced motion. */
export function Reveal({ children, delay = 0, y = 22, x = 0, className }: RevealProps) {
  const reduce = useReducedMotion()
  if (reduce) return <div className={className}>{children}</div>
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y, x }}
      whileInView={{ opacity: 1, y: 0, x: 0 }}
      viewport={{ once: true, margin: "0px 0px -8% 0px" }}
      transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  )
}
