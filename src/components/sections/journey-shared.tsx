import { ArrowUpRight, Award, BookOpen, Briefcase, Crown, GraduationCap, Landmark, Mic, Rocket, Shield, Users } from "lucide-react"
import type { LucideIcon } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Chip } from "@/components/ui/chip"
import { projectBySlug } from "@/data/projects"
import type { JourneyNode } from "@/data/types"
import { useProjects } from "@/lib/project-dialog"

/** Icon names in the data file map to lucide components here (keeps the data layer free of React). */
export const journeyIcons: Record<string, LucideIcon> = {
  Crown,
  GraduationCap,
  Users,
  Rocket,
  Landmark,
  Award,
  Briefcase,
  Shield,
  Mic,
  BookOpen,
}

export const statusMeta: Record<JourneyNode["status"], { label: string; badge: "live" | "code" | "wip"; dot: string }> = {
  done: { label: "Done", badge: "code", dot: "bg-cyan-400" },
  now: { label: "Now", badge: "live", dot: "bg-emerald-400" },
  next: { label: "Next", badge: "wip", dot: "bg-amber-300" },
}

export function JourneyMeta({ node }: { node: JourneyNode }) {
  const meta = statusMeta[node.status]
  return (
    <div className="flex flex-wrap items-center gap-2">
      <Badge variant={meta.badge} className="font-mono text-[11px] font-medium uppercase tracking-wider">
        <span className="relative flex size-1.5">
          {node.status === "now" && (
            <span className="fx-anim absolute inline-flex size-full animate-ping-soft rounded-full bg-emerald-400/70" />
          )}
          <span className={`relative inline-flex size-1.5 rounded-full ${meta.dot}`} />
        </span>
        {meta.label}
      </Badge>
      <span className="font-mono text-xs text-slate-400">{node.date}</span>
      <Chip>{node.category}</Chip>
    </div>
  )
}

/** Title, copy, tech chips and the optional case-study button for one milestone. */
export function JourneyBody({ node, headingLevel = 3 }: { node: JourneyNode; headingLevel?: 3 | 4 }) {
  const { openProject } = useProjects()
  const project = node.projectSlug ? projectBySlug(node.projectSlug) : undefined
  const Heading = headingLevel === 3 ? "h3" : "h4"
  return (
    <>
      <Heading className="mt-4 font-display text-2xl font-semibold leading-tight tracking-tight sm:text-3xl">{node.title}</Heading>
      <p className="mt-3 text-[15px] leading-relaxed text-muted-foreground">{node.content}</p>
      <ul className="mt-4 flex flex-wrap gap-1.5" aria-label="Skills and tools in this chapter">
        {node.tech.map((t) => (
          <li key={t}>
            <Chip>{t}</Chip>
          </li>
        ))}
      </ul>
      {project && (
        <Button
          variant="outline"
          size="sm"
          className="mt-5 h-auto min-h-9 max-w-full whitespace-normal py-2 text-left"
          onClick={() => openProject(project.slug)}
        >
          Open the {project.title} case study <ArrowUpRight aria-hidden="true" />
        </Button>
      )}
    </>
  )
}
