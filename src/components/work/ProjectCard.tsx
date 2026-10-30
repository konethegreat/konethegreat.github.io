import { ArrowUpRight } from "lucide-react"
import { StatusBadge } from "@/components/ui/status-badge"
import { Link } from "@/components/ui/link"
import type { Project } from "@/data/types"

export function ProjectCard({ project }: { project: Project }) {
  return (
    <article className="group flex h-full flex-col rounded-3xl border border-border bg-card/60 p-6 transition hover:border-primary/50 hover:bg-card">
      <div className="flex items-start justify-between gap-3">
        <StatusBadge status={project.status} />
        <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
          {project.period}
        </span>
      </div>

      <h2 className="mt-5 font-serif text-3xl leading-tight">
        <Link to={`/work/${project.slug}`} className="underline-offset-4 hover:underline">
          {project.title}
        </Link>
      </h2>
      <p className="mt-1 text-sm font-medium text-muted-foreground">{project.kicker}</p>
      <p className="mt-4 flex-1 text-sm leading-relaxed text-muted-foreground">{project.pitch}</p>

      <ul className="mt-5 flex flex-wrap gap-2" aria-label={`${project.title} tags`}>
        {project.tags.slice(0, 3).map((tag) => (
          <li key={tag} className="rounded-md border border-border bg-muted/40 px-2 py-1 font-mono text-[10px] uppercase tracking-wide text-muted-foreground">
            {tag}
          </li>
        ))}
      </ul>

      <div className="mt-6 flex flex-wrap items-center gap-x-4 gap-y-2 border-t border-border pt-4 text-sm">
        {project.links.map((link) => (
          <a
            key={link.href}
            href={link.href}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 font-medium underline-offset-4 hover:underline"
          >
            {link.label}
            <ArrowUpRight className="size-3.5" aria-hidden="true" />
          </a>
        ))}
        <Link
          to={`/work/${project.slug}`}
          onClick={(event) => {
            if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0) return
            const card = event.currentTarget.closest("article")
            if (card) card.style.viewTransitionName = "case-hero"
          }}
          className="ml-auto inline-flex items-center gap-1 font-semibold text-primary underline-offset-4 hover:underline"
        >
          Read the case study
        </Link>
      </div>
    </article>
  )
}
