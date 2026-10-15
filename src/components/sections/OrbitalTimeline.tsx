import { useCallback, useEffect, useLayoutEffect, useRef, useState, type KeyboardEvent } from "react"
import { ChevronLeft, ChevronRight, Pause, Play } from "lucide-react"
import { Button } from "@/components/ui/button"
import { journey } from "@/data/journey"
import { useFx } from "@/lib/fx"
import { cn } from "@/lib/utils"
import { journeyIcons, JourneyBody, JourneyMeta } from "./journey-shared"

/* ------------------------------------------------------------------------------------------
   Radial orbital timeline — adapted from the 21st.dev "Radial Orbital Timeline".
   Changes: positions are written straight to the DOM from one rAF loop (no per-frame React
   renders), it only runs while on screen, hover/focus holds the rotation, there is a visible
   pause control, tabs semantics + arrow keys, and "energy" became tech chips.
------------------------------------------------------------------------------------------- */

const DEG = Math.PI / 180
/** Angle (in degrees) of the 12 o'clock slot on the orbit. */
const TOP = 270
/** Auto-rotation speed in degrees per millisecond (about 4.5 degrees a second). */
const SPEED = 0.0045
const START_ID = 7
const RADIUS_RATIO = 0.38

/** Signed shortest angular difference, in [-180, 180). */
const wrap180 = (d: number) => ((((d + 180) % 360) + 360) % 360) - 180

export default function OrbitalTimeline() {
  const { animate } = useFx()
  const nodes = journey
  const n = nodes.length
  const startIdx = Math.max(0, nodes.findIndex((x) => x.id === START_ID))

  const [activeId, setActiveId] = useState(nodes[startIdx].id)
  const [auto, setAuto] = useState(true)
  const [size, setSize] = useState(0)
  const [inView, setInView] = useState(false)

  const stageRef = useRef<HTMLDivElement>(null)
  const nodeRefs = useRef<(HTMLDivElement | null)[]>([])
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([])
  const lineRefs = useRef(new Map<number, SVGLineElement>())
  const pos = useRef<[number, number][]>(nodes.map(() => [0, 0]))
  const rot = useRef(TOP - (startIdx / n) * 360)
  const target = useRef<number | null>(null)
  const sizeRef = useRef(0)
  const activeIdx = useRef(startIdx)
  const autoRef = useRef(true)
  const animateRef = useRef(animate)
  const holdRef = useRef(false)

  const activeNode = nodes.find((x) => x.id === activeId) ?? nodes[startIdx]

  useEffect(() => {
    animateRef.current = animate
  }, [animate])
  useEffect(() => {
    autoRef.current = auto
  }, [auto])

  /** Write every node (and the connector lines) to the DOM for the current rotation. */
  const place = useCallback(() => {
    const radius = sizeRef.current * RADIUS_RATIO
    const base = rot.current
    for (let i = 0; i < n; i++) {
      const a = ((i / n) * 360 + base) * DEG
      const x = Math.cos(a) * radius
      const y = Math.sin(a) * radius
      pos.current[i] = [x, y]
      const el = nodeRefs.current[i]
      if (!el) continue
      const depth = (1 - Math.sin(a)) / 2 // 1 at the top of the orbit, 0 at the bottom
      el.style.transform = `translate3d(${x.toFixed(2)}px, ${y.toFixed(2)}px, 0) scale(${(0.88 + depth * 0.12).toFixed(3)})`
      el.style.zIndex = String(10 + Math.round(depth * 20))
    }
    const from = pos.current[activeIdx.current]
    lineRefs.current.forEach((line, id) => {
      const to = pos.current[nodes.findIndex((x) => x.id === id)]
      if (!from || !to) return
      line.setAttribute("x1", from[0].toFixed(2))
      line.setAttribute("y1", from[1].toFixed(2))
      line.setAttribute("x2", to[0].toFixed(2))
      line.setAttribute("y2", to[1].toFixed(2))
    })
  }, [n, nodes])

  useLayoutEffect(() => {
    place()
  }, [place, size, activeId])

  // Measure the stage and know whether it is on screen.
  useEffect(() => {
    const el = stageRef.current
    if (!el) return
    const ro = new ResizeObserver(([entry]) => {
      const w = entry.contentRect.width
      sizeRef.current = w
      setSize(w)
    })
    ro.observe(el)
    const io = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), { rootMargin: "120px" })
    io.observe(el)
    return () => {
      ro.disconnect()
      io.disconnect()
    }
  }, [])

  // One animation loop: ease towards a clicked node, otherwise drift slowly.
  useEffect(() => {
    if (!inView || !animate) return
    let raf = 0
    let last = performance.now()
    const tick = (now: number) => {
      const dt = Math.min(64, now - last)
      last = now
      let moved = false
      if (target.current !== null) {
        const diff = wrap180(target.current - rot.current)
        if (Math.abs(diff) < 0.04) {
          rot.current = target.current
          target.current = null
        } else {
          rot.current += diff * (1 - Math.exp(-dt / 120))
        }
        moved = true
      } else if (autoRef.current && !holdRef.current) {
        rot.current += dt * SPEED
        moved = true
      }
      if (moved) place()
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [inView, animate, place])

  const select = useCallback(
    (id: number, focus = false) => {
      const idx = nodes.findIndex((x) => x.id === id)
      if (idx < 0) return
      activeIdx.current = idx
      setActiveId(id)
      // choosing a chapter hands control to the visitor
      setAuto(false)
      autoRef.current = false
      const goal = TOP - (idx / n) * 360
      const delta = wrap180(goal - rot.current)
      if (animateRef.current) {
        target.current = rot.current + delta
      } else {
        rot.current += delta
        place()
      }
      if (focus) tabRefs.current[idx]?.focus()
    },
    [n, nodes, place],
  )

  const step = (dir: 1 | -1) => select(nodes[(activeIdx.current + dir + n) % n].id)

  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    let next = -1
    if (e.key === "ArrowRight" || e.key === "ArrowDown") next = (activeIdx.current + 1) % n
    else if (e.key === "ArrowLeft" || e.key === "ArrowUp") next = (activeIdx.current - 1 + n) % n
    else if (e.key === "Home") next = 0
    else if (e.key === "End") next = n - 1
    if (next < 0) return
    e.preventDefault()
    select(nodes[next].id, true)
  }

  const half = size / 2

  return (
    <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lg:gap-14">
      {/* ---------------------------------------------------------------- orbit */}
      <div>
        <div
          ref={stageRef}
          className="relative isolate mx-auto aspect-square w-full max-w-[40rem]"
          onPointerEnter={() => {
            holdRef.current = true
          }}
          onPointerLeave={() => {
            holdRef.current = false
          }}
          onFocusCapture={() => {
            holdRef.current = true
          }}
          onBlurCapture={() => {
            holdRef.current = false
          }}
        >
          {/* atmosphere */}
          <div
            aria-hidden="true"
            className="absolute inset-[6%] rounded-full bg-[radial-gradient(closest-side,rgba(139,92,246,0.22),rgba(34,211,238,0.07)_62%,transparent)]"
          />
          <div aria-hidden="true" className="absolute inset-[12%] rounded-full border border-dashed border-white/15" />
          <div aria-hidden="true" className="absolute inset-[30%] rounded-full border border-white/[0.07]" />
          <div
            aria-hidden="true"
            className="fx-anim animate-spin-slower absolute inset-[12%] rounded-full bg-[conic-gradient(from_0deg,transparent_0deg,rgb(34_211_238/0.55)_38deg,transparent_84deg)] [mask-image:radial-gradient(farthest-side,transparent_calc(100%-2px),#000_calc(100%-1px))]"
          />

          {/* connector lines for the selected chapter */}
          {size > 0 && (
            <svg
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 z-[5] size-full overflow-visible"
              viewBox={`${-half} ${-half} ${size} ${size}`}
            >
              {activeNode.related.map((id) => (
                <line
                  key={id}
                  ref={(el) => {
                    if (el) lineRefs.current.set(id, el)
                    else lineRefs.current.delete(id)
                  }}
                  stroke="#22d3ee"
                  strokeOpacity="0.55"
                  strokeWidth="1.5"
                  strokeDasharray="3 6"
                  strokeLinecap="round"
                />
              ))}
            </svg>
          )}

          {/* centre orb */}
          <div className="pointer-events-none absolute left-1/2 top-1/2 z-[6] size-28 -translate-x-1/2 -translate-y-1/2 sm:size-32">
            <span className="fx-anim absolute inset-0 animate-ping-soft rounded-full bg-violet-400/25" />
            <span className="fx-anim absolute -inset-5 animate-ping-soft rounded-full border border-cyan-300/25 [animation-delay:-1.2s]" />
            <div className="relative grid size-full place-items-center rounded-full bg-[radial-gradient(circle_at_30%_25%,#67e8f9,#8b5cf6_58%,#f472b6)] shadow-[0_0_70px_-6px_rgb(139_92_246/0.9)]">
              <div className="text-center text-[#05060d]">
                <p className="font-display text-3xl font-bold leading-none sm:text-4xl">KT</p>
                <p className="mt-1 font-mono text-[9px] font-medium uppercase tracking-[0.18em]">2020 → now</p>
              </div>
            </div>
          </div>

          {/* nodes */}
          <div
            role="tablist"
            aria-label="Career milestones"
            aria-orientation="horizontal"
            onKeyDown={onKeyDown}
            className="absolute inset-0 transition-opacity duration-500"
            style={{ opacity: size > 0 ? 1 : 0 }}
          >
            {nodes.map((node, i) => {
              const Icon = journeyIcons[node.icon]
              const isActive = node.id === activeId
              const isRelated = !isActive && activeNode.related.includes(node.id)
              return (
                <div
                  key={node.id}
                  ref={(el) => {
                    nodeRefs.current[i] = el
                  }}
                  role="presentation"
                  className="absolute left-1/2 top-1/2 size-0 will-change-transform"
                >
                  <button
                    ref={(el) => {
                      tabRefs.current[i] = el
                    }}
                    type="button"
                    role="tab"
                    id={`journey-tab-${node.id}`}
                    aria-selected={isActive}
                    aria-controls="journey-panel"
                    tabIndex={isActive ? 0 : -1}
                    onClick={() => select(node.id)}
                    className="group absolute left-0 top-0 flex -translate-x-1/2 -translate-y-7 flex-col items-center focus-visible:outline-none"
                  >
                    <span
                      className={cn(
                        "relative grid size-14 place-items-center rounded-full border backdrop-blur-md transition-[transform,background-color,border-color,box-shadow,color] duration-300 group-focus-visible:outline group-focus-visible:outline-2 group-focus-visible:outline-offset-4 group-focus-visible:outline-cyan-300",
                        node.status === "next" && "border-dashed",
                        isActive
                          ? "scale-[1.18] border-transparent bg-[image:var(--grad)] text-[#05060d] shadow-[0_0_44px_-4px_rgb(139_92_246/0.95)]"
                          : isRelated
                            ? "border-cyan-300/70 bg-[#0c1024]/90 text-cyan-200 shadow-[0_0_28px_-6px_rgb(34_211_238/0.85)]"
                            : "border-white/20 bg-[#0c1024]/90 text-slate-200 group-hover:border-white/45 group-hover:text-white",
                      )}
                    >
                      {isRelated && (
                        <span className="fx-anim absolute inset-0 animate-ping-soft rounded-full border border-cyan-300/50" />
                      )}
                      <Icon className="size-5" aria-hidden="true" />
                      {node.status === "now" && (
                        <span className="absolute -right-0.5 -top-0.5 flex size-3">
                          <span className="fx-anim absolute inline-flex size-full animate-ping-soft rounded-full bg-emerald-400/70" />
                          <span className="relative inline-flex size-3 rounded-full border-2 border-[#05060d] bg-emerald-400" />
                        </span>
                      )}
                    </span>
                    <span
                      className={cn(
                        "mt-2.5 whitespace-nowrap rounded-full px-2 py-0.5 font-mono text-[11px] leading-tight transition-colors",
                        isActive ? "bg-white/10 font-semibold text-white" : "text-slate-300 group-hover:text-white",
                      )}
                    >
                      {node.short}
                      <span className="sr-only">
                        , {node.date}
                        {node.status === "now" ? ", current" : node.status === "next" ? ", upcoming" : ""}
                      </span>
                    </span>
                  </button>
                </div>
              )
            })}
          </div>
        </div>

        <ul className="mt-4 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-xs text-muted-foreground" aria-label="Legend">
          <li className="inline-flex items-center gap-2">
            <span className="size-2.5 rounded-full border border-white/30 bg-[#0c1024]" aria-hidden="true" /> Done
          </li>
          <li className="inline-flex items-center gap-2">
            <span className="size-2.5 rounded-full bg-emerald-400" aria-hidden="true" /> Now
          </li>
          <li className="inline-flex items-center gap-2">
            <span className="size-2.5 rounded-full border border-dashed border-white/40" aria-hidden="true" /> Next
          </li>
          <li className="inline-flex items-center gap-2">
            <span className="h-px w-5 border-t border-dashed border-cyan-300" aria-hidden="true" /> Connected chapters
          </li>
        </ul>
      </div>

      {/* --------------------------------------------------------------- detail */}
      <div className="min-w-0">
        <div
          id="journey-panel"
          role="tabpanel"
          aria-labelledby={`journey-tab-${activeNode.id}`}
          className="glass-strong relative overflow-hidden rounded-3xl p-6 sm:p-8"
        >
          <div
            aria-hidden="true"
            className="absolute inset-x-0 top-0 h-px bg-[image:var(--grad)] opacity-80"
          />
          <div key={activeNode.id} className="animate-overlay-in">
            <JourneyMeta node={activeNode} />
            <JourneyBody node={activeNode} />

            <div className="mt-6 border-t border-white/10 pt-5">
              <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-slate-400">Connected chapters</p>
              <ul className="mt-3 flex flex-wrap gap-2">
                {activeNode.related.map((id) => {
                  const rel = nodes.find((x) => x.id === id)
                  if (!rel) return null
                  return (
                    <li key={id}>
                      <button
                        type="button"
                        onClick={() => select(id, false)}
                        className="rounded-full border border-cyan-300/30 bg-cyan-300/[0.07] px-3 py-1.5 text-xs text-cyan-100 transition hover:border-cyan-300/60 hover:bg-cyan-300/15"
                      >
                        {rel.title}
                      </button>
                    </li>
                  )
                })}
              </ul>
            </div>
          </div>

          <div className="mt-7 flex flex-wrap items-center justify-between gap-3 border-t border-white/10 pt-5">
            <div className="flex items-center gap-2">
              <Button variant="outline" size="icon" className="size-9" onClick={() => step(-1)} aria-label="Previous chapter">
                <ChevronLeft aria-hidden="true" />
              </Button>
              <span className="min-w-16 text-center font-mono text-xs text-slate-400" aria-live="polite">
                {nodes.indexOf(activeNode) + 1} / {n}
              </span>
              <Button variant="outline" size="icon" className="size-9" onClick={() => step(1)} aria-label="Next chapter">
                <ChevronRight aria-hidden="true" />
              </Button>
            </div>
            {animate && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  const nextAuto = !auto
                  autoRef.current = nextAuto
                  setAuto(nextAuto)
                }}
                aria-label={auto ? "Pause the orbit rotation" : "Resume the orbit rotation"}
              >
                {auto ? <Pause aria-hidden="true" /> : <Play aria-hidden="true" />}
                {auto ? "Pause rotation" : "Resume rotation"}
              </Button>
            )}
          </div>
        </div>
        <p className="mt-3 text-xs text-slate-400">
          Tip: use the arrow keys on the orbit to move between chapters.
        </p>
      </div>
    </div>
  )
}
