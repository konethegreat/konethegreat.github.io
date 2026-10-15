import { Children, type ReactNode } from "react"
import { ArrowUpRight, Lock } from "lucide-react"
import { Reveal } from "@/components/fx/Reveal"
import { TiltCard } from "@/components/fx/TiltCard"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Chip } from "@/components/ui/chip"
import { SectionHeading } from "@/components/ui/section-heading"
import { accounts, githubSnapshot, hygiene, langColor, repoMeta } from "@/data/github"
import { links } from "@/data/profile"
import { projectBySlug, projects } from "@/data/projects"
import type { Project } from "@/data/types"
import { GithubIcon } from "@/lib/icons"
import { useProjects } from "@/lib/project-dialog"
import { cn } from "@/lib/utils"

const toneDot: Record<Project["status"]["tone"], string> = {
  live: "bg-emerald-400",
  code: "bg-cyan-400",
  wip: "bg-amber-300",
  private: "bg-violet-400",
  muted: "bg-slate-400",
}

/** Every public repository on konethegreat that a project card links to, in project order. */
const personalRepos = projects.flatMap((p) =>
  p.links
    .filter((l) => l.kind === "code" && l.href.startsWith(`${links.githubPersonal}/`))
    .map((l) => ({
      repo: l.href.slice(links.githubPersonal.length + 1),
      href: l.href,
      project: p,
      subtitle: p.title,
    })),
)
const personalProjects = personalRepos.filter((r) => r.project.group !== "coursework")
const personalCoursework = personalRepos.filter((r) => r.project.group === "coursework")

const orgProjects = projects.filter((p) => p.home === "org")
const vigil = projectBySlug("vigil")

export function GitHub() {
  return (
    <section id="github" aria-labelledby="github-title" className="section-anchor relative py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          id="github-title"
          index="06"
          eyebrow="GitHub"
          title={
            <>
              Two accounts, <span className="text-gradient">one body of work.</span>
            </>
          }
          lead={`I keep two GitHub accounts on purpose: konethegreatest for the firm's platforms and Vigil, konethegreat for my public projects and coursework. Repository facts are a snapshot from ${githubSnapshot}.`}
        />

        <div className="grid grid-cols-1 items-stretch gap-6 lg:grid-cols-2">
          <Reveal className="h-full">
            <AccountCard account={accounts.primary} tone="primary">
              {vigil && (
                <Terminal title="konethegreatest · own repositories">
                  <ProjectRow project={vigil} />
                </Terminal>
              )}
              <div className="mt-4">
                <Terminal title="motsoeneng-bill-tech · private">
                  {orgProjects.map((p) => (
                    <ProjectRow key={p.slug} project={p} />
                  ))}
                </Terminal>
              </div>
              <p className="mt-4 flex items-start gap-2 text-xs leading-relaxed text-muted-foreground">
                <Lock className="mt-0.5 size-3.5 shrink-0 text-violet-300" aria-hidden="true" />
                Private means private: open a row for the case study, honest status and what can be shared. The one public organisation
                repository is the delivery-telemetry profile.
              </p>

              <div className="mt-6 rounded-2xl border border-white/10 bg-white/[0.02] p-5">
                <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-cyan-300">How I keep repositories trustworthy</p>
                <ul className="mt-3 flex flex-wrap gap-1.5">
                  {hygiene.map((h) => (
                    <li key={h} className="max-w-full">
                      <Chip className="max-w-full whitespace-normal py-1.5 text-left leading-snug">{h}</Chip>
                    </li>
                  ))}
                </ul>
              </div>
            </AccountCard>
          </Reveal>

          <Reveal delay={0.06} className="h-full">
            <AccountCard account={accounts.personal} tone="personal">
              <Terminal title="konethegreat · public repositories">
                {personalProjects.map((r) => (
                  <RepoRow key={r.repo} {...r} />
                ))}
                <p className="px-3 pb-1 pt-4 font-mono text-[10px] uppercase tracking-[0.2em] text-slate-400"># IBM coursework</p>
                {personalCoursework.map((r) => (
                  <RepoRow key={r.repo} {...r} />
                ))}
              </Terminal>
            </AccountCard>
          </Reveal>
        </div>
      </div>
    </section>
  )
}

function AccountCard({
  account,
  tone,
  children,
}: {
  account: (typeof accounts)[keyof typeof accounts]
  tone: "primary" | "personal"
  children: ReactNode
}) {
  return (
    <TiltCard max={0} className="h-full">
      <div className="flex h-full flex-col p-6 sm:p-7">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <a
            href={account.href}
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex min-w-0 items-center gap-3 font-display text-xl font-semibold tracking-tight sm:text-2xl"
          >
            <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-[image:var(--grad)] text-[#05060d] sm:size-11">
              <GithubIcon className="size-6" />
            </span>
            <span>
              <span className="text-slate-400">@</span>
              {account.handle}
              <span className="sr-only"> on GitHub (opens in a new tab)</span>
            </span>
            <ArrowUpRight className="hidden size-5 text-slate-400 transition group-hover:text-cyan-300 sm:block" aria-hidden="true" />
          </a>
          <Badge variant={tone === "primary" ? "live" : "code"} className="font-mono text-[11px] font-medium uppercase tracking-wider">
            {account.badge}
          </Badge>
        </div>

        <p className="mt-5 text-[15px] leading-relaxed text-muted-foreground">{account.blurb}</p>

        <dl className="mt-5 grid grid-cols-1 gap-x-6 gap-y-3 sm:grid-cols-2">
          {account.facts.map((f) => (
            <div key={f.label} className={cn("rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3", f.label.length > 18 && "sm:col-span-2")}>
              <dt className="font-mono text-[10px] uppercase tracking-[0.18em] text-slate-400">{f.label}</dt>
              <dd className="mt-0.5 text-sm text-foreground">{f.value}</dd>
            </div>
          ))}
        </dl>

        <div className="mt-6">{children}</div>

        <div className="mt-auto pt-6">
          <Button asChild variant="outline" size="sm">
            <a href={account.href} target="_blank" rel="noopener noreferrer">
              <GithubIcon className="size-4" /> Open @{account.handle}
              <ArrowUpRight aria-hidden="true" />
              <span className="sr-only"> (opens in a new tab)</span>
            </a>
          </Button>
        </div>
      </div>
    </TiltCard>
  )
}

function Terminal({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="overflow-hidden rounded-2xl border border-white/10 bg-[#070916]/85">
      <div className="flex items-center gap-1.5 border-b border-white/10 px-4 py-2.5">
        <span className="size-2.5 rounded-full bg-rose-400/80" aria-hidden="true" />
        <span className="size-2.5 rounded-full bg-amber-300/80" aria-hidden="true" />
        <span className="size-2.5 rounded-full bg-emerald-400/80" aria-hidden="true" />
        <span className="ml-2 truncate font-mono text-xs text-slate-400">{title}</span>
      </div>
      <ul className="p-2">
        {Children.toArray(children).map((child, i) => (
          <li key={i}>{child}</li>
        ))}
      </ul>
    </div>
  )
}

function ProjectRow({ project }: { project: Project }) {
  const { openProject } = useProjects()
  const isPublicLink = project.slug === "telemetry"
  return (
    <button
      type="button"
      onClick={() => openProject(project.slug)}
      className="group flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left transition hover:bg-white/[0.05]"
    >
      <span className={cn("size-2 shrink-0 rounded-full", toneDot[project.status.tone])} aria-hidden="true" />
      <span className="min-w-0 flex-1">
        <span className="block truncate text-sm font-medium text-foreground">
          {project.title}
          {isPublicLink && <span className="ml-2 font-mono text-[10px] uppercase tracking-wider text-cyan-300">public</span>}
        </span>
        <span className="block truncate text-xs text-muted-foreground">
          {project.kicker} · {project.status.label}
        </span>
      </span>
      <ArrowUpRight className="size-3.5 shrink-0 text-slate-400 transition group-hover:text-cyan-300" aria-hidden="true" />
    </button>
  )
}

function RepoRow({ repo, href, subtitle, project }: { repo: string; href: string; subtitle: string; project: Project }) {
  const meta = repoMeta[repo]
  const live = project.links.some((l) => l.kind === "live")
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex items-center gap-3 rounded-lg px-3 py-2 transition hover:bg-white/[0.05]"
    >
      <span
        className="size-2.5 shrink-0 rounded-full"
        style={{ backgroundColor: meta ? langColor[meta.lang] : "#94a3b8" }}
        aria-hidden="true"
      />
      <span className="min-w-0 flex-1">
        <span className="block truncate font-mono text-[13px] text-cyan-200">
          {repo}
          <span className="sr-only"> (opens on GitHub in a new tab)</span>
        </span>
        <span className="block truncate text-xs text-muted-foreground">{subtitle}</span>
      </span>
      <span className="flex shrink-0 items-center gap-2 text-[11px] text-slate-400">
        {live && (
          <Badge variant="live" className="px-2 py-0 font-mono text-[10px] uppercase tracking-wider">
            Live
          </Badge>
        )}
        {meta?.fork && <Chip className="text-[10px]">fork</Chip>}
        <span className="hidden sm:inline">{meta?.lang}</span>
      </span>
      <ArrowUpRight className="size-3.5 shrink-0 text-slate-400 transition group-hover:text-cyan-300" aria-hidden="true" />
    </a>
  )
}
