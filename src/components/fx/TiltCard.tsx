import { useRef, type HTMLAttributes, type PointerEvent, type ReactNode } from "react"
import { cn } from "@/lib/utils"
import { useFx } from "@/lib/fx"

interface TiltCardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode
  /** Maximum tilt in degrees (0 disables the 3D tilt but keeps the spotlight). */
  max?: number
}

/**
 * A glass card with a cursor-follow spotlight, a gradient hairline that tracks the pointer and a
 * subtle 3D tilt. The tilt only runs for fine pointers when motion is allowed; the spotlight
 * works on any hover.
 */
export function TiltCard({ children, className, max = 5, onPointerMove, onPointerLeave, ...rest }: TiltCardProps) {
  const ref = useRef<HTMLDivElement>(null)
  const raf = useRef(0)
  const { cursor } = useFx()

  const handleMove = (e: PointerEvent<HTMLDivElement>) => {
    onPointerMove?.(e)
    if (e.pointerType === "touch") return
    const el = ref.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    cancelAnimationFrame(raf.current)
    raf.current = requestAnimationFrame(() => {
      el.style.setProperty("--mx", `${x}px`)
      el.style.setProperty("--my", `${y}px`)
      if (cursor && max > 0) {
        const rx = (y / rect.height - 0.5) * -max
        const ry = (x / rect.width - 0.5) * max
        el.style.transform = `perspective(1000px) rotateX(${rx.toFixed(2)}deg) rotateY(${ry.toFixed(2)}deg)`
      }
    })
  }

  const handleLeave = (e: PointerEvent<HTMLDivElement>) => {
    onPointerLeave?.(e)
    cancelAnimationFrame(raf.current)
    if (ref.current) ref.current.style.transform = ""
  }

  return (
    <div
      ref={ref}
      onPointerMove={handleMove}
      onPointerLeave={handleLeave}
      className={cn(
        "spotlight glass rounded-2xl transition-[transform,border-color] duration-200 ease-out will-change-transform",
        className,
      )}
      {...rest}
    >
      <div className="relative z-[2] h-full">{children}</div>
    </div>
  )
}
