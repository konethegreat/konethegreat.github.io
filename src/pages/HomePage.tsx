import { ArrowUpRight } from "lucide-react"
import { FolderShelf } from "@/components/home/FolderShelf"
import { HomeHero } from "@/components/home/HomeHero"
import { LiveStrip } from "@/components/home/LiveStrip"
import { Link } from "@/components/ui/link"
import { nowItems, stats, talk } from "@/data/profile"
import { services } from "@/data/services"

const proof = stats.slice(0, 3)
const teaser = services.slice(0, 2)

export function HomePage() {
  return (
    <>
      <HomeHero />
      <LiveStrip />
      <FolderShelf />

      <section aria-labelledby="proof-title" className="border-y border-border/70 bg-card/40">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
          <h2 id="proof-title" className="sr-only">
            The short version
          </h2>
          <dl className="grid gap-8 sm:grid-cols-3">
            {proof.map((stat) => (
              <div key={stat.label}>
                <dt className="text-sm font-semibold">{stat.label}</dt>
                <dd className="mt-2">
                  <span className="block font-display text-5xl leading-none text-primary sm:text-6xl">
                    {stat.value}
                    {stat.suffix}
                  </span>
                  <span className="mt-2 block text-sm text-muted-foreground">{stat.hint}</span>
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <section aria-labelledby="services-teaser" className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
          <div>
            <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-primary">Ways to work</p>
            <h2 id="services-teaser" className="mt-3 font-serif text-4xl leading-[1.02] sm:text-5xl">
              Bring a problem. Leave with a running system.
            </h2>
            <Link
              to="/services"
              className="group mt-6 inline-flex items-center gap-2 text-sm font-semibold underline-offset-4 hover:underline"
            >
              All six services
              <ArrowUpRight className="size-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" aria-hidden="true" />
            </Link>
          </div>
          <ul className="divide-y divide-border border-y border-border">
            {teaser.map((service, index) => (
              <li key={service.id} className="grid gap-3 py-6 sm:grid-cols-[3rem_1fr] sm:gap-6">
                <span className="font-mono text-xs text-muted-foreground">0{index + 1}</span>
                <div>
                  <h3 className="text-xl font-semibold">{service.title}</h3>
                  <p className="mt-2 max-w-xl text-sm leading-relaxed text-muted-foreground">{service.outcome}</p>
                  <p className="mt-3 font-mono text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
                    {service.shape}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section aria-labelledby="now-title" className="mx-auto max-w-7xl px-4 pb-20 sm:px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
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
          </div>
          <article className="flex flex-col justify-between rounded-3xl border border-border bg-card/60 p-6 sm:p-8">
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

      <section className="px-4 pb-20 sm:px-6 lg:px-8">
        <div className="relative isolate mx-auto max-w-7xl overflow-hidden rounded-[2rem] border border-border bg-card px-6 py-14 sm:px-10 lg:px-16 lg:py-20">
          <div aria-hidden="true" className="hero-glow pointer-events-none absolute inset-0 -z-10 opacity-80" />
          <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-primary">Next</p>
          <h2 className="mt-4 max-w-2xl font-serif text-5xl leading-[0.98] sm:text-6xl lg:text-7xl">
            Tell me what you are trying to build.
          </h2>
          <p className="mt-5 max-w-xl text-lg leading-relaxed text-muted-foreground">
            A quick conversation is enough to know whether I can help, and what it would take in rand.
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
