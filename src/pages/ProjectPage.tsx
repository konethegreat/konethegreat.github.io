import { Link } from "@/components/ui/link"
import { projectBySlug } from "@/data/projects"
import { useRouteMatch } from "@/lib/router"
import { NotFoundPage } from "./NotFoundPage"

export function ProjectPage() {
  const match = useRouteMatch()
  const slug = match?.params.slug ?? ""
  const project = projectBySlug(slug)
  if (!project) return <NotFoundPage />

  return (
    <article
      className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8"
      style={{ viewTransitionName: "case-hero" }}
    >
      <Link to="/work" className="text-sm text-muted-foreground hover:text-foreground">
        Back to work
      </Link>
      <p className="mt-8 font-mono text-xs uppercase tracking-[0.2em] text-primary">{project.status.label}</p>
      <h1 className="mt-3 font-display text-5xl uppercase leading-[0.95] sm:text-7xl">{project.title}</h1>
      <p className="mt-3 text-xl text-muted-foreground">{project.kicker}</p>
      <p className="mt-6 text-lg leading-relaxed">{project.pitch}</p>
      <ul className="mt-8 space-y-3">
        {project.highlights.map((highlight) => (
          <li key={highlight} className="border-l-2 border-primary/50 pl-4 text-muted-foreground">
            {highlight}
          </li>
        ))}
      </ul>
      <div className="mt-8 flex flex-wrap gap-2">
        {project.stack.map((item) => (
          <span key={item} className="rounded-full border border-border px-3 py-1 text-sm">
            {item}
          </span>
        ))}
      </div>
      <div className="mt-8 flex flex-wrap gap-4">
        {project.links.map((link) => (
          <a key={link.href} href={link.href} target="_blank" rel="noopener noreferrer" className="font-semibold underline underline-offset-4">
            {link.label}
          </a>
        ))}
      </div>
      {project.note ? (
        <p className="mt-8 rounded-xl border border-border bg-card p-4 text-sm text-muted-foreground">{project.note}</p>
      ) : null}
    </article>
  )
}
