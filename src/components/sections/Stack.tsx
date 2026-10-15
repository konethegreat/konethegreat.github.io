import { useMemo, useState } from "react"
import { Bot, Cpu, Gauge, Network, Search, ShieldCheck, Wrench, X } from "lucide-react"
import type { LucideIcon } from "lucide-react"
import { Reveal } from "@/components/fx/Reveal"
import { TiltCard } from "@/components/fx/TiltCard"
import { Button } from "@/components/ui/button"
import { Chip } from "@/components/ui/chip"
import { SectionHeading } from "@/components/ui/section-heading"
import { aiSkills, techSkills } from "@/data/skills"
import type { SkillGroup } from "@/data/types"
import { cn } from "@/lib/utils"

const aiStyle: Record<string, { Icon: LucideIcon; tile: string; kicker: string }> = {
  agentic: { Icon: Bot, tile: "border-cyan-300/30 bg-cyan-300/10 text-cyan-200", kicker: "text-cyan-300" },
  rag: { Icon: Network, tile: "border-violet-300/30 bg-violet-300/10 text-violet-200", kicker: "text-violet-300" },
  llm: { Icon: Gauge, tile: "border-fuchsia-300/30 bg-fuchsia-300/10 text-fuchsia-200", kicker: "text-fuchsia-300" },
  eval: { Icon: ShieldCheck, tile: "border-emerald-300/30 bg-emerald-300/10 text-emerald-200", kicker: "text-emerald-300" },
  models: { Icon: Cpu, tile: "border-sky-300/30 bg-sky-300/10 text-sky-200", kicker: "text-sky-300" },
  devtools: { Icon: Wrench, tile: "border-amber-300/30 bg-amber-300/10 text-amber-200", kicker: "text-amber-300" },
}

/** Keep only the items that match; a group whose title matches keeps all of its items. */
function filterGroups(groups: SkillGroup[], query: string): SkillGroup[] {
  const q = query.trim().toLowerCase()
  if (!q) return groups
  return groups
    .map((g) => (g.title.toLowerCase().includes(q) ? g : { ...g, items: g.items.filter((i) => i.toLowerCase().includes(q)) }))
    .filter((g) => g.items.length > 0)
}

const countItems = (groups: SkillGroup[]) => groups.reduce((sum, g) => sum + g.items.length, 0)

/**
 * One chip style for every entry, so rows stay level. Long entries (like the AWS service list)
 * wrap inside their own chip instead of stretching the row.
 */
const chipClass = "max-w-full whitespace-normal py-1.5 text-left leading-snug"

export function Stack() {
  const [query, setQuery] = useState("")
  const ai = useMemo(() => filterGroups(aiSkills, query), [query])
  const tech = useMemo(() => filterGroups(techSkills, query), [query])
  const total = countItems(aiSkills) + countItems(techSkills)
  const shown = countItems(ai) + countItems(tech)

  return (
    <section id="stack" aria-labelledby="stack-title" className="section-anchor relative py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          id="stack-title"
          index="03"
          eyebrow="Stack"
          title={
            <>
              A toolbox built for <span className="text-gradient">agentic software.</span>
            </>
          }
          lead="Frontier models when they fit, local models when the data must stay home, and conventional engineering underneath: typed back-ends, tenant-isolated databases, infrastructure as code and tests that run in CI."
        />

        <Reveal>
          <div className="mb-10 flex flex-wrap items-center gap-3">
            <label className="relative block w-full sm:w-96">
              <span className="sr-only">Filter skills and tools</span>
              <Search className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-slate-400" aria-hidden="true" />
              <input
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Filter the stack: try “RAG”, “AWS”, “React”…"
                className="h-11 w-full rounded-full border border-white/12 bg-white/[0.03] pl-10 pr-4 text-sm text-foreground outline-none transition placeholder:text-slate-400 focus:border-cyan-300/60 focus:ring-2 focus:ring-cyan-300/30"
              />
            </label>
            {query && (
              <Button variant="ghost" size="sm" onClick={() => setQuery("")}>
                <X aria-hidden="true" /> Clear
              </Button>
            )}
            <p role="status" aria-live="polite" className="ml-auto font-mono text-xs text-slate-400">
              {query ? `${shown} of ${total} match` : `${total} skills and tools, ${aiSkills.length + techSkills.length} groups`}
            </p>
          </div>
        </Reveal>

        {/* ------------------------------------------------------ AI engineering */}
        {ai.length > 0 && (
          <>
            <Reveal>
              <h3 className="font-display text-2xl font-semibold tracking-tight sm:text-3xl">AI engineering</h3>
              <p className="mt-2 max-w-2xl text-muted-foreground">What I reach for when a system has to reason, retrieve, act and be trusted.</p>
            </Reveal>
            <div className="mt-7 grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
              {ai.map((group, i) => {
                const style = aiStyle[group.id] ?? aiStyle.agentic
                const { Icon } = style
                return (
                  <Reveal key={group.id} delay={(i % 3) * 0.06} className="h-full">
                    <TiltCard className="h-full" max={3}>
                      <div className="flex h-full flex-col p-6">
                        <div className="flex items-center gap-3">
                          <span className={cn("grid size-11 place-items-center rounded-xl border", style.tile)}>
                            <Icon className="size-5" aria-hidden="true" />
                          </span>
                          <div>
                            <h4 className="font-display text-xl font-semibold leading-tight">{group.title}</h4>
                            <p className={cn("font-mono text-[11px] uppercase tracking-widest", style.kicker)}>
                              {group.items.length} {group.items.length === 1 ? "item" : "items"}
                            </p>
                          </div>
                        </div>
                        {group.blurb && <p className="mt-4 text-sm leading-relaxed text-muted-foreground">{group.blurb}</p>}
                        <ul className="mt-5 flex flex-wrap gap-1.5">
                          {group.items.map((item) => (
                            <li key={item} className="max-w-full">
                              <Chip className={chipClass}>{item}</Chip>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </TiltCard>
                  </Reveal>
                )
              })}
            </div>
          </>
        )}

        {/* ---------------------------------------------------- full-stack spec sheet */}
        {tech.length > 0 && (
          <div className={ai.length > 0 ? "mt-20" : undefined}>
            <Reveal>
              <h3 className="font-display text-2xl font-semibold tracking-tight sm:text-3xl">Full-stack, cloud and quality</h3>
              <p className="mt-2 max-w-2xl text-muted-foreground">The engineering underneath the AI: languages, services, data, cloud, security and practice.</p>
            </Reveal>
            <Reveal delay={0.05}>
              <dl className="glass mt-7 divide-y divide-white/10 overflow-hidden rounded-2xl">
                {tech.map((group) => (
                  <div key={group.id} className="grid grid-cols-1 gap-3 px-5 py-5 sm:px-7 md:grid-cols-[12.5rem_minmax(0,1fr)] md:gap-8">
                    <dt className="font-mono text-xs uppercase tracking-[0.18em] text-cyan-300 md:pt-1.5">{group.title}</dt>
                    <dd>
                      <ul className="flex flex-wrap gap-1.5">
                        {group.items.map((item) => (
                          <li key={item} className="max-w-full">
                            <Chip className={chipClass}>{item}</Chip>
                          </li>
                        ))}
                      </ul>
                    </dd>
                  </div>
                ))}
              </dl>
            </Reveal>
          </div>
        )}

        {ai.length === 0 && tech.length === 0 && (
          <div className="rounded-2xl border border-dashed border-white/15 px-6 py-14 text-center">
            <p className="font-display text-xl">Nothing in the stack matches “{query}”.</p>
            <Button variant="outline" size="sm" className="mt-4" onClick={() => setQuery("")}>
              Clear the filter
            </Button>
          </div>
        )}
      </div>
    </section>
  )
}
