import type { ReactNode } from "react"
import { ArrowUpRight, Award, BadgeCheck, GraduationCap, ListChecks, Mic, School, Users } from "lucide-react"
import type { LucideIcon } from "lucide-react"
import { Reveal } from "@/components/fx/Reveal"
import { TiltCard } from "@/components/fx/TiltCard"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Chip } from "@/components/ui/chip"
import { Dialog, DialogContent, DialogDescription, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { SectionHeading } from "@/components/ui/section-heading"
import { education, gaoCertificates, ibmCertificate, leadership } from "@/data/credentials"
import { roles } from "@/data/experience"
import { links, studio, talk } from "@/data/profile"
import { GithubIcon } from "@/lib/icons"
import { cn } from "@/lib/utils"

const educationIcons: Record<string, LucideIcon> = { GraduationCap, School }

/**
 * The credentials column follows you down the long experience timeline on tall screens. On a short
 * screen it would not fit, so it only sticks when there is room.
 */
const stickyOnTall = "lg:[@media(min-height:780px)]:sticky lg:[@media(min-height:780px)]:top-24"

export function Career() {
  return (
    <section id="career" aria-labelledby="career-title" className="section-anchor relative py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          id="career-title"
          index="05"
          eyebrow="Career"
          title={
            <>
              Where I have worked, <span className="text-gradient">and what I have earned.</span>
            </>
          }
          lead="A founding-engineer role inside a law, forensics and advisory firm, an independent studio of my own, and a remote leadership internship before that. Credentials sit alongside."
        />

        <div className="grid grid-cols-1 gap-12 lg:grid-cols-[minmax(0,1.3fr)_minmax(0,0.9fr)] lg:gap-14">
          {/* ------------------------------------------------------ experience */}
          <div>
            <Reveal>
              <h3 className="font-display text-2xl font-semibold tracking-tight sm:text-3xl">Experience</h3>
            </Reveal>
            <ol className="relative mt-8 space-y-6 pl-8 sm:pl-10">
              <span
                aria-hidden="true"
                className="absolute bottom-3 left-[5px] top-3 w-px bg-gradient-to-b from-cyan-400/70 via-violet-400/40 to-white/5 sm:left-[7px]"
              />
              {roles.map((role) => (
                <li key={role.id} className="relative">
                  <span
                    aria-hidden="true"
                    className={cn(
                      "absolute -left-8 top-8 size-3 rounded-full border-2 border-[#05060d] sm:-left-10 sm:size-3.5",
                      role.current ? "bg-emerald-400 shadow-[0_0_0_4px_rgb(52_211_153/0.18)]" : "bg-slate-400",
                    )}
                  />
                  <Reveal>
                    <article className="glass rounded-2xl p-6 sm:p-7">
                      <div className="flex flex-wrap items-center gap-2">
                        {role.current && (
                          <Badge variant="live" className="font-mono text-[11px] font-medium uppercase tracking-wider">
                            Current
                          </Badge>
                        )}
                        <span className="font-mono text-xs text-slate-400">{role.period}</span>
                      </div>
                      <h4 className="mt-3 font-display text-2xl font-semibold leading-tight tracking-tight">{role.title}</h4>
                      <p className="mt-1 text-muted-foreground">
                        <span className="font-medium text-foreground">{role.org}</span> · {role.place}
                      </p>
                      {role.summary && <p className="mt-3 text-sm leading-relaxed text-slate-300">{role.summary}</p>}

                      <ul className="mt-5 space-y-4">
                        {role.bullets.map((b) => (
                          <li key={b.lead} className="flex gap-3">
                            <span aria-hidden="true" className="mt-2 size-1.5 shrink-0 rounded-full bg-[image:var(--grad)]" />
                            <p className="text-sm leading-relaxed text-muted-foreground">
                              <span className="font-semibold text-foreground">{b.lead}.</span> {b.text}
                            </p>
                          </li>
                        ))}
                      </ul>

                      {role.id === "kone" && <StudioWorks />}
                    </article>
                  </Reveal>
                </li>
              ))}
            </ol>
          </div>

          {/* ----------------------------------------------------- credentials */}
          <div>
            <Reveal>
              <h3 className="font-display text-2xl font-semibold tracking-tight sm:text-3xl">Education and credentials</h3>
            </Reveal>
            <div className={cn("mt-8 space-y-5", stickyOnTall)}>
              <Reveal>
                <Panel title="Education" icon={GraduationCap}>
                  <ul className="space-y-4">
                    {education.map((e) => {
                      const Icon = educationIcons[e.icon] ?? GraduationCap
                      return (
                        <li key={e.title} className="flex gap-3">
                          <Icon className="mt-0.5 size-4 shrink-0 text-cyan-300" aria-hidden="true" />
                          <div>
                            <p className="text-[15px] font-medium leading-snug text-foreground">{e.title}</p>
                            <p className="text-sm text-muted-foreground">{e.org}</p>
                            <p className="font-mono text-xs text-slate-400">{e.period}</p>
                          </div>
                        </li>
                      )
                    })}
                  </ul>
                </Panel>
              </Reveal>

              <Reveal delay={0.05}>
                <Panel title="Professional certificate" icon={Award} accent>
                  <p className="font-display text-xl font-semibold leading-snug">{ibmCertificate.title}</p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {ibmCertificate.issuer} · {ibmCertificate.detail}
                  </p>
                  <div className="mt-4 flex flex-wrap gap-2.5">
                    <Button asChild variant="outline" size="sm">
                      <a href={ibmCertificate.verify} target="_blank" rel="noopener noreferrer">
                        <BadgeCheck aria-hidden="true" /> Verify on Coursera
                        <span className="sr-only"> (opens in a new tab)</span>
                      </a>
                    </Button>
                    <Button asChild variant="outline" size="sm">
                      <a href={links.credly} target="_blank" rel="noopener noreferrer">
                        Credly badges <ArrowUpRight aria-hidden="true" />
                        <span className="sr-only"> (opens in a new tab)</span>
                      </a>
                    </Button>
                    <CoursesDialog />
                  </div>
                </Panel>
              </Reveal>

              <Reveal delay={0.05}>
                <Panel title="GAO Tek certificates" icon={Users}>
                  <ul className="space-y-2.5">
                    {gaoCertificates.map((c) => (
                      <li key={c} className="flex gap-2.5 text-sm text-muted-foreground">
                        <BadgeCheck className="mt-0.5 size-4 shrink-0 text-emerald-300" aria-hidden="true" />
                        {c}
                      </li>
                    ))}
                  </ul>
                </Panel>
              </Reveal>
            </div>
          </div>
        </div>

        {/* -------------------------------------------- leadership and keynote */}
        <div className="mt-14 grid grid-cols-1 gap-5 md:grid-cols-2 lg:mt-16">
          <Reveal className="h-full">
            <Panel title="Leadership" icon={Users} className="h-full">
              <ul className="space-y-4">
                {leadership.map((l) => (
                  <li key={l.title}>
                    <p className="text-[15px] font-medium leading-snug text-foreground">{l.title}</p>
                    <p className="font-mono text-xs text-slate-400">{l.org}</p>
                    <p className="mt-1 text-sm text-muted-foreground">{l.detail}</p>
                  </li>
                ))}
              </ul>
            </Panel>
          </Reveal>

          <Reveal delay={0.05} className="h-full">
            <TiltCard max={2} className="h-full">
              <div className="relative h-full overflow-hidden rounded-2xl p-6">
                <div
                  aria-hidden="true"
                  className="absolute -right-10 -top-10 size-40 rounded-full bg-[radial-gradient(closest-side,rgba(244,114,182,0.3),transparent)]"
                />
                <div className="relative">
                  <div className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.2em] text-fuchsia-300">
                    <Mic className="size-4" aria-hidden="true" /> {talk.kind} · {talk.when}
                  </div>
                  <p className="mt-3 font-display text-2xl font-semibold leading-snug tracking-tight">{talk.title}</p>
                  <p className="mt-1 text-sm text-slate-400">{talk.audience}</p>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{talk.blurb}</p>
                </div>
              </div>
            </TiltCard>
          </Reveal>
        </div>
      </div>
    </section>
  )
}

function Panel({
  title,
  icon: Icon,
  accent = false,
  className,
  children,
}: {
  title: string
  icon: LucideIcon
  accent?: boolean
  className?: string
  children: ReactNode
}) {
  return (
    <TiltCard max={2} className={cn(accent && "border-cyan-300/20", className)}>
      <div className="p-6">
        <h4 className="mb-4 flex items-center gap-2.5 font-mono text-[11px] font-medium uppercase tracking-[0.2em] text-cyan-300">
          <Icon className="size-4" aria-hidden="true" /> {title}
        </h4>
        {children}
      </div>
    </TiltCard>
  )
}

/** The course list lives in a dialog so the credentials column keeps a fixed height. */
function CoursesDialog() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <ListChecks aria-hidden="true" /> Courses
        </Button>
      </DialogTrigger>
      <DialogContent variant="modal" closeLabel="Close the course list" className="w-[min(94vw,38rem)]">
        <div className="p-6 pr-14 sm:p-8 sm:pr-16">
          <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-cyan-300">{ibmCertificate.issuer}</p>
          <DialogTitle className="mt-2 text-2xl leading-snug">{ibmCertificate.title}</DialogTitle>
          <DialogDescription className="mt-2">
            {ibmCertificate.detail}. Courses include the ones below, finishing with the capstone.
          </DialogDescription>
          <ul className="mt-6 space-y-2.5 text-sm text-muted-foreground">
            {ibmCertificate.courses.map((c) => (
              <li key={c} className="flex gap-2.5">
                <span aria-hidden="true" className="mt-2 size-1 shrink-0 rounded-full bg-cyan-300" />
                {c}
              </li>
            ))}
            <li className="flex gap-2.5 pt-1 text-slate-200">
              <span aria-hidden="true" className="mt-2 size-1 shrink-0 rounded-full bg-fuchsia-300" />
              Capstone: {ibmCertificate.capstone}
            </li>
          </ul>
          <div className="mt-7 flex flex-wrap gap-2.5">
            <Button asChild variant="outline" size="sm">
              <a href={ibmCertificate.verify} target="_blank" rel="noopener noreferrer">
                <BadgeCheck aria-hidden="true" /> Verify on Coursera
                <span className="sr-only"> (opens in a new tab)</span>
              </a>
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

function StudioWorks() {
  return (
    <div className="mt-6 border-t border-white/10 pt-5">
      <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-slate-400">Shipped by the studio</p>
      <ul className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-3">
        {studio.works.map((w) => (
          <li key={w.title}>
            <a
              href={w.href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`${w.title}: source on GitHub (opens in a new tab)`}
              className="group flex h-full flex-col rounded-xl border border-white/10 bg-white/[0.03] p-4 transition hover:border-cyan-300/40 hover:bg-white/[0.06]"
            >
              <span className="flex items-center justify-between gap-2 text-sm font-medium text-foreground">
                {w.title}
                <GithubIcon className="size-4 shrink-0 text-slate-400 transition group-hover:text-cyan-300" />
              </span>
              <span className="mt-1 text-xs leading-relaxed text-muted-foreground">{w.detail}</span>
              <span className="mt-3 flex flex-wrap gap-1.5">
                {w.stack.map((s) => (
                  <Chip key={s}>{s}</Chip>
                ))}
              </span>
            </a>
          </li>
        ))}
      </ul>
    </div>
  )
}
