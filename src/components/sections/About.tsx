import { MapPin } from "lucide-react"
import { Reveal } from "@/components/fx/Reveal"
import { TiltCard } from "@/components/fx/TiltCard"
import { Photo } from "@/components/ui/photo"
import { SectionHeading } from "@/components/ui/section-heading"
import { aboutParagraphs, languages, moreNumbers, principles } from "@/data/profile"
import { useProjects } from "@/lib/project-dialog"

export function About() {
  const { openProject } = useProjects()

  return (
    <section id="about" aria-labelledby="about-title" className="section-anchor relative py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          id="about-title"
          index="01"
          eyebrow="About"
          title={
            <>
              Engineer by trade, <span className="text-gradient">builder by habit.</span>
            </>
          }
        />

        <div className="grid grid-cols-1 items-start gap-12 lg:grid-cols-[minmax(0,0.78fr)_minmax(0,1.22fr)] lg:gap-16">
          <Reveal className="mx-auto w-full max-w-sm lg:mx-0 lg:max-w-none">
            <figure className="relative">
              <div className="rounded-[1.75rem] bg-[image:var(--grad)] p-[1.5px] shadow-[0_30px_90px_-40px_rgb(139_92_246/0.8)]">
                <div className="relative overflow-hidden rounded-[calc(1.75rem-1.5px)] bg-[#0a0d1b]">
                  <Photo
                    name="portrait-alt"
                    alt="Kone Tshivhinda in a navy blazer, standing against a sunlit wall with trailing greenery above"
                    sizes="(min-width: 1024px) 30rem, 90vw"
                    className="aspect-[4/5] w-full object-cover object-[50%_22%]"
                  />
                  <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-[#05060d]/80 via-transparent to-transparent" />
                  <figcaption className="absolute inset-x-4 bottom-4 flex flex-wrap items-center gap-2 text-xs">
                    <span className="glass-strong inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-slate-200">
                      <MapPin className="size-3.5 text-cyan-300" aria-hidden="true" /> Johannesburg, South Africa
                    </span>
                  </figcaption>
                </div>
              </div>
            </figure>

            <div className="mt-6 overflow-hidden rounded-2xl border border-white/10 bg-[#070916]/80 font-mono text-[13px] shadow-[0_20px_60px_-30px_rgb(34_211_238/0.5)]">
              <div className="flex items-center gap-1.5 border-b border-white/10 px-4 py-2.5">
                <span className="size-2.5 rounded-full bg-rose-400/80" aria-hidden="true" />
                <span className="size-2.5 rounded-full bg-amber-300/80" aria-hidden="true" />
                <span className="size-2.5 rounded-full bg-emerald-400/80" aria-hidden="true" />
                <span className="ml-2 text-xs text-slate-400">agent-loop.sh</span>
              </div>
              <div className="space-y-1.5 px-4 py-4 text-slate-300">
                <p>
                  <span className="text-cyan-300">$</span> plan <span className="text-slate-400">→</span> act{" "}
                  <span className="text-slate-400">→</span> verify <span className="text-slate-400">→</span> retry
                </p>
                <p className="text-emerald-300">✓ cited sources only</p>
                <p className="text-emerald-300">✓ usage capped, cost visible</p>
                <p className="text-amber-200">! human sign-off required</p>
                <p>
                  <span className="text-cyan-300">$</span>
                  <span className="fx-anim ml-1 inline-block h-4 w-2 translate-y-0.5 animate-blink bg-cyan-300" aria-hidden="true" />
                </p>
              </div>
            </div>
          </Reveal>

          <div className="space-y-6">
            {aboutParagraphs.map((text, i) => (
              <Reveal key={i} delay={i * 0.06}>
                <p className={i === 0 ? "text-xl leading-relaxed text-foreground sm:text-2xl" : "text-base leading-relaxed text-muted-foreground sm:text-lg"}>
                  {text}
                </p>
              </Reveal>
            ))}

            <Reveal delay={0.12}>
              <div className="mt-2 grid grid-cols-1 gap-3 sm:grid-cols-3">
                {languages.map((lang) => (
                  <div key={lang.name} className="glass rounded-xl px-4 py-3">
                    <p className="text-sm font-medium text-foreground">{lang.name}</p>
                    <p className="mt-1 flex items-center gap-2 text-xs text-muted-foreground">
                      <span className="flex gap-1" aria-hidden="true">
                        {[1, 2, 3, 4].map((d) => (
                          <span
                            key={d}
                            className={`h-1.5 w-4 rounded-full ${d <= lang.dots ? "bg-[image:var(--grad)]" : "bg-white/10"}`}
                          />
                        ))}
                      </span>
                      {lang.level}
                    </p>
                  </div>
                ))}
              </div>
            </Reveal>

            <Reveal delay={0.16}>
              <ul className="grid grid-cols-2 gap-3 sm:grid-cols-4" aria-label="By the numbers">
                {moreNumbers.map((n) => (
                  <li key={n.label} className="rounded-xl border border-white/10 bg-white/[0.02] px-4 py-3">
                    <p className="font-display text-3xl font-semibold text-gradient">{n.value}</p>
                    <p className="mt-1 text-xs leading-snug text-muted-foreground">{n.label}</p>
                  </li>
                ))}
              </ul>
            </Reveal>
          </div>
        </div>

        <div className="mt-24">
          <Reveal>
            <h3 className="font-display text-3xl font-semibold tracking-tight sm:text-4xl">How I work</h3>
            <p className="mt-3 max-w-2xl text-muted-foreground">
              Four rules I hold every system to. The chips are the projects where you can see each one at work.
            </p>
          </Reveal>
          <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-2">
            {principles.map((p, i) => (
              <Reveal key={p.id} delay={i * 0.05}>
                <TiltCard className="h-full" max={3}>
                  <div className="flex h-full flex-col p-6 sm:p-7">
                    <div className="flex items-baseline justify-between">
                      <span className="font-mono text-xs text-slate-400">{String(i + 1).padStart(2, "0")}</span>
                      <span className="font-mono text-[11px] uppercase tracking-widest text-cyan-300">{p.line}</span>
                    </div>
                    <h4 className="mt-4 font-display text-2xl font-semibold tracking-tight">{p.title}</h4>
                    <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{p.body}</p>
                    <ul className="mt-5 flex flex-wrap gap-2" aria-label={`Projects that show: ${p.title}`}>
                      {p.proof.map((proof) => (
                        <li key={proof.slug + proof.label}>
                          <button
                            type="button"
                            onClick={() => openProject(proof.slug)}
                            className="rounded-full border border-white/12 bg-white/[0.04] px-3 py-1 font-mono text-[11px] text-slate-200 transition hover:border-cyan-300/50 hover:bg-cyan-300/10 hover:text-cyan-100"
                          >
                            {proof.label}
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>
                </TiltCard>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
