import { Check } from "lucide-react"
import { StatusBadge } from "@/components/ui/status-badge"
import { caseMedia } from "@/data/case-media"
import type { CaseStudy, CaseStudySection, Project } from "@/data/types"

function Section({ section }: { section: CaseStudySection }) {
  if (section.kind === "facts") {
    return (
      <section className="mt-10">
        {section.heading ? <h2 className="font-serif text-3xl">{section.heading}</h2> : null}
        <dl className="mt-4 grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-border bg-border sm:grid-cols-4">
          {section.facts.map((fact) => (
            <div key={fact.label} className="bg-card p-4">
              <dt className="font-mono text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
                {fact.label}
              </dt>
              <dd className="mt-1 font-display text-xl">{fact.value}</dd>
            </div>
          ))}
        </dl>
      </section>
    )
  }

  if (section.kind === "prose") {
    return (
      <section className="mt-12">
        {section.heading ? <h2 className="font-serif text-3xl leading-tight sm:text-4xl">{section.heading}</h2> : null}
        <div className="mt-4 space-y-4 text-base leading-relaxed text-muted-foreground sm:text-lg">
          {section.body.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>
      </section>
    )
  }

  if (section.kind === "list") {
    return (
      <section className="mt-12">
        <h2 className="font-serif text-3xl leading-tight sm:text-4xl">{section.heading}</h2>
        <ul className="mt-5 space-y-3">
          {section.items.map((item) => (
            <li key={item} className="flex gap-3 text-muted-foreground">
              <Check className="mt-1 size-4 shrink-0 text-primary" aria-hidden="true" />
              <span className="leading-relaxed">{item}</span>
            </li>
          ))}
        </ul>
      </section>
    )
  }

  if (section.kind === "quote") {
    return (
      <blockquote className="mt-12 border-l-2 border-primary/50 pl-5 font-serif text-2xl italic leading-snug">
        <p>{section.quote}</p>
        {section.attribution ? (
          <footer className="mt-3 font-mono text-[10px] uppercase not-italic tracking-[0.16em] text-muted-foreground">
            {section.attribution}
          </footer>
        ) : null}
      </blockquote>
    )
  }

  return (
    <figure className="mt-12">
      <img
        src={section.src}
        alt={section.alt}
        width={section.width}
        height={section.height}
        className="h-auto w-full rounded-2xl border border-border"
      />
      {section.caption ? (
        <figcaption className="mt-2 text-sm text-muted-foreground">{section.caption}</figcaption>
      ) : null}
    </figure>
  )
}

function Rail({ project, study }: { project: Project; study: CaseStudy }) {
  return (
    <aside aria-label="Project facts" className="lg:sticky lg:top-24 lg:self-start">
      <div className="rounded-3xl border border-border bg-card/60 p-6">
        <StatusBadge status={project.status} />
        <dl className="mt-5 space-y-4 text-sm">
          <div>
            <dt className="font-mono text-[10px] uppercase tracking-[0.16em] text-muted-foreground">Role</dt>
            <dd className="mt-1">{study.role}</dd>
          </div>
          <div>
            <dt className="font-mono text-[10px] uppercase tracking-[0.16em] text-muted-foreground">Period</dt>
            <dd className="mt-1">{study.year}</dd>
          </div>
          <div>
            <dt className="font-mono text-[10px] uppercase tracking-[0.16em] text-muted-foreground">Team</dt>
            <dd className="mt-1">{study.team}</dd>
          </div>
        </dl>

        <h2 className="mt-7 font-mono text-[10px] uppercase tracking-[0.16em] text-muted-foreground">Stack</h2>
        <ul className="mt-3 flex flex-wrap gap-2">
          {study.stack.map((item) => (
            <li
              key={item}
              className="rounded-md border border-border bg-muted/40 px-2 py-1 font-mono text-[10px] uppercase tracking-wide text-muted-foreground"
            >
              {item}
            </li>
          ))}
        </ul>
      </div>
    </aside>
  )
}

export function CaseBody({ project, study }: { project: Project; study: CaseStudy }) {
  const media = caseMedia[study.slug]
  return (
    <div className="mt-12 grid gap-12 lg:grid-cols-[minmax(0,1fr)_17rem] lg:gap-14">
      <div className="order-2 min-w-0 lg:order-1">
        {study.sections.map((section, index) => (
          <Section key={`${section.kind}-${index}`} section={section} />
        ))}

        {study.decisions?.length ? (
          <section className="mt-14">
            <h2 className="font-serif text-3xl leading-tight sm:text-4xl">Decisions that matter</h2>
            <div className="mt-6 grid gap-4">
              {study.decisions.map((decision, index) => (
                <article key={decision.title} className="rounded-2xl border border-border bg-card/60 p-6">
                  <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-primary">
                    0{index + 1} / {decision.title}
                  </p>
                  <p className="mt-3 text-lg leading-relaxed">{decision.choice}</p>
                  <dl className="mt-4 grid gap-3 text-sm text-muted-foreground sm:grid-cols-2">
                    <div>
                      <dt className="font-mono text-[10px] uppercase tracking-[0.14em]">Why</dt>
                      <dd className="mt-1 leading-relaxed">{decision.why}</dd>
                    </div>
                    <div>
                      <dt className="font-mono text-[10px] uppercase tracking-[0.14em]">Trade-off</dt>
                      <dd className="mt-1 leading-relaxed">{decision.tradeoff}</dd>
                    </div>
                  </dl>
                </article>
              ))}
            </div>
          </section>
        ) : null}

        <section className="mt-14">
          <h2 className="font-serif text-3xl leading-tight sm:text-4xl">Proof</h2>
          {project.metrics?.length ? (
            <dl className="mt-5 grid grid-cols-2 gap-4 sm:grid-cols-3">
              {project.metrics.map((metric) => (
                <div key={metric.label} className="rounded-2xl border border-border bg-card/60 p-4">
                  <dt className="font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
                    {metric.label}
                  </dt>
                  <dd className="mt-2 font-display text-3xl leading-none text-primary">{metric.value}</dd>
                </div>
              ))}
            </dl>
          ) : (
            <p className="mt-4 text-muted-foreground">No headline metric is claimed for this project.</p>
          )}
          {project.note ? (
            <div className="mt-6 rounded-2xl border border-copper/30 bg-copper/5 p-5">
              <h3 className="font-mono text-[10px] uppercase tracking-[0.16em] text-copper">The honest note</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{project.note}</p>
            </div>
          ) : null}
        </section>

        {media.gallery.length ? (
          <section className="mt-14">
            <h2 className="font-serif text-3xl leading-tight sm:text-4xl">Gallery</h2>
            <div className="mt-5 grid gap-5 sm:grid-cols-2">
              {media.gallery.map((image) => (
                <figure key={image.src}>
                  <img
                    src={image.src}
                    alt={image.alt}
                    width={image.width}
                    height={image.height}
                    loading="lazy"
                    decoding="async"
                    className="h-auto w-full rounded-2xl border border-border"
                  />
                  <figcaption className="mt-2 text-sm text-muted-foreground">{image.caption}</figcaption>
                </figure>
              ))}
            </div>
          </section>
        ) : null}
      </div>

      <div className="order-1 lg:order-2">
        <Rail project={project} study={study} />
      </div>
    </div>
  )
}
