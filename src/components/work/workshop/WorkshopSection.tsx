import { lazy, Suspense, useEffect, useState } from "react"
import { stations, type StationId } from "@/data/work"
import { usePrefersReducedMotion } from "@/lib/hooks"
import { canRenderWorkshop } from "@/lib/webgl"
import { cn } from "@/lib/utils"
import { WorkshopFallback } from "./WorkshopFallback"

const WorkshopScene = lazy(() => import("./WorkshopScene"))

interface Props {
  active: StationId | null
  onSelect: (station: StationId | null) => void
}

const DOT: Record<StationId, string> = {
  agents: "bg-brass",
  retrieval: "bg-copper",
  product: "bg-teal",
  "local-first": "bg-brass",
  cloud: "bg-copper",
  quality: "bg-teal",
}

export function WorkshopSection({ active, onSelect }: Props) {
  const reduced = usePrefersReducedMotion()
  const [capable, setCapable] = useState(false)
  const [narrow, setNarrow] = useState(
    () => typeof window !== "undefined" && window.matchMedia("(max-width: 639px)").matches,
  )

  useEffect(() => setCapable(canRenderWorkshop()), [])

  useEffect(() => {
    const query = window.matchMedia("(max-width: 639px)")
    const update = () => setNarrow(query.matches)
    update()
    query.addEventListener("change", update)
    return () => query.removeEventListener("change", update)
  }, [])

  const sceneReady = capable && !reduced && !narrow

  return (
    <section
      aria-labelledby="workshop-title"
      className="relative isolate overflow-hidden rounded-[2rem] border border-border bg-card"
    >
      <div aria-hidden="true" className="hero-grid pointer-events-none absolute inset-0 -z-10 opacity-40" />
      <div className="px-5 py-8 sm:px-8 sm:py-10">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-primary">Workbench</p>
            <h2 id="workshop-title" className="mt-3 font-serif text-4xl leading-none sm:text-5xl">
              The workshop
            </h2>
            <p className="mt-3 max-w-xl text-sm leading-relaxed text-muted-foreground">
              Six stations. Pick one to see the projects that live there.
            </p>
          </div>
          <button
            type="button"
            aria-pressed={active === null}
            onClick={() => onSelect(null)}
            className={cn(
              "rounded-full border px-4 py-2 text-sm transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
              active === null
                ? "border-primary bg-primary font-semibold text-primary-foreground"
                : "border-border bg-background/40 text-muted-foreground hover:text-foreground",
            )}
          >
            All work
          </button>
        </div>

        <div className="relative mt-8 overflow-hidden rounded-2xl border border-border bg-muted/30">
          <div aria-hidden="true" className="hero-grid pointer-events-none absolute inset-0 opacity-30" />
          <div className="relative">
            {sceneReady ? (
              <Suspense fallback={<WorkshopFallback active={active} />}>
                <WorkshopScene
                  active={active}
                  onSelect={(station) => onSelect(active === station ? null : station)}
                />
              </Suspense>
            ) : (
              <WorkshopFallback active={active} />
            )}
          </div>
        </div>
        <p className="mt-3 font-mono text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
          {sceneReady
            ? "Hover a station to light it. Click to filter the bench."
            : narrow
              ? "Simplified view for small screens. The full scene runs on wider displays."
              : "Simplified workshop view. The full scene needs WebGL and a fine pointer."}
        </p>

        <div role="group" aria-label="Workshop stations" className="mt-6 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {stations.map((station, index) => (
            <button
              key={station.id}
              type="button"
              aria-pressed={active === station.id}
              onClick={() => onSelect(active === station.id ? null : station.id)}
              className={cn(
                "flex min-w-0 items-center gap-3 rounded-xl border px-4 py-3 text-left transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                active === station.id
                  ? "border-primary bg-primary/10"
                  : "border-border bg-background/40 hover:border-primary/40 hover:bg-background/70",
              )}
            >
              <span
                aria-hidden="true"
                className={cn("size-2 shrink-0 rounded-full", DOT[station.id])}
              />
              <span className="min-w-0">
                <span className="block text-sm font-semibold">{station.label}</span>
                <span className="mt-0.5 block text-xs leading-snug text-muted-foreground">
                  {station.blurb}
                </span>
              </span>
              <span aria-hidden="true" className="ml-auto font-mono text-[10px] text-muted-foreground">
                {String(index + 1).padStart(2, "0")}
              </span>
            </button>
          ))}
        </div>
      </div>
    </section>
  )
}
