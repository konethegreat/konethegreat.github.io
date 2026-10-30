import { ArrowUpRight, ChevronRight, CircleDot, FileDown } from "lucide-react"
import { StatusBadge } from "@/components/ui/status-badge"
import { Link } from "@/components/ui/link"
import type { CaseStudy, Project } from "@/data/types"

const accents = {
  brass: { primary: "var(--brass)", secondary: "var(--teal)" },
  copper: { primary: "var(--copper)", secondary: "var(--brass)" },
  teal: { primary: "var(--teal)", secondary: "var(--copper)" },
} as const

function CoverArt({ study }: { study: CaseStudy }) {
  const palette = accents[study.accent]
  const id = `cover-${study.slug}`
  return (
    <div
      role="img"
      aria-label={`${study.tagline}. Illustrated cover, not a screenshot.`}
      className="relative mt-10 overflow-hidden rounded-[2rem] border border-border bg-card"
    >
      <svg viewBox="0 0 1200 380" className="h-auto w-full" aria-hidden="true">
        <defs>
          <linearGradient id={id} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor={palette.primary} stopOpacity="0.24" />
            <stop offset="100%" stopColor={palette.secondary} stopOpacity="0.05" />
          </linearGradient>
          <pattern id={`${id}-grid`} width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M40 0H0V40" fill="none" stroke="currentColor" strokeOpacity="0.09" />
          </pattern>
        </defs>
        <rect width="1200" height="380" fill={`url(#${id})`} />
        <rect width="1200" height="380" fill={`url(#${id}-grid)`} className="text-foreground" />
        <g fill="none" stroke={palette.primary} strokeOpacity="0.55" strokeWidth="1.5">
          <circle cx="985" cy="110" r="118" />
          <circle cx="985" cy="110" r="78" strokeDasharray="4 8" />
          <path d="M70 300 L390 300 L510 214 L780 214" />
          <path d="M70 330 L420 330 L560 250 L830 250" strokeOpacity="0.3" />
        </g>
        <g fill={palette.primary}>
          <circle cx="390" cy="300" r="5" />
          <circle cx="510" cy="214" r="5" />
          <circle cx="985" cy="110" r="7" />
        </g>
        <g fill={palette.secondary} fillOpacity="0.75">
          <rect x="620" y="118" width="14" height="64" rx="7" />
          <rect x="650" y="92" width="14" height="90" rx="7" />
          <rect x="680" y="140" width="14" height="42" rx="7" />
        </g>
      </svg>
      <p className="absolute bottom-4 left-5 rounded-full border border-border bg-background/80 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.16em] text-muted-foreground backdrop-blur">
        Illustrated cover, not a screenshot
      </p>
    </div>
  )
}

export function CaseHero({ project, study }: { project: Project; study: CaseStudy }) {
  return (
    <header>
      <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-sm text-muted-foreground">
        <Link to="/work" className="underline-offset-4 hover:text-foreground hover:underline">
          Work
        </Link>
        <ChevronRight className="size-3.5" aria-hidden="true" />
        <span aria-current="page">{project.title}</span>
      </nav>

      <div className="mt-8 flex flex-wrap items-center gap-3">
        <StatusBadge status={project.status} />
        <span className="inline-flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
          <CircleDot className="size-3" aria-hidden="true" />
          {study.year}
        </span>
      </div>

      <h1
        style={{ viewTransitionName: "case-hero" }}
        className="mt-4 max-w-4xl font-display text-5xl uppercase leading-[0.92] tracking-[-0.02em] sm:text-7xl lg:text-[5.5rem]"
      >
        {project.title}
      </h1>
      <p className="mt-4 max-w-2xl font-serif text-2xl italic leading-snug text-muted-foreground sm:text-3xl">
        {study.tagline}
      </p>
      <p className="mt-5 max-w-2xl text-pretty text-lg leading-relaxed">{study.summary}</p>

      <div className="mt-7 flex flex-wrap items-center gap-3">
        {project.links.map((link) => (
          <a
            key={link.href}
            href={link.href}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition hover:brightness-105"
          >
            {link.label}
            <ArrowUpRight className="size-4" aria-hidden="true" />
          </a>
        ))}
        {study.technicalBrief ? (
          <a
            href={study.technicalBrief}
            className="inline-flex items-center gap-2 rounded-full border border-border px-5 py-2.5 text-sm font-semibold transition hover:bg-accent"
          >
            <FileDown className="size-4" aria-hidden="true" />
            Technical brief (PDF)
          </a>
        ) : null}
      </div>

      <CoverArt study={study} />
    </header>
  )
}
