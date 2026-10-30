import { ArrowUpRight, Bot, Cloud, Cpu, FileCheck2, LayoutGrid, Search } from "lucide-react"
import { Link } from "@/components/ui/link"
import {
  engagementModels,
  processSteps,
  serviceFaq,
  serviceHonesty,
  services,
} from "@/data/services"
import { mailtoHref, projectPrompt } from "@/lib/mail"

const icons = {
  agents: Bot,
  retrieval: Search,
  product: LayoutGrid,
  local: Cpu,
  cloud: Cloud,
  quality: FileCheck2,
} as const

export function ServicesPage() {
  return (
    <>
      <section className="relative isolate overflow-hidden px-4 pb-10 pt-12 sm:px-6 sm:pt-16 lg:px-8">
        <div aria-hidden="true" className="hero-grid pointer-events-none absolute inset-0 -z-10 opacity-50" />
        <div className="mx-auto max-w-7xl">
          <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-primary">Services</p>
          <h1 className="mt-4 max-w-4xl text-balance font-serif text-5xl leading-[0.94] sm:text-7xl lg:text-[6rem]">
            Bring a problem. Leave with a running system.
          </h1>
          <p className="mt-6 max-w-2xl text-pretty text-lg leading-relaxed text-muted-foreground sm:text-xl">
            Six ways to work together, each with a clear outcome and proof behind it. Scope first,
            then a quote in rand. No price before the work is real.
          </p>
        </div>
      </section>

      <section aria-labelledby="offers-title" className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <h2 id="offers-title" className="sr-only">
          The six offers
        </h2>
        <ol className="grid gap-5 lg:grid-cols-2">
          {services.map((service, index) => {
            const Icon = icons[service.icon]
            return (
              <li key={service.id}>
                <article className="flex h-full flex-col rounded-3xl border border-border bg-card/60 p-6 transition hover:border-primary/40 sm:p-8">
                  <div className="flex items-start justify-between gap-4">
                    <span className="inline-flex size-11 items-center justify-center rounded-2xl border border-border bg-muted/40 text-primary">
                      <Icon className="size-5" aria-hidden="true" />
                    </span>
                    <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
                      0{index + 1}
                    </span>
                  </div>

                  <h3 className="mt-5 font-serif text-3xl leading-tight">{service.title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{service.outcome}</p>

                  <h4 className="mt-6 font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
                    What is included
                  </h4>
                  <ul className="mt-3 space-y-2 text-sm leading-relaxed">
                    {service.included.map((item) => (
                      <li key={item} className="flex gap-2">
                        <span aria-hidden="true" className="mt-2 size-1 shrink-0 rounded-full bg-primary" />
                        {item}
                      </li>
                    ))}
                  </ul>

                  <p className="mt-5 text-sm leading-relaxed">
                    <span className="font-semibold">Fits: </span>
                    {service.fits}
                  </p>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{service.shape}</p>

                  <div className="mt-auto flex flex-wrap items-center gap-2 border-t border-border pt-5">
                    <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
                      Proof
                    </span>
                    {service.proof.map((proof) => (
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
            )
          })}
        </ol>
      </section>

      <section aria-labelledby="engagement-title" className="border-y border-border/70 bg-card/40">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
            <div>
              <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-primary">Engagement</p>
              <h2 id="engagement-title" className="mt-3 font-serif text-4xl leading-[1.02] sm:text-5xl">
                Four ways to shape the work.
              </h2>
              <p className="mt-5 max-w-md text-sm leading-relaxed text-muted-foreground">
                The shape follows the problem. Every arrangement ends with something that runs and
                something written down.
              </p>
            </div>
            <dl className="divide-y divide-border border-y border-border">
              {engagementModels.map((model) => (
                <div key={model.id} className="grid gap-2 py-5 sm:grid-cols-[11rem_1fr] sm:gap-6">
                  <dt className="font-semibold">{model.name}</dt>
                  <dd className="text-sm leading-relaxed text-muted-foreground">
                    {model.detail}
                    <span className="mt-1 block font-mono text-[10px] uppercase tracking-[0.16em]">
                      {model.rhythm}
                    </span>
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </section>

      <section aria-labelledby="process-title" className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="max-w-3xl">
          <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-primary">Process</p>
          <h2 id="process-title" className="mt-3 font-serif text-4xl leading-[1.02] sm:text-5xl">
            Discover, design, build, prove, hand over.
          </h2>
          <p className="mt-5 text-lg leading-relaxed text-muted-foreground">
            Prove is not a slide. It is a working demo, the tests behind the claims and a handover
            pack someone else can follow.
          </p>
        </div>
        <ol className="mt-10 grid gap-4 md:grid-cols-5">
          {processSteps.map((step, index) => (
            <li key={step.id} className="rounded-3xl border border-border bg-card/60 p-5">
              <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-primary">
                0{index + 1}
              </span>
              <h3 className="mt-3 font-serif text-2xl leading-tight">{step.name}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{step.detail}</p>
            </li>
          ))}
        </ol>
      </section>

      <section aria-labelledby="honesty-title" className="border-y border-border/70 bg-card/40">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <h2 id="honesty-title" className="font-serif text-4xl sm:text-5xl">
            An honest fit matters more than a sale.
          </h2>
          <div className="mt-10 grid gap-8 md:grid-cols-3">
            {serviceHonesty.map((note) => (
              <div key={note.id}>
                <h3 className="font-mono text-[10px] uppercase tracking-[0.18em] text-primary">
                  {note.title}
                </h3>
                <ul className="mt-4 space-y-2 text-sm leading-relaxed text-muted-foreground">
                  {note.items.map((item) => (
                    <li key={item} className="border-l border-border pl-3">
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section aria-labelledby="faq-title" className="mx-auto max-w-4xl px-4 py-20 sm:px-6 lg:px-8">
        <h2 id="faq-title" className="font-serif text-4xl sm:text-5xl">
          Before you write.
        </h2>
        <div className="mt-8 border-t border-border">
          {serviceFaq.map((item) => (
            <details key={item.q} className="border-b border-border py-4">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-semibold [&::-webkit-details-marker]:hidden">
                {item.q}
                <span aria-hidden="true" className="text-xl text-primary">
                  +
                </span>
              </summary>
              <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground">{item.a}</p>
            </details>
          ))}
        </div>
      </section>

      <section className="px-4 pb-20 sm:px-6 lg:px-8">
        <div className="relative isolate mx-auto max-w-7xl overflow-hidden rounded-[2rem] border border-border bg-card px-6 py-14 sm:px-10 lg:px-16 lg:py-20">
          <div aria-hidden="true" className="hero-glow pointer-events-none absolute inset-0 -z-10 opacity-80" />
          <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-primary">Next</p>
          <h2 className="mt-4 max-w-2xl font-serif text-5xl leading-[0.98] sm:text-6xl">
            Start with the problem, not the price.
          </h2>
          <p className="mt-5 max-w-xl text-lg leading-relaxed text-muted-foreground">
            A short email is enough: what you are building, the deadline and the constraints. I will
            reply with a straight answer about fit.
          </p>
          <a
            href={mailtoHref("Project enquiry", projectPrompt)}
            className="group mt-8 inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition hover:brightness-105"
          >
            Email the brief
            <ArrowUpRight className="size-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" aria-hidden="true" />
          </a>
        </div>
      </section>
    </>
  )
}
