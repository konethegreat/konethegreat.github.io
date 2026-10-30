import { ArrowRight } from "lucide-react"
import { Link } from "@/components/ui/link"
import { nextCaseStudy } from "@/data/case-studies"
import { projectBySlug } from "@/data/projects"
import type { CaseStudy } from "@/data/types"

export function CaseNext({ study }: { study: CaseStudy }) {
  const next = nextCaseStudy(study.slug)
  const nextProject = projectBySlug(next.slug)
  if (!nextProject || next.slug === study.slug) return null

  return (
    <section aria-labelledby="next-case-title" className="mt-20 border-t border-border pt-10">
      <h2 id="next-case-title" className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
        Next case study
      </h2>
      <Link
        to={`/work/${next.slug}`}
        className="group mt-4 flex flex-wrap items-end justify-between gap-4 rounded-3xl border border-border bg-card/60 p-6 transition hover:border-primary/50 sm:p-8"
      >
        <span>
          <span className="block font-serif text-4xl leading-tight sm:text-5xl">{nextProject.title}</span>
          <span className="mt-2 block max-w-xl text-muted-foreground">{next.tagline}</span>
        </span>
        <span className="inline-flex size-12 items-center justify-center rounded-full border border-border transition group-hover:border-primary group-hover:bg-primary group-hover:text-primary-foreground">
          <ArrowRight className="size-5" aria-hidden="true" />
        </span>
      </Link>
    </section>
  )
}
