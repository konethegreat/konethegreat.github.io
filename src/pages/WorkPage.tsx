import { Link } from "@/components/ui/link"
import { archiveProjects, featuredProjects } from "@/data/projects"
import { StatusBadge } from "@/components/ui/status-badge"

export function WorkPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <h1 className="font-display text-5xl uppercase sm:text-7xl">Work</h1>
      <p className="mt-4 max-w-2xl text-lg text-muted-foreground">
        Eight case studies across AI agents, legal tech, civic tech and the studio.
      </p>
      <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {featuredProjects.map((project) => (
          <li key={project.slug} className="rounded-2xl border border-border bg-card p-5">
            <StatusBadge status={project.status} />
            <h2 className="mt-3 text-2xl font-semibold">
              <Link to={`/work/${project.slug}`}>{project.title}</Link>
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{project.pitch}</p>
            <div className="mt-4 flex flex-wrap gap-2 text-sm">
              {project.links.map((link) => (
                <a key={link.href} href={link.href} target="_blank" rel="noopener noreferrer" className="underline underline-offset-4">
                  {link.label}
                </a>
              ))}
            </div>
          </li>
        ))}
      </ul>
      <h2 className="mt-16 font-serif text-3xl">Archive</h2>
      <ul className="mt-4 divide-y divide-border">
        {archiveProjects.map((project) => (
          <li key={project.slug} className="flex flex-wrap items-center justify-between gap-3 py-4">
            <div>
              <p className="font-semibold">{project.title}</p>
              <p className="text-sm text-muted-foreground">{project.kicker}</p>
            </div>
            <StatusBadge status={project.status} />
          </li>
        ))}
      </ul>
    </div>
  )
}
