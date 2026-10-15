import { ArrowUpRight } from "lucide-react"
import { TiltCard } from "@/components/fx/TiltCard"
import { Chip } from "@/components/ui/chip"
import { StatusBadge } from "@/components/ui/status-badge"
import type { Project } from "@/data/types"
import { homeLabels } from "@/data/projects"
import { useProjects } from "@/lib/project-dialog"

/** Large card for the featured grid. The whole card opens the case study (stretched button). */
export function FeatureCard({ project, flagship = false }: { project: Project; flagship?: boolean }) {
  const { openProject } = useProjects()
  const extra = project.stack.length - 5

  return (
    <TiltCard className="group h-full">
      <article className="relative flex h-full flex-col p-6 sm:p-7">
        <div className="flex items-start justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2">
            <StatusBadge status={project.status} />
            {flagship && (
              <span className="rounded-full border border-fuchsia-300/30 bg-fuchsia-300/10 px-2.5 py-0.5 font-mono text-[10px] uppercase tracking-widest text-fuchsia-200">
                Flagship
              </span>
            )}
          </div>
          <span className="shrink-0 font-mono text-xs text-slate-400">{project.period}</span>
        </div>

        <p className="mt-7 font-mono text-[11px] uppercase tracking-[0.2em] text-cyan-300">{project.kicker}</p>
        <h3 className="mt-2 font-display text-3xl font-semibold leading-tight tracking-tight">
          <button
            type="button"
            onClick={() => openProject(project.slug)}
            aria-label={`${project.title}: open case study`}
            className="text-left after:absolute after:inset-0 after:content-[''] focus-visible:outline-none focus-visible:after:rounded-2xl focus-visible:after:outline focus-visible:after:outline-2 focus-visible:after:outline-offset-2 focus-visible:after:outline-cyan-300"
          >
            {project.title}
          </button>
        </h3>
        <p className="mt-3 line-clamp-4 text-sm leading-relaxed text-muted-foreground">{project.pitch}</p>

        {project.metrics && (
          <ul className="mt-5 flex flex-wrap gap-x-5 gap-y-2" aria-label="Key numbers">
            {project.metrics.slice(0, 3).map((m) => (
              <li key={m.label} className="text-xs text-muted-foreground">
                <span className="font-display text-lg font-semibold text-foreground">{m.value}</span> {m.label}
              </li>
            ))}
          </ul>
        )}

        <div className="mt-auto flex flex-wrap gap-1.5 pt-6">
          {project.stack.slice(0, 5).map((s) => (
            <Chip key={s}>{s}</Chip>
          ))}
          {extra > 0 && <Chip className="text-slate-400">+{extra}</Chip>}
        </div>

        <div className="mt-5 flex items-center justify-between gap-4 border-t border-white/10 pt-4 text-xs">
          <span className="min-w-0">
            <span className="block text-muted-foreground">{project.role}</span>
            <span className="block font-mono text-[11px] text-slate-400">{homeLabels[project.home]}</span>
          </span>
          <span className="inline-flex shrink-0 items-center gap-1 whitespace-nowrap text-cyan-300 transition-all group-hover:gap-2">
            Case study <ArrowUpRight className="size-3.5" aria-hidden="true" />
          </span>
        </div>
      </article>
    </TiltCard>
  )
}

/** Compact card for the filterable archive. */
export function CompactCard({ project }: { project: Project }) {
  const { openProject } = useProjects()
  return (
    <TiltCard className="group h-full" max={3}>
      <article className="relative flex h-full flex-col p-5">
        <div className="flex items-start justify-between gap-3">
          <StatusBadge status={project.status} />
          <span className="shrink-0 font-mono text-[11px] text-slate-400">{project.period}</span>
        </div>
        <h3 className="mt-4 font-display text-xl font-semibold leading-snug tracking-tight">
          <button
            type="button"
            onClick={() => openProject(project.slug)}
            aria-label={`${project.title}: open details`}
            className="text-left after:absolute after:inset-0 after:content-[''] focus-visible:outline-none focus-visible:after:rounded-2xl focus-visible:after:outline focus-visible:after:outline-2 focus-visible:after:outline-offset-2 focus-visible:after:outline-cyan-300"
          >
            {project.title}
          </button>
        </h3>
        <p className="mt-1 font-mono text-[11px] uppercase tracking-wider text-slate-400">{project.kicker}</p>
        <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-muted-foreground">{project.pitch}</p>
        <div className="mt-auto flex flex-wrap gap-1.5 pt-4">
          {project.stack.slice(0, 3).map((s) => (
            <Chip key={s}>{s}</Chip>
          ))}
          {project.stack.length > 3 && <Chip className="text-slate-400">+{project.stack.length - 3}</Chip>}
        </div>
        <p className="mt-4 flex items-center justify-between border-t border-white/10 pt-3 text-[11px] text-muted-foreground">
          <span>{project.role}</span>
          <span className="inline-flex items-center gap-1 text-cyan-300 transition-all group-hover:gap-1.5">
            Details <ArrowUpRight className="size-3" aria-hidden="true" />
          </span>
        </p>
      </article>
    </TiltCard>
  )
}
