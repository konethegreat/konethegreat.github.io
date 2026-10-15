import { useRef } from "react"
import { useInView } from "framer-motion"
import { useCountUp } from "@/lib/hooks"
import { useFx } from "@/lib/fx"

interface CounterProps {
  value: number
  suffix?: string
  className?: string
}

/** Counts up the first time it scrolls into view. Screen readers get the final value only. */
export function Counter({ value, suffix = "", className }: CounterProps) {
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true, margin: "0px 0px -10% 0px" })
  const { reduced } = useFx()
  const n = useCountUp(value, inView, 1500, reduced)
  return (
    <span ref={ref} className={className}>
      <span aria-hidden="true">
        {n}
        {suffix}
      </span>
      <span className="sr-only">
        {value}
        {suffix}
      </span>
    </span>
  )
}
