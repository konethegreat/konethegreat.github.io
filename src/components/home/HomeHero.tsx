import { ArrowDownRight, MapPin } from "lucide-react"
import { MascotFigure } from "@/components/home/MascotFigure"
import { Link } from "@/components/ui/link"
import { buildEmail } from "@/data/profile"

export function HomeHero() {
  return (
    <section className="relative isolate overflow-hidden px-4 pb-16 pt-10 sm:px-6 sm:pt-16 lg:px-8 lg:pb-24">
      <div aria-hidden="true" className="hero-glow pointer-events-none absolute inset-0 -z-10" />
      <div aria-hidden="true" className="hero-grid pointer-events-none absolute inset-0 -z-10 opacity-60" />

      <div className="mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-[1.15fr_0.85fr] lg:gap-6">
        <div className="relative">
          <div className="flex flex-wrap items-center gap-3 font-mono text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
            <span className="inline-flex items-center gap-2">
              <span className="relative flex size-2">
                <span className="absolute inline-flex size-full animate-ping-soft rounded-full bg-teal/70" />
                <span className="relative inline-flex size-2 rounded-full bg-teal" />
              </span>
              Available for select work
            </span>
            <span aria-hidden="true" className="text-border">/</span>
            <span className="inline-flex items-center gap-1.5">
              <MapPin className="size-3" aria-hidden="true" /> Johannesburg
            </span>
          </div>

          <h1 className="mt-6 text-balance">
            <span className="block font-serif text-6xl italic leading-[0.82] tracking-[-0.02em] sm:text-8xl lg:text-[7.5rem]">
              Kone
            </span>
            <span className="mt-1 block font-display text-[13vw] uppercase leading-[0.82] tracking-[-0.035em] sm:text-[9rem] lg:text-[8.5rem]">
              Tshivhinda
            </span>
          </h1>

          <p className="mt-7 max-w-xl text-pretty text-lg leading-relaxed text-muted-foreground sm:text-xl">
            I build agent-driven software that shows its evidence, earns its autonomy and leaves the
            consequential decisions to a person. Johannesburg, mostly solo, always in the open.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Link
              to="/work"
              className="group inline-flex items-center gap-2 rounded-full bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground transition hover:brightness-105"
            >
              See the work
              <ArrowDownRight className="size-4 transition-transform group-hover:translate-x-0.5 group-hover:translate-y-0.5" aria-hidden="true" />
            </Link>
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 rounded-full border border-border px-5 py-3 text-sm font-semibold transition hover:bg-accent"
            >
              Start a conversation
            </Link>
            <a
              href={`mailto:${buildEmail()}`}
              className="hidden text-sm text-muted-foreground underline-offset-4 hover:text-foreground hover:underline sm:inline"
            >
              {buildEmail()}
            </a>
          </div>

          <p className="mt-10 max-w-sm border-l-2 border-primary/40 pl-4 font-mono text-[11px] uppercase leading-relaxed tracking-[0.14em] text-muted-foreground">
            Press Ctrl K for the index. Everything here opens into a case study, a live site or a
            repository.
          </p>
        </div>

        <div className="relative mx-auto w-full max-w-[30rem] lg:justify-self-end">
          <div aria-hidden="true" className="hero-ring absolute inset-[6%] rounded-full border border-primary/30" />
          <div aria-hidden="true" className="hero-ring-reverse absolute inset-[1%] rounded-full border border-dashed border-border" />
          <div aria-hidden="true" className="absolute inset-[12%] rounded-full bg-[radial-gradient(circle_at_50%_35%,color-mix(in_oklab,var(--primary)_18%,transparent),transparent_65%)]" />
          <span className="absolute -right-2 top-[12%] z-10 hidden rounded-full border border-border bg-card/90 px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground shadow-sm backdrop-blur sm:block">
            Est. Johannesburg
          </span>
          <MascotFigure className="relative z-[1] px-6 pb-4 pt-16 sm:px-10" />
          <span className="absolute bottom-[8%] left-0 z-10 rounded-full border border-border bg-card/90 px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground shadow-sm backdrop-blur">
            Human in the loop
          </span>
        </div>
      </div>

      <div className="mx-auto mt-14 flex max-w-7xl flex-wrap items-end justify-between gap-4 border-t border-border/70 pt-5 font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
        <span>Portfolio 2026</span>
        <span className="hidden sm:inline">Agents / retrieval / local-first / product</span>
        <a href="#live" className="inline-flex items-center gap-1.5 hover:text-foreground">
          Scroll to the live work <ArrowDownRight className="size-3" aria-hidden="true" />
        </a>
      </div>
    </section>
  )
}
