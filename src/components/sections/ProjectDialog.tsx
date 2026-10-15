import { ArrowLeft, ArrowRight, ArrowUpRight, Globe, HardDrive, Lock, Code2, Info } from "lucide-react"
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Chip } from "@/components/ui/chip"
import { StatusBadge } from "@/components/ui/status-badge"
import { GithubIcon } from "@/lib/icons"
import { homeLabels, projectBySlug, projects, groupLabels } from "@/data/projects"
import type { Access } from "@/data/types"

const accessInfo: Record<Access, { label: string; Icon: typeof Globe }> = {
  live: { label: "Live system", Icon: Globe },
  code: { label: "Source is public", Icon: Code2 },
  private: { label: "Private repository", Icon: Lock },
  local: { label: "Local project", Icon: HardDrive },
}

interface Props {
  slug: string
  open: boolean
  onClose: () => void
  onNavigate: (slug: string) => void
}

export default function ProjectDialog({ slug, open, onClose, onNavigate }: Props) {
  const project = projectBySlug(slug)
  if (!project) return null

  const index = projects.findIndex((p) => p.slug === slug)
  const prev = projects[(index - 1 + projects.length) % projects.length]
  const next = projects[(index + 1) % projects.length]
  const { Icon: AccessIcon, label: accessLabel } = accessInfo[project.access]

  return (
    <Dialog open={open} onOpenChange={(value) => !value && onClose()}>
      <DialogContent variant="modal" closeLabel="Close case study">
        <div aria-hidden="true" className="h-1.5 w-full bg-[image:var(--grad)]" />
        <div className="p-6 sm:p-9">
          <div className="mb-5 flex flex-wrap items-center gap-2 pr-10">
            <StatusBadge status={project.status} />
            <Badge variant="outline" className="font-mono text-[11px] font-medium">
              {project.role}
            </Badge>
            <span className="font-mono text-xs text-slate-400">{project.period}</span>
          </div>

          <p className="font-mono text-xs uppercase tracking-[0.2em] text-cyan-300">{project.kicker}</p>
          <DialogTitle className="mt-2 text-3xl leading-[1.05] sm:text-5xl">{project.title}</DialogTitle>
          <DialogDescription className="mt-4 text-base leading-relaxed text-slate-300 sm:text-lg">
            {project.pitch}
          </DialogDescription>

          {project.metrics && (
            <dl className="mt-7 grid grid-cols-2 gap-3 sm:grid-cols-4">
              {project.metrics.map((m) => (
                <div key={m.label} className="rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3">
                  <dd className="font-display text-2xl font-semibold text-gradient">{m.value}</dd>
                  <dt className="mt-0.5 text-xs text-muted-foreground">{m.label}</dt>
                </div>
              ))}
            </dl>
          )}

          <h3 className="mt-9 font-mono text-xs uppercase tracking-[0.2em] text-slate-400">What it does</h3>
          <ul className="mt-3 space-y-3">
            {project.highlights.map((h) => (
              <li key={h} className="flex gap-3 text-[15px] leading-relaxed text-slate-300">
                <span aria-hidden="true" className="mt-2 size-1.5 shrink-0 rounded-full bg-[image:var(--grad)]" />
                <span>{h}</span>
              </li>
            ))}
          </ul>

          <h3 className="mt-9 font-mono text-xs uppercase tracking-[0.2em] text-slate-400">Stack</h3>
          <div className="mt-3 flex flex-wrap gap-1.5">
            {project.stack.map((s) => (
              <Chip key={s}>{s}</Chip>
            ))}
          </div>

          <div className="mt-9 grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div className="flex items-start gap-3 rounded-xl border border-white/10 bg-white/[0.03] p-4">
              <AccessIcon className="mt-0.5 size-4 shrink-0 text-cyan-300" aria-hidden="true" />
              <div>
                <p className="text-sm font-medium text-foreground">{accessLabel}</p>
                <p className="text-xs text-muted-foreground">
                  {groupLabels[project.group]} · {homeLabels[project.home]}
                </p>
              </div>
            </div>
            {project.note && (
              <div className="flex items-start gap-3 rounded-xl border border-amber-300/20 bg-amber-300/[0.05] p-4">
                <Info className="mt-0.5 size-4 shrink-0 text-amber-200" aria-hidden="true" />
                <p className="text-xs leading-relaxed text-amber-50/90">{project.note}</p>
              </div>
            )}
          </div>

          {project.links.length > 0 && (
            <div className="mt-8 flex flex-wrap gap-3">
              {project.links.map((link) => (
                <Button key={link.href} asChild variant={link.kind === "live" ? "glow" : "outline"}>
                  <a href={link.href} target="_blank" rel="noopener noreferrer">
                    {link.kind === "code" ? <GithubIcon className="size-4" /> : null}
                    {link.label}
                    <ArrowUpRight aria-hidden="true" />
                  </a>
                </Button>
              ))}
            </div>
          )}

          <nav aria-label="More projects" className="mt-10 flex items-center justify-between gap-3 border-t border-white/10 pt-5">
            <button
              type="button"
              onClick={() => onNavigate(prev.slug)}
              className="group flex min-w-0 items-center gap-2 rounded-lg px-2 py-1.5 text-left text-sm text-muted-foreground transition hover:text-foreground"
            >
              <ArrowLeft className="size-4 shrink-0 transition group-hover:-translate-x-0.5" aria-hidden="true" />
              <span className="min-w-0">
                <span className="block text-[11px] uppercase tracking-widest text-slate-400">Previous</span>
                <span className="block truncate">{prev.title}</span>
              </span>
            </button>
            <button
              type="button"
              onClick={() => onNavigate(next.slug)}
              className="group flex min-w-0 items-center gap-2 rounded-lg px-2 py-1.5 text-right text-sm text-muted-foreground transition hover:text-foreground"
            >
              <span className="min-w-0">
                <span className="block text-[11px] uppercase tracking-widest text-slate-400">Next</span>
                <span className="block truncate">{next.title}</span>
              </span>
              <ArrowRight className="size-4 shrink-0 transition group-hover:translate-x-0.5" aria-hidden="true" />
            </button>
          </nav>
        </div>
      </DialogContent>
    </Dialog>
  )
}
