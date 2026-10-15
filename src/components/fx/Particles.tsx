import { useEffect, useRef } from "react"
import { useFx } from "@/lib/fx"

type Dot = { x: number; y: number; vx: number; vy: number; r: number; c: number }

const COLORS = ["34,211,238", "129,140,248", "167,139,250", "244,114,182"]
const LINK = 132
const POINTER_LINK = 180

/**
 * Particles — ported from the UI Vault. The original used blurred floating <div>s; this version
 * is a lightweight canvas constellation that reacts to the pointer. It pauses with the tab,
 * renders one still frame for reduced-motion visitors, and disappears when effects are switched off.
 */
export function Particles() {
  const ref = useRef<HTMLCanvasElement>(null)
  const { effects, animate } = useFx()

  useEffect(() => {
    const canvas = ref.current
    if (!canvas || !effects) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const dpr = Math.min(window.devicePixelRatio || 1, 1.5)
    const pointer = { x: -9999, y: -9999, active: false }
    let w = 0
    let h = 0
    let dots: Dot[] = []
    let raf = 0
    let last = 0

    const seed = () => {
      const coarse = window.matchMedia("(pointer: coarse)").matches
      const density = coarse ? 26000 : 17000
      const max = coarse ? 36 : 84
      const count = Math.max(18, Math.min(max, Math.round((w * h) / density)))
      dots = Array.from({ length: count }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        r: Math.random() * 1.4 + 0.55,
        c: Math.floor(Math.random() * COLORS.length),
      }))
    }

    const draw = (step: number) => {
      ctx.clearRect(0, 0, w, h)
      for (let i = 0; i < dots.length; i++) {
        const p = dots[i]
        if (step > 0) {
          p.x += p.vx * step
          p.y += p.vy * step
          if (p.x < -12) p.x = w + 12
          else if (p.x > w + 12) p.x = -12
          if (p.y < -12) p.y = h + 12
          else if (p.y > h + 12) p.y = -12
          if (pointer.active) {
            const dx = p.x - pointer.x
            const dy = p.y - pointer.y
            const d2 = dx * dx + dy * dy
            if (d2 < 120 * 120 && d2 > 1) {
              const d = Math.sqrt(d2)
              const f = ((120 - d) / 120) * 0.8 * step
              p.x += (dx / d) * f
              p.y += (dy / d) * f
            }
          }
        }
        ctx.fillStyle = `rgba(${COLORS[p.c]},0.78)`
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2)
        ctx.fill()

        for (let j = i + 1; j < dots.length; j++) {
          const q = dots[j]
          const dx = p.x - q.x
          const dy = p.y - q.y
          const d2 = dx * dx + dy * dy
          if (d2 < LINK * LINK) {
            const a = (1 - Math.sqrt(d2) / LINK) * 0.2
            ctx.strokeStyle = `rgba(${COLORS[p.c]},${a.toFixed(3)})`
            ctx.lineWidth = 1
            ctx.beginPath()
            ctx.moveTo(p.x, p.y)
            ctx.lineTo(q.x, q.y)
            ctx.stroke()
          }
        }
        if (pointer.active) {
          const dx = p.x - pointer.x
          const dy = p.y - pointer.y
          const d2 = dx * dx + dy * dy
          if (d2 < POINTER_LINK * POINTER_LINK) {
            const a = (1 - Math.sqrt(d2) / POINTER_LINK) * 0.45
            ctx.strokeStyle = `rgba(34,211,238,${a.toFixed(3)})`
            ctx.lineWidth = 1
            ctx.beginPath()
            ctx.moveTo(p.x, p.y)
            ctx.lineTo(pointer.x, pointer.y)
            ctx.stroke()
          }
        }
      }
    }

    const resize = () => {
      w = window.innerWidth
      h = window.innerHeight
      canvas.width = Math.round(w * dpr)
      canvas.height = Math.round(h * dpr)
      canvas.style.width = `${w}px`
      canvas.style.height = `${h}px`
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      seed()
      if (!animate) draw(0)
    }

    const tick = (now: number) => {
      const dt = last ? Math.min(48, now - last) : 16.7
      last = now
      draw(dt / 16.7)
      raf = requestAnimationFrame(tick)
    }

    const onMove = (e: PointerEvent) => {
      pointer.x = e.clientX
      pointer.y = e.clientY
      pointer.active = e.pointerType !== "touch"
    }
    const onLeave = () => {
      pointer.active = false
    }

    resize()
    window.addEventListener("resize", resize)
    if (animate) {
      window.addEventListener("pointermove", onMove, { passive: true })
      document.addEventListener("pointerleave", onLeave)
      raf = requestAnimationFrame(tick)
    }
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener("resize", resize)
      window.removeEventListener("pointermove", onMove)
      document.removeEventListener("pointerleave", onLeave)
    }
  }, [effects, animate])

  if (!effects) return null
  return <canvas ref={ref} aria-hidden="true" className="pointer-events-none fixed inset-0 -z-10 opacity-80" />
}
