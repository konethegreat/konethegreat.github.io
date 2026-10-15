import { useMemo, useState } from "react"
import { ChevronDown, ChevronUp, Lock, Search, X } from "lucide-react"
import { Reveal } from "@/components/fx/Reveal"
import { SectionHeading } from "@/components/ui/section-heading"
import { Button } from "@/components/ui/button"
import { archiveProjects, featuredProjects, groupBlurbs, groupLabels } from "@/data/projects"
import type { ProjectGroup } from "@/data/types"
import { CompactCard, FeatureCard } from "./ProjectCards"
import { useMediaQuery } from "@/lib/hooks"
import { cn } from "@/lib/utils"

const legend = [
  { dot: "bg-emerald-400", label: "Live", text: "running today" },
  { dot: "bg-cyan-400", label: "Public source", text: "code you can read" },
  { dot: "bg-violet-400", label: "Private or local", text: "no public code" },
  { dot: "bg-slate-400", label: "Coursework", text: "IBM capstones" },
]

/** On a phone the archive is one long column, so it opens with this many cards and a button for the rest. */
const PHONE_LIMIT = 6

const groups: ("all" | ProjectGroup)[] = ["all", "ai", "web-civic", "coursework"]

/** Three columns on wide screens only when the cards fill the rows evenly; otherwise two, so no card is left alone on the last row. */
const featuredColumns = featuredProjects.length % 3 === 0 ? "xl:grid-cols-3" : "xl:grid-cols-2"

export function Work() {
  return (
    <section id="work" aria-labelledby="work-title" className="section-anchor relative py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          id="work-title"
          index="02"
          eyebrow="Selected work"
          title={
            <>
              Systems that <span className="text-gradient">think, cite and hand over.</span>
            </>
          }
          lead="Systems I built on my own, from a sovereign intelligence platform to a job-hunting desktop agent, a live municipal service-delivery site and an AI-coached diary. Open any card for the case study, honest status and links."
        />

        <Reveal>
          <ul className="mb-8 flex flex-wrap gap-x-6 gap-y-2 text-xs text-muted-foreground" aria-label="Status legend">
            {legend.map((l) => (
              <li key={l.label} className="inline-flex items-center gap-2">
                <span className={cn("size-2 rounded-full", l.dot)} aria-hidden="true" />
                <span className="font-medium text-slate-200">{l.label}</span> {l.text}
              </li>
            ))}
          </ul>
        </Reveal>

        <div className={cn("grid grid-cols-1 gap-5 md:grid-cols-2", featuredColumns)}>
          {featuredProjects.map((p, i) => (
            <Reveal key={p.slug} delay={(i % 3) * 0.06} className="h-full">
              <FeatureCard project={p} flagship={p.slug === "vigil"} />
            </Reveal>
          ))}
        </div>

        <p className="mt-6 flex items-start gap-2 text-xs leading-relaxed text-muted-foreground">
          <Lock className="mt-0.5 size-3.5 shrink-0 text-violet-300" aria-hidden="true" />
          Vigil is the one private project here, so its card is a case study without a code link. The rest link to public source
          or a live site; the status labels say which.
        </p>

        <Archive />
      </div>
    </section>
  )
}

function Archive() {
  const [group, setGroup] = useState<"all" | ProjectGroup>("all")
  const [query, setQuery] = useState("")
  const [liveOnly, setLiveOnly] = useState(false)
  const [codeOnly, setCodeOnly] = useState(false)

  const counts = useMemo(() => {
    const map: Record<string, number> = { all: archiveProjects.length }
    for (const p of archiveProjects) map[p.group] = (map[p.group] ?? 0) + 1
    return map
  }, [])

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return archiveProjects.filter((p) => {
      if (group !== "all" && p.group !== group) return false
      if (liveOnly && !p.links.some((l) => l.kind === "live")) return false
      if (codeOnly && !p.links.some((l) => l.kind === "code")) return false
      if (!q) return true
      const haystack = [p.title, p.kicker, p.pitch, p.role, p.status.label, ...p.stack, ...p.tags].join(" ").toLowerCase()
      return q.split(/\s+/).every((term) => haystack.includes(term))
    })
  }, [group, query, liveOnly, codeOnly])

  const reset = () => {
    setGroup("all")
    setQuery("")
    setLiveOnly(false)
    setCodeOnly(false)
  }
  const dirty = group !== "all" || query !== "" || liveOnly || codeOnly

  // Filtering always shows every match; the cap only applies to the unfiltered list on small screens.
  const wide = useMediaQuery("(min-width: 768px)", true)
  const [expanded, setExpanded] = useState(false)
  const capped = !wide && !dirty && !expanded && filtered.length > PHONE_LIMIT
  const visible = capped ? filtered.slice(0, PHONE_LIMIT) : filtered
  const canToggle = !wide && !dirty && filtered.length > PHONE_LIMIT
  const toggle = () => {
    if (expanded) document.getElementById("archive")?.scrollIntoView({ block: "start" })
    setExpanded((v) => !v)
  }

  return (
    <div className="mt-24" id="archive">
      <Reveal>
        <h3 className="font-display text-3xl font-semibold tracking-tight sm:text-4xl">
          Everything else I have built
        </h3>
        <p className="mt-3 max-w-3xl text-muted-foreground">
          The rest of the archive: an offline AI report writer, the TimeLex legal-tech prototypes, studio work, a UI component
          library and my IBM capstones.
        </p>
      </Reveal>

      <div className="mt-8 space-y-4">
        <div className="flex flex-wrap gap-2" role="group" aria-label="Filter by category">
          {groups.map((g) => (
            <button
              key={g}
              type="button"
              aria-pressed={group === g}
              onClick={() => setGroup(g)}
              className={cn(
                "rounded-full border px-3.5 py-1.5 text-sm transition",
                group === g
                  ? "border-transparent bg-[image:var(--grad)] font-semibold text-[#05060d]"
                  : "border-white/12 bg-white/[0.03] text-slate-300 hover:border-white/30 hover:text-white",
              )}
              title={g === "all" ? "Everything in the archive" : groupBlurbs[g]}
            >
              {g === "all" ? "All" : groupLabels[g]}
              <span className={cn("ml-1.5 font-mono text-xs", group === g ? "text-[#05060d]" : "text-slate-400")}>
                {counts[g] ?? 0}
              </span>
            </button>
          ))}
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <label className="relative block w-full sm:w-80">
            <span className="sr-only">Search projects, technologies and tags</span>
            <Search className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-slate-400" aria-hidden="true" />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search tech, tags, titles…"
              className="h-11 w-full rounded-full border border-white/12 bg-white/[0.03] pl-10 pr-4 text-sm text-foreground outline-none transition placeholder:text-slate-400 focus:border-cyan-300/60 focus:ring-2 focus:ring-cyan-300/30"
            />
          </label>
          <Toggle pressed={liveOnly} onPressedChange={setLiveOnly} label="Live only" />
          <Toggle pressed={codeOnly} onPressedChange={setCodeOnly} label="Public code" />
          {dirty && (
            <Button variant="ghost" size="sm" onClick={reset}>
              <X aria-hidden="true" /> Clear filters
            </Button>
          )}
          <p role="status" aria-live="polite" className="ml-auto font-mono text-xs text-slate-400">
            Showing {visible.length} of {archiveProjects.length}
          </p>
        </div>
      </div>

      {filtered.length > 0 ? (
        <>
          <ul className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {visible.map((p) => (
              <li key={p.slug} className="h-full">
                <CompactCard project={p} />
              </li>
            ))}
          </ul>
          {canToggle && (
            <div className="mt-6 flex justify-center">
              <Button variant="outline" onClick={toggle} aria-expanded={expanded}>
                {expanded ? (
                  <>
                    Show fewer <ChevronUp aria-hidden="true" />
                  </>
                ) : (
                  <>
                    Show all {filtered.length} projects <ChevronDown aria-hidden="true" />
                  </>
                )}
              </Button>
            </div>
          )}
        </>
      ) : (
        <div className="mt-8 rounded-2xl border border-dashed border-white/15 px-6 py-14 text-center">
          <p className="font-display text-xl">No projects match those filters.</p>
          <Button variant="outline" size="sm" className="mt-4" onClick={reset}>
            Clear filters
          </Button>
        </div>
      )}
    </div>
  )
}

function Toggle({ pressed, onPressedChange, label }: { pressed: boolean; onPressedChange: (v: boolean) => void; label: string }) {
  return (
    <button
      type="button"
      aria-pressed={pressed}
      onClick={() => onPressedChange(!pressed)}
      className={cn(
        "inline-flex h-11 items-center gap-2 rounded-full border px-4 text-sm transition",
        pressed
          ? "border-cyan-300/60 bg-cyan-300/10 text-cyan-100"
          : "border-white/12 bg-white/[0.03] text-slate-300 hover:border-white/30 hover:text-white",
      )}
    >
      <span
        aria-hidden="true"
        className={cn("size-2 rounded-full transition", pressed ? "bg-cyan-300 shadow-[0_0_10px_rgb(34_211_238)]" : "bg-slate-500")}
      />
      {label}
    </button>
  )
}
