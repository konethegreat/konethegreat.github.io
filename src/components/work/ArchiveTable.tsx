import { ArrowUpRight } from "lucide-react"
import { StatusBadge } from "@/components/ui/status-badge"
import type { Project } from "@/data/types"

export function ArchiveTable({ projects }: { projects: Project[] }) {
  return (
    <ul className="divide-y divide-border border-y border-border">
      {projects.map((project) => (
        <li key={project.slug} className="grid gap-3 py-5 sm:grid-cols-[1fr_auto] sm:items-center sm:gap-6">
          <div>
            <p className="font-semibold">{project.title}</p>
            <p className="mt-0.5 text-sm text-muted-foreground">{project.kicker}</p>
          </div>
          <div className="flex flex-wrap items-center gap-4">
            <StatusBadge status={project.status} />
            <div className="flex flex-wrap gap-3 text-sm">
              {project.links.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 underline-offset-4 hover:underline"
                >
                  {link.label}
                  <ArrowUpRight className="size-3.5" aria-hidden="true" />
                </a>
              ))}
            </div>
          </div>
        </li>
      ))}
    </ul>
  )
}
