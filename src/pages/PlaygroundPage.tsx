import { ArrowUpRight } from "lucide-react"
import { EffectsSwitch } from "@/components/playground/EffectsSwitch"
import { VaultShelf } from "@/components/playground/VaultShelf"
import { Lab } from "@/components/sections/Lab"
import { Link } from "@/components/ui/link"
import { FxProvider } from "@/lib/fx"
import { ProjectDialogProvider } from "@/lib/project-dialog"

export function PlaygroundPage() {
  return (
    <FxProvider>
      <ProjectDialogProvider>
        <section className="relative isolate overflow-hidden px-4 pb-10 pt-12 sm:px-6 sm:pt-16 lg:px-8">
          <div aria-hidden="true" className="hero-grid pointer-events-none absolute inset-0 -z-10 opacity-50" />
          <div className="mx-auto max-w-7xl">
            <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-primary">Playground</p>
            <h1 className="mt-4 max-w-4xl text-balance font-serif text-5xl leading-[0.94] sm:text-7xl lg:text-[6rem]">
              A bench for things that move.
            </h1>
            <p className="mt-6 max-w-2xl text-pretty text-lg leading-relaxed text-muted-foreground sm:text-xl">
              Working models of agents, retrieval and autonomy, plus a shelf of patterns from the UI
              Vault. Real parts say real. Scripted parts say scripted.
            </p>
          </div>
        </section>

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <EffectsSwitch />
        </div>

        <div className="theme-dark mt-10 bg-background text-foreground">
          <Lab />
        </div>

        <VaultShelf />

        <section className="px-4 pb-20 sm:px-6 lg:px-8">
          <div className="relative isolate mx-auto max-w-7xl overflow-hidden rounded-[2rem] border border-border bg-card px-6 py-12 sm:px-10 lg:px-16">
            <div aria-hidden="true" className="hero-glow pointer-events-none absolute inset-0 -z-10 opacity-70" />
            <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-primary">Next</p>
            <h2 className="mt-4 max-w-2xl font-serif text-4xl leading-[0.98] sm:text-5xl">
              The 3D workshop lives with the work.
            </h2>
            <p className="mt-4 max-w-xl text-lg leading-relaxed text-muted-foreground">
              Six stations, eight case studies and a scene you can filter by hand. It is all on the
              work page, with a static version for machines that cannot run WebGL.
            </p>
            <Link
              to="/work"
              className="group mt-8 inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition hover:brightness-105"
            >
              Open the workshop
              <ArrowUpRight className="size-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" aria-hidden="true" />
            </Link>
          </div>
        </section>
      </ProjectDialogProvider>
    </FxProvider>
  )
}
