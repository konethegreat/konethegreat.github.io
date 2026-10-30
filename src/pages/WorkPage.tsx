import { useState } from "react"
import { ArrowUpRight } from "lucide-react"
import { ArchiveTable } from "@/components/work/ArchiveTable"
import { ProjectCard } from "@/components/work/ProjectCard"
import { StationFilters } from "@/components/work/StationFilters"
import { Link } from "@/components/ui/link"
import { archiveOnlyProjects, projectsForStation, type StationId } from "@/data/work"

export function WorkPage() {
  const [active, setActive] = useState<StationId | null>(null)
  const shown = projectsForStation(active)

  return (
    <>
      <section className="relative isolate overflow-hidden px-4 pb-10 pt-12 sm:px-6 sm:pt-16 lg:px-8">
        <div aria-hidden="true" className="hero-grid pointer-events-none absolute inset-0 -z-10 opacity-50" />
        <div className="mx-auto max-w-7xl">
          <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-primary">Work</p>
          <h1 className="mt-4 max-w-4xl text-balance font-serif text-5xl leading-[0.94] sm:text-7xl lg:text-[6rem]">
            Eight builds, one standard.
          </h1>
          <p className="mt-6 max-w-2xl text-pretty text-lg leading-relaxed text-muted-foreground sm:text-xl">
            Agents, legal tech, civic tech and the studio. Every case study opens with what the
            product does, how it is built, the decisions that shaped it and the limits it still has.
          </p>
        </div>
      </section>

      <section aria-labelledby="archive-title" className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h2 id="archive-title" className="sr-only">
          Case studies
        </h2>
        <StationFilters active={active} onSelect={setActive} count={shown.length} />

        {shown.length ? (
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {shown.map((project) => (
              <ProjectCard key={project.slug} project={project} />
            ))}
          </div>
        ) : (
          <div className="mt-10 rounded-3xl border border-border bg-card/60 p-8">
            <p className="text-muted-foreground">No case study matches that station yet.</p>
            <button
              type="button"
              onClick={() => setActive(null)}
              className="mt-4 rounded-full border border-border px-4 py-2 text-sm font-semibold transition hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              Show all work
            </button>
          </div>
        )}
      </section>

      <section aria-labelledby="archive-list-title" className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-primary">Archive</p>
            <h2 id="archive-list-title" className="mt-3 font-serif text-4xl leading-[1.02] sm:text-5xl">
              The rest of the bench.
            </h2>
          </div>
          <p className="max-w-md text-sm leading-relaxed text-muted-foreground">
            Coursework, prototypes and supporting tools. Nothing here is padded out to look like a
            client engagement.
          </p>
        </div>
        <div className="mt-8">
          <ArchiveTable projects={archiveOnlyProjects} />
        </div>
      </section>

      <section className="px-4 pb-20 sm:px-6 lg:px-8">
        <div className="relative isolate mx-auto max-w-7xl overflow-hidden rounded-[2rem] border border-border bg-card px-6 py-12 sm:px-10 lg:px-16">
          <div aria-hidden="true" className="hero-glow pointer-events-none absolute inset-0 -z-10 opacity-70" />
          <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-primary">Next</p>
          <h2 className="mt-4 max-w-2xl font-serif text-4xl leading-[0.98] sm:text-5xl">
            Have a problem that looks like one of these?
          </h2>
          <p className="mt-4 max-w-xl text-lg leading-relaxed text-muted-foreground">
            Bring the messy version. A short conversation is enough to scope the work and quote in rand.
          </p>
          <Link
            to="/contact"
            className="group mt-8 inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition hover:brightness-105"
          >
            Start a conversation
            <ArrowUpRight className="size-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" aria-hidden="true" />
          </Link>
        </div>
      </section>
    </>
  )
}
