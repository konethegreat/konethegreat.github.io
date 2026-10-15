import { motion, useScroll, useSpring } from "framer-motion"

/** Thin gradient bar showing how far down the page you are. */
export function ScrollProgress() {
  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, { stiffness: 140, damping: 30, mass: 0.3 })
  return (
    <motion.div
      aria-hidden="true"
      style={{ scaleX }}
      className="fixed inset-x-0 top-0 z-[75] h-[3px] origin-left bg-[image:var(--grad)]"
    />
  )
}
