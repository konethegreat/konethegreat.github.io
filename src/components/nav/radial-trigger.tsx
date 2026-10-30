import { forwardRef, type ButtonHTMLAttributes } from "react"

const dots = Array.from({ length: 8 }, (_, index) => {
  const angle = (index / 8) * Math.PI * 2
  return { x: 12 + Math.cos(angle) * 7, y: 12 + Math.sin(angle) * 7 }
})

export const RadialTrigger = forwardRef<HTMLButtonElement, ButtonHTMLAttributes<HTMLButtonElement>>(
  function RadialTrigger({ className, ...props }, ref) {
    return (
      <button
        ref={ref}
        type="button"
        aria-label="Open menu"
        aria-haspopup="dialog"
        aria-keyshortcuts="Control+K Meta+K"
        className={
          "group relative inline-flex size-10 items-center justify-center rounded-full border border-primary/45 bg-primary/10 text-primary transition hover:border-primary hover:bg-primary/20 focus-visible:ring-2 focus-visible:ring-ring " +
          (className ?? "")
        }
        {...props}
      >
        <svg viewBox="0 0 24 24" className="size-5" aria-hidden="true" fill="currentColor">
          {dots.map((dot, index) => (
            <circle
              key={index}
              cx={dot.x}
              cy={dot.y}
              r={index === 0 ? 1.9 : 1.35}
              className={index === 0 ? "opacity-100" : "opacity-60"}
            />
          ))}
        </svg>
      </button>
    )
  },
)
