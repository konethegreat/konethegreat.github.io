import { Reveal } from "@/components/fx/Reveal"
import { SectionHeading } from "@/components/ui/section-heading"
import { journey } from "@/data/journey"
import { useMediaQuery } from "@/lib/hooks"
import { cn } from "@/lib/utils"
import OrbitalTimeline from "./OrbitalTimeline"
import { JourneyBody, JourneyMeta, journeyIcons, statusMeta } from "./journey-shared"

const numberWords = ["Zero", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine", "Ten", "Eleven", "Twelve"]
/** Counted from the data, so the sentence stays true when a chapter is added or removed. */
const chapterCount = numberWords[journey.length] ?? String(journey.length)

export function Journey() {
  // The orbit needs room. Below the md breakpoint the same chapters become a vertical timeline.
  const wide = useMediaQuery("(min-width: 768px)", true)

  return (
    <section id="journey" aria-labelledby="journey-title" className="section-anchor relative py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          id="journey-title"
          index="05"
          eyebrow="Journey"
          title={
            <>
              The path so far, <span className="text-gradient">in orbit.</span>
            </>
          }
          lead={
            wide
              ? `${chapterCount} chapters, from school leadership to building Vigil, and what comes next. Select a node to bring it to the front, then follow the dashed lines to the chapters it connects to.`
              : `${chapterCount} chapters, from school leadership to building Vigil, and what comes next. Oldest at the top.`
          }
        />
        {wide ? (
          <Reveal>
            <OrbitalTimeline />
          </Reveal>
        ) : (
          <JourneyList />
        )}
      </div>
    </section>
  )
}

function JourneyList() {
  return (
    <ol className="relative space-y-5 pl-9">
      <span
        aria-hidden="true"
        className="absolute bottom-2 left-[13px] top-2 w-px bg-gradient-to-b from-cyan-400/70 via-violet-400/50 to-transparent"
      />
      {journey.map((node) => {
        const Icon = journeyIcons[node.icon]
        const meta = statusMeta[node.status]
        return (
          <li key={node.id} className="relative">
            <span
              aria-hidden="true"
              className={cn(
                "absolute -left-9 top-5 grid size-7 place-items-center rounded-full border bg-[#0c1024] text-slate-200",
                node.status === "now" && "border-emerald-400/60 text-emerald-300",
                node.status === "next" && "border-dashed border-amber-300/60 text-amber-200",
                node.status === "done" && "border-cyan-300/40 text-cyan-200",
              )}
            >
              <Icon className="size-3.5" />
            </span>
            <Reveal>
              <article className="glass rounded-2xl p-5" aria-label={`${node.title}, ${meta.label.toLowerCase()}`}>
                <JourneyMeta node={node} />
                <JourneyBody node={node} headingLevel={3} />
              </article>
            </Reveal>
          </li>
        )
      })}
    </ol>
  )
}
