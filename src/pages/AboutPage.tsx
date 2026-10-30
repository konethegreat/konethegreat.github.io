import { ArrowUpRight } from "lucide-react"
import { PhotoGrid } from "@/components/about/PhotoGrid"
import { StackGrid } from "@/components/about/StackGrid"
import { StoryTimeline } from "@/components/about/StoryTimeline"
import { Link } from "@/components/ui/link"
import { Photo } from "@/components/ui/photo"
import { aboutChapters, aboutIntro } from "@/data/about"
import {
  languages,
  nowItems,
  principles,
  studio,
  talk,
} from "@/data/profile"
import { services } from "@/data/services"

export function AboutPage() {
  return (
    <>
      <section className="relative isolate overflow-hidden px-4 pb-12 pt-12 sm:px-6 sm:pt-16 lg:px-8">
        <div aria-hidden="true" className="hero-grid pointer-events-none absolute inset-0 -z-10 opacity-50" />
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:items-end lg:gap-16">
          <div className="overflow-hidden rounded-[2rem] border border-border bg-card">
            <Photo
              name="portrait"
              alt="Portrait of Kone Tshivhinda."
              priority
              sizes="(min-width: 1024px) 32vw, 100vw"
              className="aspect-[3/4] w-full object-cover"
            />
          </div>
          <div>
            <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-primary">About</p>
            <h1 className="mt-4 max-w-3xl text-balance font-serif text-5xl leading-[0.94] sm:text-7xl">
              Kone Tshivhinda
            </h1>
            <p className="mt-3 font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
              AI systems engineer · Full-stack developer · Johannesburg
            </p>
            <div className="mt-6 space-y-4 text-pretty text-lg leading-relaxed text-muted-foreground">
              {aboutIntro.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section aria-labelledby="story-title" className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
        <div className="max-w-3xl">
          <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-primary">Story</p>
          <h2 id="story-title" className="mt-3 font-serif text-4xl leading-[1.02] sm:text-5xl">
            Seven chapters, with the evidence attached.
          </h2>
          <p className="mt-5 text-lg leading-relaxed text-muted-foreground">
            The dates and links below are the public record. If a claim is not backed by something
            openable, it is not on this page.
          </p>
        </div>
        <div className="mt-12">
          <StoryTimeline chapters={aboutChapters} />
        </div>
      </section>

      <section aria-labelledby="principles-title" className="border-y border-border/70 bg-card/40">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-primary">Principles</p>
            <h2 id="principles-title" className="mt-3 font-serif text-4xl leading-[1.02] sm:text-5xl">
              Four rules the work has to pass.
            </h2>
          </div>
          <ul className="mt-10 grid gap-5 md:grid-cols-2">
            {principles.map((principle) => (
              <li key={principle.id}>
                <article className="flex h-full flex-col rounded-3xl border border-border bg-background/60 p-6">
                  <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-primary">{principle.line}</p>
                  <h3 className="mt-3 font-serif text-3xl leading-tight">{principle.title}</h3>
                  <p className="mt-3 flex-1 text-sm leading-relaxed text-muted-foreground">{principle.body}</p>
                  <div className="mt-5 flex flex-wrap gap-2 border-t border-border pt-4">
                    {principle.proof.map((proof) => (
                      <Link
                        key={proof.slug}
                        to={`/work/${proof.slug}`}
                        className="inline-flex items-center gap-1 rounded-full border border-border px-3 py-1 text-xs font-medium transition hover:border-primary hover:text-primary"
                      >
                        {proof.label}
                        <ArrowUpRight className="size-3" aria-hidden="true" />
                      </Link>
                    ))}
                  </div>
                </article>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section aria-labelledby="stack-title" className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="max-w-3xl">
          <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-primary">Stack</p>
          <h2 id="stack-title" className="mt-3 font-serif text-4xl leading-[1.02] sm:text-5xl">
            Tools, grouped by the job.
          </h2>
          <p className="mt-5 text-lg leading-relaxed text-muted-foreground">
            A tool earns its place by surviving a project. Each group links to work where it was
            actually used.
          </p>
        </div>
        <div className="mt-10">
          <StackGrid />
        </div>
      </section>

      <section aria-labelledby="studio-title" className="border-y border-border/70 bg-card/40">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
            <div>
              <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-primary">Studio</p>
              <h2 id="studio-title" className="mt-3 font-serif text-4xl leading-[1.02] sm:text-5xl">
                {studio.name}
              </h2>
              <p className="mt-3 text-sm font-medium text-muted-foreground">
                {studio.role} · since {studio.since}
              </p>
              <p className="mt-5 max-w-md text-sm leading-relaxed text-muted-foreground">{studio.blurb}</p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Link
                  to="/work/k-one"
                  className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition hover:brightness-105"
                >
                  Open the studio case study
                  <ArrowUpRight className="size-4" aria-hidden="true" />
                </Link>
                <a
                  href="https://k-one-it-solutions-website.erictshivhinda.workers.dev/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-full border border-border px-5 py-2.5 text-sm font-semibold transition hover:border-primary hover:text-primary"
                >
                  Visit the studio site
                  <ArrowUpRight className="size-4" aria-hidden="true" />
                </a>
              </div>
            </div>
            <div>
              <h3 className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
                Services
              </h3>
              <ul className="mt-3 grid gap-2 sm:grid-cols-2">
                {services.map((service) => (
                  <li key={service.id} className="rounded-xl border border-border px-3 py-2 text-sm">
                    {service.title}
                  </li>
                ))}
              </ul>
              <h3 className="mt-8 font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
                Delivered work
              </h3>
              <ul className="mt-3 divide-y divide-border border-y border-border">
                {studio.works.map((work) => (
                  <li key={work.title} className="py-3">
                    <a
                      href={work.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-semibold underline-offset-4 hover:underline"
                    >
                      {work.title}
                    </a>
                    <p className="mt-1 text-sm text-muted-foreground">{work.detail}</p>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section aria-labelledby="beyond-title" className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="max-w-3xl">
          <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-primary">Beyond the code</p>
          <h2 id="beyond-title" className="mt-3 font-serif text-4xl leading-[1.02] sm:text-5xl">
            The person outside the terminal.
          </h2>
          <p className="mt-5 text-lg leading-relaxed text-muted-foreground">
            A few frames that do not fit a case study. Open one for the full photo.
          </p>
        </div>
        <div className="mt-10">
          <PhotoGrid />
        </div>
      </section>

      <section aria-labelledby="now-title" className="border-y border-border/70 bg-card/40">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:px-8">
          <div>
            <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-primary">Now</p>
            <h2 id="now-title" className="mt-3 font-serif text-4xl leading-[1.02] sm:text-5xl">
              What the week looks like.
            </h2>
            <dl className="mt-8 space-y-5">
              {nowItems.map((item) => (
                <div key={item.label} className="border-l-2 border-primary/40 pl-4">
                  <dt className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
                    {item.label}
                  </dt>
                  <dd className="mt-1 text-sm leading-relaxed">{item.detail}</dd>
                </div>
              ))}
            </dl>
            <h3 className="mt-10 font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
              Languages
            </h3>
            <ul className="mt-3 flex flex-wrap gap-2">
              {languages.map((language) => (
                <li key={language.name} className="rounded-full border border-border px-3 py-1 text-sm">
                  {language.name} · {language.level}
                </li>
              ))}
            </ul>
          </div>

          <article className="flex flex-col justify-between rounded-3xl border border-border bg-background/60 p-6 sm:p-8">
            <div>
              <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-teal">
                {talk.kind} · {talk.when}
              </p>
              <h3 className="mt-4 max-w-lg font-serif text-3xl leading-tight sm:text-4xl">{talk.title}</h3>
              <p className="mt-4 max-w-xl text-sm leading-relaxed text-muted-foreground">{talk.blurb}</p>
            </div>
            <p className="mt-8 font-mono text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
              {talk.audience}
            </p>
          </article>
        </div>
      </section>

      <section className="px-4 py-20 sm:px-6 lg:px-8">
        <div className="relative isolate mx-auto max-w-7xl overflow-hidden rounded-[2rem] border border-border bg-card px-6 py-14 sm:px-10 lg:px-16 lg:py-20">
          <div aria-hidden="true" className="hero-glow pointer-events-none absolute inset-0 -z-10 opacity-80" />
          <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-primary">Next</p>
          <h2 className="mt-4 max-w-2xl font-serif text-5xl leading-[0.98] sm:text-6xl">
            The work is the public record.
          </h2>
          <p className="mt-5 max-w-xl text-lg leading-relaxed text-muted-foreground">
            If something here looks like a problem you are carrying, bring it. A short conversation
            is enough to know whether I can help.
          </p>
          <Link
            to="/contact"
            className="group mt-8 inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition hover:brightness-105"
          >
            Start a conversation
            <ArrowUpRight className="size-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" aria-hidden="true" />
          </Link>
        </div>
      </section>
    </>
  )
}
