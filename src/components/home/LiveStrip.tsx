import { ArrowUpRight } from "lucide-react"
import { liveProjects } from "@/data/live"
import { cn } from "@/lib/utils"

const accentClass = {
  brass: "text-brass",
  copper: "text-copper",
  teal: "text-teal",
} as const

function LiveRow({ duplicate = false }: { duplicate?: boolean }) {
  return (
    <ul
      aria-hidden={duplicate ? "true" : undefined}
      className="flex shrink-0 items-center gap-2 pr-2 sm:gap-3"
    >
      {liveProjects.map((project) => {
        const host = new URL(project.url).host.replace(/^www\./, "")
        return (
          <li key={`${duplicate ? "dup-" : ""}${project.slug}`}>
            <a
              href={project.url}
              target="_blank"
              rel="noopener noreferrer"
              tabIndex={duplicate ? -1 : undefined}
              className="group flex items-center gap-3 rounded-full border border-border bg-background/70 px-4 py-2.5 transition hover:border-ring/60 hover:bg-accent"
            >
              <span className={cn("font-mono text-[10px] uppercase tracking-[0.16em]", accentClass[project.accent])}>
                {project.tag}
              </span>
              <span className="text-sm font-semibold">{project.name}</span>
              <span className="hidden text-xs text-muted-foreground sm:inline">{host}</span>
              <ArrowUpRight className="size-3.5 text-muted-foreground transition group-hover:text-foreground" aria-hidden="true" />
              <span className="sr-only">opens in a new tab</span>
            </a>
          </li>
        )
      })}
    </ul>
  )
}

export function LiveStrip() {
  return (
    <section id="live" aria-labelledby="live-title" className="border-y border-border/70 bg-card/40">
      <div className="mx-auto flex max-w-7xl flex-wrap items-baseline justify-between gap-2 px-4 pb-4 pt-8 sm:px-6 lg:px-8">
        <h2 id="live-title" className="font-mono text-[11px] uppercase tracking-[0.22em] text-primary">
          Live right now
        </h2>
        <p className="text-xs text-muted-foreground">Seven deployments, verified 30 October 2026. Each opens in a new tab.</p>
      </div>
      <div className="live-marquee mask-fade-x overflow-hidden pb-8">
        <div className="live-track flex w-max animate-marquee">
          <LiveRow />
          <LiveRow duplicate />
        </div>
      </div>
    </section>
  )
}
