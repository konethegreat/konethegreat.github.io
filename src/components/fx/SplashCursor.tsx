import { useEffect, useRef } from "react"
import { useFx } from "@/lib/fx"

type Splash = { x: number; y: number; vx: number; vy: number; r: number; a: number; s: number }

// UI Vault palette (sky / indigo / violet) plus a pink accent.
const PALETTE = ["56,189,248", "125,211,252", "129,140,248", "167,139,250", "244,114,182"]

const rand = (min: number, max: number) => Math.random() * (max - min) + min

/**
 * SplashCursor — ported from the UI Vault. Original: a React-state-driven particle trail drawn
 * with a fresh radial gradient per particle every frame plus GSAP and a Framer-Motion orb.
 * Here: pre-rendered glow sprites, a single rAF loop that sleeps when the pointer is idle, no
 * per-frame React renders, and no GSAP. Only runs for fine pointers without reduced motion.
 */
export function SplashCursor() {
  const ref = useRef<HTMLCanvasElement>(null)
  const { cursor } = useFx()

  useEffect(() => {
    const canvas = ref.current
    if (!canvas || !cursor) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const dpr = Math.min(window.devicePixelRatio || 1, 1.5)
    let w = 0
    let h = 0
    const sprites = PALETTE.map((rgb) => {
      const s = document.createElement("canvas")
      s.width = s.height = 64
      const c = s.getContext("2d")!
      const g = c.createRadialGradient(32, 32, 0, 32, 32, 32)
      g.addColorStop(0, `rgba(${rgb},0.6)`)
      g.addColorStop(0.4, `rgba(${rgb},0.22)`)
      g.addColorStop(1, `rgba(${rgb},0)`)
      c.fillStyle = g
      c.fillRect(0, 0, 64, 64)
      return s
    })

    const splashes: Splash[] = []
    const pointer = { x: -999, y: -999, lastMove: 0 }
    const orb = { x: -999, y: -999 }
    let prev = { x: -999, y: -999 }
    let running = false
    let raf = 0

    const resize = () => {
      w = window.innerWidth
      h = window.innerHeight
      canvas.width = Math.round(w * dpr)
      canvas.height = Math.round(h * dpr)
      canvas.style.width = `${w}px`
      canvas.style.height = `${h}px`
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }

    const frame = (now: number) => {
      ctx.clearRect(0, 0, w, h)
      ctx.globalCompositeOperation = "lighter"
      const moving = now - pointer.lastMove < 90

      if (moving) {
        const speed = Math.hypot(pointer.x - prev.x, pointer.y - prev.y)
        const n = Math.max(1, Math.min(3, Math.round(speed / 16)))
        for (let i = 0; i < n; i++) {
          splashes.push({
            x: pointer.x,
            y: pointer.y,
            vx: rand(-1.3, 1.3),
            vy: rand(-1.3, 1.3),
            r: rand(14, 30),
            a: 1,
            s: Math.floor(Math.random() * sprites.length),
          })
        }
        prev = { x: pointer.x, y: pointer.y }
      }

      // trailing glow orb (spring-ish follow)
      orb.x += (pointer.x - orb.x) * 0.16
      orb.y += (pointer.y - orb.y) * 0.16
      ctx.globalAlpha = 0.32
      ctx.drawImage(sprites[0], orb.x - 46, orb.y - 46, 92, 92)

      for (let i = splashes.length - 1; i >= 0; i--) {
        const p = splashes[i]
        p.x += p.vx
        p.y += p.vy
        p.a *= 0.955
        p.r *= 0.992
        if (p.a < 0.04 || p.r < 3) {
          splashes.splice(i, 1)
          continue
        }
        ctx.globalAlpha = p.a
        ctx.drawImage(sprites[p.s], p.x - p.r, p.y - p.r, p.r * 2, p.r * 2)
      }
      if (splashes.length > 90) splashes.splice(0, splashes.length - 90)
      ctx.globalAlpha = 1
      ctx.globalCompositeOperation = "source-over"

      if (!moving && splashes.length === 0 && Math.hypot(pointer.x - orb.x, pointer.y - orb.y) < 1) {
        running = false
        ctx.clearRect(0, 0, w, h)
        return
      }
      raf = requestAnimationFrame(frame)
    }

    const onMove = (e: PointerEvent) => {
      if (e.pointerType === "touch") return
      pointer.x = e.clientX
      pointer.y = e.clientY
      pointer.lastMove = performance.now()
      if (orb.x < -900) {
        orb.x = pointer.x
        orb.y = pointer.y
        prev = { x: pointer.x, y: pointer.y }
      }
      if (!running) {
        running = true
        raf = requestAnimationFrame(frame)
      }
    }

    resize()
    window.addEventListener("resize", resize)
    window.addEventListener("pointermove", onMove, { passive: true })
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener("resize", resize)
      window.removeEventListener("pointermove", onMove)
    }
  }, [cursor])

  if (!cursor) return null
  return (
    <canvas
      ref={ref}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-[60] mix-blend-screen"
    />
  )
}
